import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Point } from './point.entity';

@Entity('point_use')
export class PointUse {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'id' })
  id: number;

  @Column('int', { name: 'point_id_use' })
  pointIdUse: number;

  @Column('int', { name: 'point_id' })
  pointId: number;

  @Column('int', { nullable: false })
  @ApiProperty({ description: '금액' })
  amount: number;

  @ManyToOne(() => Point, (point) => point.pointUses)
  @JoinColumn({ name: 'point_id' })
  point: Point;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({ description: '생성일시분초' })
  public createdAt: Date;

  static of(params: Partial<Point>): Point {
    const point = new Point();
    Object.assign(point, params);

    return point;
  }

  static create(pointIdUse: number, pointId: number, amount: number) {
    const pointUse = new PointUse();
    pointUse.pointIdUse = pointIdUse;
    pointUse.pointId = pointId;
    pointUse.amount = amount;

    return pointUse;
  }

  update(pointIdUse: number, pointId: number, amount: number): void {
    this.pointIdUse = pointIdUse;
    this.pointId = pointId;
    this.amount = amount;
  }
}
