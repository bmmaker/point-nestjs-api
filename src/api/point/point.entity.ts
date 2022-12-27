import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from './point.enum';
import { Member } from '../member/member.entity';
import { PointUse } from './point-use.entity';

@Entity()
export class Point {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'id' })
  id: number;

  @Column({
    type: 'enum',
    enum: Category,
  })
  @Column({ nullable: false })
  @ApiProperty({ description: '구분' })
  category: Category;

  @Column('int', { nullable: false })
  @ApiProperty({ description: '금액' })
  amount: number;

  @Column('varchar', { nullable: false })
  @ApiProperty({ description: '적요' })
  breakdown: string;

  @Column('date', { name: 'expiration_date', nullable: true })
  @ApiProperty({ description: '유효기간 만료일자' })
  expirationDate: string | Date;

  @Column('int', { name: 'member_id', nullable: false })
  @ApiProperty({ description: '회원ID' })
  memberId: number;

  @ManyToOne(() => Member, (member) => member.points)
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @OneToMany(() => PointUse, (pointUse) => pointUse.point, {
    eager: true,
  })
  pointUses?: any[];

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({ description: '생성일시분초' })
  public createdAt: Date;

  static of(params: Partial<Point>): Point {
    const point = new Point();
    Object.assign(point, params);

    return point;
  }

  static create(
    category: Category,
    amount: number,
    breakdown: string,
    expirationDate: string | Date,
    memberId: number,
  ) {
    const point = new Point();
    point.category = category;
    point.amount = amount;
    point.breakdown = breakdown;
    point.expirationDate = expirationDate;
    point.memberId = memberId;

    return point;
  }

  update(
    category: Category,
    amount: number,
    breakdown: string,
    expirationDate: string | Date,
    memberId: number,
  ): void {
    this.category = category;
    this.amount = amount;
    this.breakdown = breakdown;
    this.expirationDate = expirationDate;
    this.memberId = memberId;
  }
}
