import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PointAbstractDTO {
  @IsNotEmpty({ message: '금액(amount)은 필수값입니다.' })
  @IsNumber()
  @ApiProperty({ description: '금액', default: 10000 })
  amount!: number;

  @IsNotEmpty({ message: '맴버ID(memberId)은 필수값입니다.' })
  @IsNumber()
  @ApiProperty({ description: '맴버ID', default: 1 })
  memberId!: number;
}
