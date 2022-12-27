import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Point } from '../point/point.entity';

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'id' })
  id: number;

  @Column({ length: 50 })
  @ApiProperty({ description: '이름' })
  membername: string;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({ description: '생성일시분초' })
  public createdAt: Date;

  @OneToMany(() => Point, (point) => point.member, {
    eager: true,
  })
  points?: any[];

  static of(params: Partial<Member>): Member {
    const member = new Member();
    Object.assign(member, params);

    return member;
  }

  static create(membername: string) {
    const member = new Member();
    member.membername = membername;

    return member;
  }

  update(membername: string): void {
    this.membername = membername;
  }
}
