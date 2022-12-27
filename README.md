# 프로젝트 소개

## 주요기능

- 회원별 적립금 합계 조회

- 회원별 적립금 적립/사용 내역 조회

  - 페이징 처리

- 회원별 적립금 적립

  - 적립금의 유효기간 구현 (1년)

- 회원별 적립금 사용

  - 적립금 사용시 우선순위는 먼저 적립된 순서로 사용(FIFO)

- 회원별 적립금 사용취소
  - 적립금 사용 API 호출하는 쪽에서 Rollback 처리를 위한 용도

## 기타

API에서 회원정보는 '회원번호(회원에게 부여된 유니크한 번호)' 이외의 다른 정보는 전달받지 않음

<br><br>

# 백엔드서버 및 DB 구성

- 전체

  - Docker DB 및 백엔드 개발 환경

  <br>

- 백엔드서버 (port: 3000)

  - 프레임워크: nest.js

  - 주요 적용사

    - TypeScript
    - prettier, eslint
    - typeORM
    - Swagger
    - husky

  <br>

- DB 서버

  - MySQL (port: 3306)

<br><br>

# 개발환경 구축 가이드

## 설치 및 구성

```bash
# 1. 프로젝트 생성
git clone git@github.com:bmmaker/nestjs-api-point.git

# 2. 프로젝트 폴더로 이동
cd nestjs-api-point

# 3. 의존성 설치
yarn install
```

설치가 끝났으면 `.env.example` 파일명을 `.env`로 수정합니다.

```
# APP
APP_PORT=3000

# DATABASE
DB_TYPE=mysql
DB_HOST=db
DB_PORT=3306
DB_ROOT_PASSWORD=rootpass
DB_NAME=test
DB_USERNAME=test
DB_PASSWORD=test
```

`.env`를 본인이 사용하려는 DB 연결 정보에 맞게 수정하면 됩니다. 예시 `.env`를 사용하게 되면 `DB_HOST`가 Docker 컨테이너에서 올라가는 데이터베이스를 사용하도록 설정했습니다.

<br>

## Docker 개발환경

Dockerfile.loc 와 Dockerfile.dev 는 로컬에서 개발 환경으로 사용하는 목적이고 Dockerfile은 운영 환경에서 사용할 수 있도록 최적화했습니다.

Dockerfile.loc 은 DB만 docker 환경에 올리고
Dockerfile.dev 는 DB + node.js(nest.js) 모두 docker 환경으로 사용하도록 하였습니다.

<br>

## Docker 설치

- https://www.docker.com \
  운영체제에 맞는 docker 다운로드 및 설치

- 터미널(cmd 등)에서 정상 설치 확인

```
$ docker -v
Docker version 20.10.17, build 100c701
```

## Docker 환경 실행

```bash
# 실행
$ docker-compose -f docker-compose.dev.yml up -d

# 재시작
$ docker-compose -f docker-compose.dev.yml restart

# 중지
$ docker-compose -f docker-compose.dev.yml down

# 중지 (도커 볼륨 삭제)
$ docker-compose -f docker-compose.dev.yml down -v
```

## 백엔드 실행

```bash
# 운영 환경으로 실행
$ yarn start:prod

# 개발 환경으로 실행
$ yarn start:dev
```

## 테스트

```bash
$ yarn test
```

## Swagger API Documents

- http://localhost:3000/api-docs
