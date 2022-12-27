import { Repository } from 'typeorm';
import { Point } from './point.entity';
import { CustomRepository } from '../../decorator/typeorm-ex.decorator';

@CustomRepository(Point)
export class PointRepository extends Repository<Point> {}
