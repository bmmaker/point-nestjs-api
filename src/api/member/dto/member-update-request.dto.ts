import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MemberUpdateRequestDto {
  @IsNotEmpty({ message: '이름(membername)은 필수값입니다.' })
  @IsString({ message: '이름(membername)의 형식이 올바르지 않습니다.' })
  @Length(1, 50)
  @ApiProperty({ description: '이름' })
  membername: string;
}
