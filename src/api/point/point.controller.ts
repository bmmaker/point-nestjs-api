import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
  Res,
  HttpStatus,
  Query,
  DefaultValuePipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { PointService } from './point.service';
import { Point } from './point.entity';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { SavePointDTO, UseCanclePointDTO, UsePointDTO } from './dto/point.dto';

@Controller('points')
@ApiTags('포인트 API')
export class PointController {
  constructor(private readonly pointService: PointService) {}

  @Get(':catecory/:memberId')
  @ApiOperation({ summary: '모든 포인트 조회 API' })
  @ApiOkResponse({ description: '모든 포인트를 조회한다.', type: Point })
  async findAll(
    @Param('catecory') catecory: string,
    @Param('memberId') memberId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Point>> {
    limit = limit > 100 ? 100 : limit;
    return this.pointService.findAll({
      catecory: catecory,
      memberId: memberId,
      options: {
        page,
        limit,
        route: `http://${process.env.MYSQL_HOST}:${process.env.NODE_SERVER_PORT}/points/${catecory}/${memberId}`,
      },
    });
  }

  @Post('save')
  @ApiOperation({
    summary: '포인트 적립 API',
    description: '포인트를 적립한다.',
  })
  @ApiCreatedResponse({ description: '포인트를 적립한다.', type: Point })
  @UsePipes(ValidationPipe)
  async save(@Body() requestDto: SavePointDTO, @Res() res: Response) {
    const point = await this.pointService.save(requestDto);
    return res.status(HttpStatus.CREATED).json(point);
  }

  @Post('use')
  @ApiOperation({
    summary: '포인트 사용 API',
    description: '포인트를 사용한다.',
  })
  @ApiCreatedResponse({ description: '포인트를 사용한다.', type: Point })
  @UsePipes(ValidationPipe)
  async create(@Body() requestDto: UsePointDTO, @Res() res: Response) {
    const point = await this.pointService.save(requestDto);
    return res.status(HttpStatus.CREATED).json(point);
  }

  @Post('cancle')
  @ApiOperation({
    summary: '포인트 사용 취소 API',
    description: '포인트 사용을 취소한다.',
  })
  @ApiCreatedResponse({ description: '포인트 사용을 취소한다.', type: Point })
  @UsePipes(ValidationPipe)
  async useCancle(@Body() requestDto: UseCanclePointDTO, @Res() res: Response) {
    const point = await this.pointService.save(requestDto);
    return res.status(HttpStatus.CREATED).json(point);
  }

  @Get(':memberId/sum')
  @ApiOperation({ summary: '포인트 합계 조회 API' })
  @ApiOkResponse({
    description: '회원별 적립금 합계를 조회한다.',
  })
  async find(
    @Param('id', new ParseIntPipe()) memberId: number,
    @Res() res: Response,
  ): Promise<any> {
    const sum = this.pointService.sum(memberId);
    // return res.status(HttpStatus.OK).json(sum);
    return res.status(HttpStatus.OK).json({ sum });
  }
}
