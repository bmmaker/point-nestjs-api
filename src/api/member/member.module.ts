import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '../../database/typeorm-ex.module';
import { MemberRepository } from './member.repository';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([MemberRepository])],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
