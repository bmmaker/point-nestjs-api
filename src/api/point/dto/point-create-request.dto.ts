import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
// import { Point } from '../point.entity';

export class PointCreateRequestDto {
  @IsNotEmpty({ message: '이름(firstName)은 필수값입니다.' })
  @IsString({ message: '이름(firstName)의 형식이 올바르지 않습니다.' })
  @Length(1, 50)
  @ApiProperty({ description: '이름' })
  firstName: string;

  @IsNotEmpty({ message: '성(lastName)은 필수값입니다.' })
  @IsString({ message: '성(lastName)의 형식이 올바르지 않습니다.' })
  @Length(1, 50)
  @ApiProperty({ description: '성' })
  lastName: string;

  // toEntity(): Point {
  //   return Point.create(this.firstName, this.lastName);
  // }
}
