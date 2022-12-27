import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Category } from './../point.enum';
import { PointAbstractDTO } from './point.abstract.dto';
import { Point } from './../point.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SavePointDTO extends PointAbstractDTO {
  @IsNotEmpty({ message: '구분(category)은 필수값입니다.' })
  @ApiProperty({
    description: '구분: 적립(SAVE), 사용(USE), 취소(USE_CANCLE)',
    default: Category.SAVE,
  })
  category!: Category;

  @IsNotEmpty({ message: '적요(breakdown)은 필수값입니다.' })
  @IsString({ message: '적요(breakdown)의 형식이 올바르지 않습니다.' })
  @ApiProperty({ description: '적요', default: '적립금 적립' })
  breakdown!: string;

  @ApiPropertyOptional()
  //{
  // description: '유효기간 만료일자',
  // default: null,
  //}
  expirationDate: string | Date;

  toEntity(): Point {
    return Point.create(
      this.category,
      this.amount,
      this.breakdown,
      this.expirationDate,
      this.memberId,
    );
  }
}

export class UsePointDTO extends PointAbstractDTO {
  @IsNotEmpty({ message: '구분(category)은 필수값입니다.' })
  @ApiProperty({
    description: '구분: 적립(SAVE), 사용(USE), 취소(USE_CANCLE)',
    default: Category.USE,
  })
  category: Category;

  @IsNotEmpty({ message: '적요(breakdown)은 필수값입니다.' })
  @IsString({ message: '적요(breakdown)의 형식이 올바르지 않습니다.' })
  @ApiProperty({ description: '적요' })
  breakdown = '적립금 사용';

  @IsNotEmpty({ message: '유효기간 만료일자(expirationDate)은 필수값입니다.' })
  @ApiProperty({ description: '유효기간 만료일자' })
  expirationDate: string | Date = '9999-12-31';

  toEntity(): Point {
    return Point.create(
      this.category,
      this.amount,
      this.breakdown,
      this.expirationDate,
      this.memberId,
    );
  }
}

export class UseCanclePointDTO extends PointAbstractDTO {
  @IsNotEmpty()
  @IsNumber()
  public id: number;

  @IsNotEmpty({ message: '구분(category)은 필수값입니다.' })
  @ApiProperty({
    description: '구분: 적립(SAVE), 사용(USE), 취소(USE_CANCLE)',
  })
  category: Category = Category.USE_CANCLE;

  @IsNotEmpty({ message: '적요(breakdown)은 필수값입니다.' })
  @IsString({ message: '적요(breakdown)의 형식이 올바르지 않습니다.' })
  @ApiProperty({ description: '적요' })
  breakdown = '적립금 사용 취소';

  @IsNotEmpty({ message: '유효기간 만료일자(expirationDate)은 필수값입니다.' })
  @ApiProperty({ description: '유효기간 만료일자' })
  expirationDate: string | Date = '9999-12-31';

  toEntity(): Point {
    return Point.create(
      this.category,
      this.amount,
      this.breakdown,
      this.expirationDate,
      this.memberId,
    );
  }
}
