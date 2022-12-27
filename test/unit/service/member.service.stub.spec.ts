import { Test, TestingModule } from '@nestjs/testing';
import { Member } from 'src/api/member/member.entity';
import { MemberService } from 'src/api/member/member.service';
import { MemberCreateRequestDto } from 'src/api/member/dto/member-create-request.dto';
import { MemberRepository } from 'src/api/member/member.repository';

describe('MemberService (Stub)', () => {
  let memberService: MemberService;
  let memberRepository: MemberRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemberService, MemberRepository],
    }).compile();

    memberService = module.get<MemberService>(MemberService);
    memberRepository = module.get<MemberRepository>(MemberRepository);
  });

  describe('createMember', () => {
    it('유저를 생성하고, 생성한 유저를 반환한다', async () => {
      const membername = '태의';
      const requestDto = new MemberCreateRequestDto();
      requestDto.membername = membername;
      const createdMemberEntity = requestDto.toEntity();
      const savedMember = Member.of({
        id: 1,
        membername: membername,
      });
      const memberRepositorySaveSpy = jest
        .spyOn(memberRepository, 'save')
        .mockResolvedValue(savedMember);

      const result = await memberService.createMember(requestDto);

      expect(memberRepositorySaveSpy).toBeCalledWith(createdMemberEntity);
      expect(result).toBe(savedMember);
    });
  });

  describe('findAll', () => {
    it('생성된 모든 유저 목록을 반환한다', async () => {
      const existingMemberList = [
        Member.of({
          id: 1,
          membername: '태의',
        }),
        Member.of({
          id: 2,
          membername: '길동',
        }),
      ];
      const memberRepositoryFindSpy = jest
        .spyOn(memberRepository, 'find')
        .mockResolvedValue(existingMemberList);

      const result = await memberService.findAll();

      expect(memberRepositoryFindSpy).toBeCalled();
      expect(result).toStrictEqual(existingMemberList);
    });
  });
});
