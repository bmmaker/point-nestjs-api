import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from 'src/api/user/user.module';
import { getTestMysqlModule } from '../../util/get-test-mysql.module';
import { UserService } from 'src/api/user/user.service';
import { NotFoundException } from '@nestjs/common';
import { UserRepository } from 'src/api/user/user.repository';
import { UserCreateRequestDto } from 'src/api/user/dto/user-create-request.dto';
import { UserUpdateRequestDto } from 'src/api/user/dto/user-update-request.dto';

describe('UserService', () => {
  let sut: UserService;
  let dataSource: DataSource;
  let userRepository: UserRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule, getTestMysqlModule()],
      providers: [UserService, UserRepository],
    }).compile();

    sut = module.get<UserService>(UserService);
    dataSource = module.get<DataSource>(DataSource);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  beforeEach(async () => {
    await userRepository.clear();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('createUser', () => {
    it('유저를 생성하고, 생성한 유저를 반환한다', async () => {
      const requestDto = new UserCreateRequestDto();
      requestDto.firstName = '태의';
      requestDto.lastName = '이';

      const result = await sut.createUser(requestDto);

      expect(result.id).toBe(1);
      expect(result.firstName).toBe('태의');
      expect(result.lastName).toBe('이');
      expect(result.isActive).toBe(true);
    });
  });

  describe('findAll', () => {
    it('생성된 모든 유저 목록을 반환한다', async () => {
      await userRepository.save({ firstName: '태의', lastName: '이' });
      await userRepository.save({ firstName: '길동', lastName: '홍' });

      const result = await sut.findAll();

      expect(result[0].firstName).toBe('태의');
      expect(result[0].lastName).toBe('이');
      expect(result[1].firstName).toBe('길동');
      expect(result[1].lastName).toBe('홍');
    });
  });

  describe('findById', () => {
    it('생성되지 않은 유저의 id가 주어진다면 유저를 찾을 수 없다는 예외를 던진다', async () => {
      const userId = 1;

      const result = async () => {
        await sut.findById(userId);
      };

      await expect(result).rejects.toThrowError(
        new NotFoundException('유저 정보를 찾을 수 없습니다.'),
      );
    });

    it('생성된 유저의 id가 주어진다면 해당 id의 유저를 반환한다', async () => {
      const userId = 1;
      await userRepository.save({ firstName: '태의', lastName: '이' });

      const result = await sut.findById(userId);

      expect(result.firstName).toBe('태의');
      expect(result.lastName).toBe('이');
    });
  });

  describe('updateUser', () => {
    const requestDto: UserUpdateRequestDto = {
      firstName: '길동',
      lastName: '이',
      isActive: false,
    };

    it('생성되지 않은 유저의 id가 주어진다면 유저를 찾을 수 없다는 예외를 던진다', async () => {
      const userId = 1;

      const result = async () => {
        await sut.updateUser(userId, requestDto);
      };

      await expect(result).rejects.toThrowError(
        new NotFoundException('유저 정보를 찾을 수 없습니다.'),
      );
    });

    it('생성된 유저의 id가 주어진다면 해당 id의 유저를 수정하고 수정된 유저를 반환한다', async () => {
      const userId = 1;
      await userRepository.save({ firstName: '태의', lastName: '이' });

      const result = await sut.updateUser(userId, requestDto);

      expect(result.id).toBe(1);
      expect(result.firstName).toBe('길동');
      expect(result.lastName).toBe('이');
      expect(result.isActive).toBe(false);
    });
  });

  describe('deleteUser', () => {
    it('생성된 유저의 id가 주어진다면 생성된 유저를 삭제한다', async () => {
      const userId = 1;
      await userRepository.save({ firstName: '태의', lastName: '이' });

      await sut.deleteUser(userId);

      const result = await userRepository.findOne({
        where: { id: userId },
      });
      expect(result).toBeNull();
    });
  });
});
