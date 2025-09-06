# 그룹 기능 API 명세서

뉴로우 플랫폼의 그룹 기능 API 명세서입니다.

## 📋 목차

1. [핵심 기능](#-핵심-기능)
2. [API 엔드포인트](#-api-엔드포인트)
3. [데이터 구조](#-데이터-구조)
4. [에러 처리](#-에러-처리)

## 🎯 핵심 기능

### 1. 그룹화 시스템
- 그룹장이 그룹 생성 및 관리
- 6자리 그룹 코드로 간편 입장
- **단기/장기 그룹 구분**: 프로젝트 성격에 따른 그룹 분류
- **종료일 설정**: 단기 그룹의 경우 종료일 지정 가능
- 목표 포인트 설정 및 진행률 추적

### 2. 퀘스트 시스템
#### 개인 퀘스트
- 개별 멤버가 완료하는 퀘스트
- 포인트 획득으로 랭킹 경쟁
- AI 자동 퀘스트 생성 지원

#### 단체 퀘스트
- 그룹 전체가 협력하는 퀘스트
- 완료 현황 표시 (완료자 수/전체 멤버 수)
- 협업 기반 과제

### 3. 랭킹 및 기여도 시스템
- 멤버별 포인트 랭킹
- 일간/주간/총합 활동 통계
- 완료한 퀘스트 수 추적
- 기여도 차트 시각화

### 4. AI 기반 퀘스트 생성
- 주제별 퀘스트 자동 생성
- 난이도별 분류 (쉬움/보통/어려움)
- 예상 소요 시간 자동 설정

## 🔌 API 엔드포인트

### 그룹 관리

#### 1. 그룹 목록 조회
```http
GET /groups
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "group_123",
      "name": "우리 반 활동",
      "description": "같은 반 친구들과 함께하는 활동과 소통 공간입니다.",
      "code": "ABC123",
      "duration": "long",
      "endDate": null,
      "memberCount": 4,
      "totalPoints": 2840,
      "targetPoints": 5000,
      "showTargetProgress": true,
      "icon": "🏫",
      "isActive": true
    }
  ]
}
```

#### 2. 그룹 생성
```http
POST /groups
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "새로운 스터디 그룹",
  "description": "함께 공부하는 그룹입니다.",
  "duration": "short",
  "endDate": "2025-06-30",
  "targetPoints": 3000,
  "showTargetProgress": true,
  "icon": "📚",
  "maxMembers": 20
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "group_456",
    "name": "새로운 스터디 그룹",
    "code": "DEF456",
    "targetPoints": 3000,
    "duration": "short",
    "endDate": "2025-06-30",
    "leader": {
      "id": "user_123",
      "name": "김준호",
      "role": "leader"
    }
  }
}
```

#### 3. 그룹 참여
```http
POST /groups/join
Content-Type: application/json
```

**Request Body:**
```json
{
  "code": "ABC123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "우리 반 활동 그룹에 성공적으로 참여했습니다!",
  "data": {
    "group": {
      "id": "group_123",
      "name": "우리 반 활동"
    },
    "memberRole": "member"
  }
}
```

#### 4. 그룹 상세 조회
```http
GET /groups/{groupId}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "group_123",
    "name": "우리 반 활동",
    "description": "같은 반 친구들과 함께하는 활동과 소통 공간입니다.",
    "code": "ABC123",
    "leader": {
      "id": "user_123",
      "name": "김준호",
      "role": "leader"
    },
    "members": [...],
    "totalPoints": 2840,
    "targetPoints": 5000,
    "showTargetProgress": true,
    "quests": [...],
    "duration": "long",
    "endDate": null
  }
}
```

#### 5. 그룹 삭제
```http
DELETE /groups/{groupId}
```

#### 6. 그룹 탈퇴
```http
POST /groups/{groupId}/leave
```

### 퀘스트 관리

#### 1. AI 퀘스트 생성
```http
POST /groups/{groupId}/quests/ai-generate
Content-Type: application/json
```

**Request Body:**
```json
{
  "type": "personal",
  "theme": "프로그래밍 학습",
  "count": 5,
  "difficulty": "medium"
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "temp_1",
      "title": "일일 알고리즘 문제 풀기",
      "description": "백준 또는 프로그래머스에서 알고리즘 문제 1개 해결하기",
      "type": "personal",
      "points": 50,
      "estimatedTime": "30분",
      "difficulty": "easy"
    }
  ]
}
```

#### 2. 퀘스트 생성
```http
POST /groups/{groupId}/quests
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "일일 회고 작성하기",
  "description": "오늘 하루를 돌아보며 배운 점과 느낀 점을 회고로 작성해보세요.",
  "type": "personal",
  "points": 50,
  "deadline": "2025-01-06T23:59:59Z",
  "estimatedTime": "20분"
}
```

#### 3. 퀘스트 수정
```http
PUT /quests/{questId}
Content-Type: application/json
```

#### 4. 퀘스트 완료 토글
```http
POST /quests/{questId}/toggle
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": "user_123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isCompleted": true,
    "pointsEarned": 50
  }
}
```

#### 5. 퀘스트 삭제
```http
DELETE /quests/{questId}
```

### 랭킹 및 통계

#### 1. 그룹 랭킹 조회
```http
GET /groups/{groupId}/ranking
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "member": {
        "id": "user_123",
        "name": "김준호",
        "points": 850
      },
      "rank": 1,
      "pointsThisWeek": 255,
      "questsCompletedThisWeek": 3
    }
  ]
}
```

#### 2. 기여도 차트 데이터 조회
```http
GET /groups/{groupId}/contributions/chart?period=weekly
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "member": {
        "id": "user_123",
        "name": "김준호"
      },
      "points": 255,
      "quests": 3,
      "period": "weekly"
    }
  ]
}
```

## 📊 데이터 구조

### Quest
```typescript
interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'personal' | 'group';
  status: 'active' | 'completed' | 'expired';
  points: number;
  deadline?: string;
  createdBy: string;
  completedBy?: string[];
  estimatedTime?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}
```

### Group
```typescript
interface Group {
  id: string;
  name: string;
  description: string;
  code: string;
  leader: GroupMember;
  members: GroupMember[];
  quests: Quest[];
  totalPoints: number;
  targetPoints: number;
  showTargetProgress: boolean;
  icon: string;
  isActive: boolean;
  memberCount: number;
  maxMembers?: number;
  duration: 'short' | 'long';
  endDate?: string;
}
```

### GroupMember
```typescript
interface GroupMember {
  id: string;
  name: string;
  email: string;
  class: string;
  role: 'leader' | 'member';
  points: number;
  completedQuests: number;
  isActive: boolean;
}
```

## 📝 에러 처리

### 공통 에러 응답
```json
{
  "success": false,
  "error": {
    "code": "GROUP_NOT_FOUND",
    "message": "그룹을 찾을 수 없습니다.",
    "details": {}
  }
}
```

### 주요 에러 코드
- `GROUP_NOT_FOUND`: 그룹을 찾을 수 없음
- `INVALID_GROUP_CODE`: 유효하지 않은 그룹 코드
- `PERMISSION_DENIED`: 권한 없음
- `QUEST_LIMIT_EXCEEDED`: 퀘스트 개수 제한 초과
- `ALREADY_COMPLETED`: 이미 완료된 퀘스트
- `GROUP_FULL`: 그룹 정원 초과
- `GROUP_EXPIRED`: 만료된 그룹

### HTTP 상태 코드
- `200 OK`: 요청 성공
- `201 Created`: 리소스 생성 성공
- `400 Bad Request`: 잘못된 요청
- `401 Unauthorized`: 인증 필요
- `403 Forbidden`: 권한 없음
- `404 Not Found`: 리소스를 찾을 수 없음
- `500 Internal Server Error`: 서버 내부 오류