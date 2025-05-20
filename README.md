# event-reward-platform

## 환경변수

### JWT_SECRET (필수)

JWT 서명 키입니다. 반드시 예측할 수 없는 긴 문자열을 사용해 주세요.

### DATABASE_URL

데이터베이스 연결 문자열입니다. 기본값은 'mongodb://mongo:27017/erp'입니다.

### GATEWAY_PORT

게이트웨이 서비스의 포트 번호입니다. 기본값은 3000입니다.

### AUTH_SERVICE_HOST

인증 서비스의 호스트 이름입니다. 기본값은 'auth'입니다.

### AUTH_SERVICE_PORT

인증 서비스의 포트 번호입니다. 기본값은 4000입니다.

### EVENT_SERVICE_HOST

이벤트 서비스의 호스트 이름입니다. 기본값은 'event'입니다.

### EVENT_SERVICE_PORT

이벤트 서비스의 포트 번호입니다. 기본값은 4001입니다.

## 실행

> `JWT_SECRET` 환경변수 설정을 잊지 마세요!!

```bash
docker compose up -d
```

## 이벤트 조건 설정

```typescript
type EventConditions =
  | {
      url: string;
      condition: any;
    }
  | {
      and: EventConditions[];
    }
  | {
      or: EventConditions[];
    };
```

`url` 필드는 이벤트 조건 만족 여부를 체크하기 위해 요청되는 URL입니다. `{accountId}`를 url에 삽입하면 이벤트 조건 체크 시 현재 계정의 ID로 치환됩니다. 중괄호를 입력할 때는 {{두번}} 입력하면 이스케이프됩니다.
condition 필드는 응답 JSON의 조건을 판별하는 조건식입니다. [Zodex](https://commonbaseapp.github.io/zodex/) 문법을 사용해 Zod 조건문을 직렬화해 입력합니다.

### 예시

```json
{
  "url": "https://jsonplaceholder.typicode.com/posts/1?userId={accountId}",
  "condition": {
    "type": "object",
    "properties": {
      "userId": {
        "type": "number",
        "min": 1,
        "minInclusive": true
      }
    }
  }
}
```
