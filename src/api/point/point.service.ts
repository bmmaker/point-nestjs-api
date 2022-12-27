import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SavePointDTO, UsePointDTO, UseCanclePointDTO } from './dto/point.dto';
import { PointUseDTO } from './dto/point-use.dto';
import { PointRepository } from './point.repository';
import { Connection } from 'typeorm';
import { PointMemberepository } from './point-use.repository';
import { Point } from './point.entity';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class PointService {
  constructor(
    @InjectRepository(PointRepository)
    private pointRepository: PointRepository,
    @InjectRepository(PointMemberepository)
    private pointMemberepository: PointMemberepository,
    private connection: Connection,
  ) {}

  /**
   * 포인트를 적립한다.
   *
   * @param {SavePointDTO} pointDTO - 포인트 저장 Dto
   * @returns {Promise<any>}
   */
  async save(pointDTO: SavePointDTO): Promise<any> {
    return await this.pointRepository.save(pointDTO);
  }

  /**
   * 포인트를 사용한다.
   *
   * @param {UsePointDTO} pointDTO - 포인트 사용 Dto
   * @returns {Promise<any>}
   */
  async use(pointDTO: UsePointDTO): Promise<any> {
    const memberId = Number(pointDTO.memberId);
    let amount = Number(pointDTO.amount);

    const afterUseAmout: number = Number(await this.sum(memberId)) + amount;
    if (afterUseAmout < 0) {
      throw new HttpException(
        '적립금은 마이너스가 될 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const unusedPoints = await this.pointRepository
      .createQueryBuilder('point')
      .leftJoinAndSelect('point.uses', 'point_use')
      .where(
        "point.member_id = :memberId AND point.expirationDate >= DATE_FORMAT(NOW(), '%Y-%m-%d')",
        {
          memberId,
        },
      )
      .select('point.id')
      .addSelect('point.amount - IFNULL(SUM(point_use.amount),0)', 'balance')
      .groupBy('point.id')
      .having('balance > 0')
      .orderBy('point.created_at', 'ASC')
      .getRawMany();

    // transaction
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const pointId = (
        await this.pointRepository.save({
          ...pointDTO,
          expirationDate: '9999-12-31',
        })
      ).id;

      unusedPoints.forEach((point) => {
        const poinUsetDTO: PointUseDTO = new PointUseDTO();
        const balance = Number(point.balance);
        if (amount === 0) return;

        if (-amount <= balance) {
          poinUsetDTO.amount = amount;
          amount = 0;
        } else {
          poinUsetDTO.amount = -balance;
          amount += balance;
        }
        poinUsetDTO.pointId = point.point_id;
        poinUsetDTO.pointIdUse = pointId;
        this.pointMemberepository.save(poinUsetDTO);
      });
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 포인트 사용을 취소한다.
   *
   * @param {UsePointDTO} pointDTO - 포인트 사용취소 Dto
   * @returns {Promise<any>}
   */
  async useCancle(pointDTO: UseCanclePointDTO): Promise<any> {
    const pointIdUse = Number(pointDTO.id);
    const memberId = Number(pointDTO.memberId);

    const usedPoints = await this.pointMemberepository
      .createQueryBuilder('point_use')
      .where('point_use.point_id_use = :pointIdUse', {
        pointIdUse,
      })
      .select('point_use.id')
      .addSelect('point_use.amount', 'amount')
      .addSelect('point_use.point_id', 'point_id')
      .having('amount < 0')
      .orderBy('point_use.created_at', 'ASC')
      .getRawMany();

    // transaction
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const pointIdUse = (
        await this.pointRepository.save({
          category: pointDTO.category,
          breakdown: pointDTO.breakdown,
          amount: -pointDTO.amount,
          memberId: memberId,
          expirationDate: '9999-12-31',
        })
      ).id;

      usedPoints.forEach((usedPoint) => {
        const poinUsetDTO: PointUseDTO = new PointUseDTO();
        poinUsetDTO.amount = -usedPoint.amount;
        poinUsetDTO.pointIdUse = pointIdUse;
        poinUsetDTO.pointId = usedPoint.point_id;
        this.pointMemberepository.save(poinUsetDTO);
      });
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 포인트 사용을 취소한다.
   *
   * @param {UsePointDTO} pointDTO - 포인트 사용 취소 Dto
   * @returns {Promise<any>}
   */
  async sum(memberId: number): Promise<number> {
    const { sum } = await this.pointRepository
      .createQueryBuilder('point')
      .where(
        "point.member_id = :memberId AND point.expirationDate >= DATE_FORMAT(NOW(), '%Y-%m-%d')",
        {
          memberId,
        },
      )
      .select('SUM(point.amount)', 'sum')
      .getRawOne();
    return sum;
  }

  /**
   * 회원별 포인트 내역을 조회한다.
   *
   * @returns {Promise<Pagination<Point>>}
   */
  async findAll({
    catecory,
    memberId,
    options,
  }: {
    catecory: string;
    memberId: number;
    options: IPaginationOptions;
  }): Promise<Pagination<Point>> {
    const queryBuilder = this.pointRepository.createQueryBuilder('point');
    queryBuilder
      .where('point.catecory = :catecory AND point.member_id = :memberId', {
        catecory,
        memberId,
      })
      .orderBy('point.created_at', 'ASC');
    return paginate<Point>(this.pointRepository, options);
  }
}
