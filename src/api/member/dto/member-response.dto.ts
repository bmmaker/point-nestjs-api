import { Member } from '../member.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class MemberResponseDto {
  @Exclude() private readonly _membername: string;

  constructor(member: Member) {
    this._membername = member.membername;
  }

  @ApiProperty({ description: '이름' })
  @Expose()
  get membername(): string {
    return this._membername;
  }
}
