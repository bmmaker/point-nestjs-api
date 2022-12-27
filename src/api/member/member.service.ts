import { NotFoundException, Injectable } from '@nestjs/common';
import { MemberRepository } from './member.repository';
import { Member } from './member.entity';
import { MemberCreateRequestDto } from './dto/member-create-request.dto';
import { MemberUpdateRequestDto } from './dto/member-update-request.dto';
import { isEmpty } from '../../util/shared.util';
import { MemberMessage } from './member.message';
import { MemberResponseDto } from './dto/member-response.dto';

@Injectable()
export class MemberService {
  constructor(private readonly memberRepository: MemberRepository) {}

  /**
   * 맴버를 생성한다.
   *
   * @param {MemberCreateRequestDto} requestDto - 맴버 생성 Dto
   * @returns {Promise<Member>}
   */
  async createMember(requestDto: MemberCreateRequestDto): Promise<Member> {
    return this.memberRepository.save(requestDto.toEntity());
  }

  /**
   * 모든 맴버 정보를 조회한다.
   *
   * @returns {Promise<Member[]>}
   */
  async findAll(): Promise<Member[]> {
    return this.memberRepository.find();
  }

  /**
   * 맴버 Id에 해당하는 맴버 정보를 조회한다.
   *
   * @param {number} id - 맴버 Id
   * @returns {Promise<MemberResponseDto>}
   */
  async findById(id: number): Promise<MemberResponseDto> {
    const member = await this.findMemberById(id);

    return new MemberResponseDto(member);
  }

  /**
   * 맴버 Id에 해당하는 맴버 정보를 수정한다.
   *
   * @param {number} id - 맴버 Id
   * @param {MemberUpdateRequestDto} requestDto - 맴버 수정 Dto
   * @returns {Promise<Member>}
   */
  async updateMember(
    id: number,
    requestDto: MemberUpdateRequestDto,
  ): Promise<Member> {
    const member = await this.findMemberById(id);
    const { membername } = requestDto;

    member.update(membername);

    return this.memberRepository.save(member);
  }

  /**
   * 맴버 Id에 해당하는 맴버 정보를 반환한다.
   *
   * @param {number} id - 맴버 Id
   * @returns {Promise<Member>}
   * @private
   */
  private async findMemberById(id: number): Promise<Member> {
    const member = await this.memberRepository.findOne({
      where: { id: id },
    });

    if (isEmpty(member) === true) {
      throw new NotFoundException(MemberMessage.NOT_FOUND_MEMBER);
    }

    return member;
  }

  /**
   * 맴버 Id에 해당하는 맴버 정보를 삭제한다.
   *
   * @param {number} id - 맴버 Id
   * @returns {Promise<void>}
   */
  async deleteMember(id: number): Promise<void> {
    await this.memberRepository.delete(id);
  }
}
