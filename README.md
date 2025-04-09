# Voli API

## 개발 환경 설정

### 의존성
- Node.js 22
- Docker
- pnpm

### 의존성 설치
```bash
pnpm install
```

### 개발 서버 실행

1. Docker 컨테이너 실행
```bash
docker-compose up -d
```

2. 개발 서버 시작
```bash
pnpm start:dev
```

서버가 http://localhost:3000 에서 실행됩니다.
API 문서는 [이 곳](http://127.0.0.1:3000/docs)에서 확인할 수 있습니다.

### 테스트 실행
```bash
# 단위 테스트
pnpm test

# E2E 테스트
pnpm test:e2e

# 테스트 커버리지 확인
pnpm test:cov
```

### 린트 실행
```bash
pnpm lint
``` 