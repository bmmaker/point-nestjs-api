import { IsNotEmpty, IsNumber } from 'class-validator';

export class PointUseDTO {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsNumber()
  pointIdUse: number;

  @IsNotEmpty()
  @IsNumber()
  pointId: number;
}
