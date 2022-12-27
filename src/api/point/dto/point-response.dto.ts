// import { Point } from '../point.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class PointResponseDto {
  @Exclude() private readonly _firstName: string;
  @Exclude() private readonly _lastName: string;

  // constructor(point: Point) {
  //   this._firstName = point.firstName;
  //   this._lastName = point.lastName;
  // }

  @ApiProperty({ description: '이름' })
  @Expose()
  get firstName(): string {
    return this._firstName;
  }

  @ApiProperty({ description: '성' })
  @Expose()
  get lastName(): string {
    return this._lastName;
  }
}
