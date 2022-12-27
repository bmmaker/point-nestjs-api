import { Controller, Get, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { MemberService } from './member.service';
import { Member } from './member.entity';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { MemberCreateRequestDto } from './dto/member-create-request.dto';

@Controller('members')
@ApiTags('맴버 API')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get()
  @ApiOperation({ summary: '모든 맴버 조회 API' })
  @ApiOkResponse({ description: '모든 맴버를 조회한다.', type: Member })
  async findAll(@Res() res: Response) {
    const members = await this.memberService.findAll();

    return res.status(HttpStatus.OK).json(members);
  }

  @Post()
  @ApiOperation({ summary: '맴버 생성 API', description: '맴버를 생성한다.' })
  @ApiCreatedResponse({ description: '맴버를 생성한다.', type: Member })
  async create(
    @Body() requestDto: MemberCreateRequestDto,
    @Res() res: Response,
  ) {
    const member = await this.memberService.createMember(requestDto);

    return res.status(HttpStatus.CREATED).json(member);
  }
}
