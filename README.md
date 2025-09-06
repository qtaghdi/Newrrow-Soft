# 한국어 회고피드 애플리케이션

뉴로우 플랫폼의 회고 피드 시스템을 구현한 React 애플리케이션입니다.

## 🚀 기술 스택

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React

## 📁 프로젝트 구조

```
src/
├── components/
│   └── common/
│       ├── layout.tsx          # 메인 레이아웃 컴포넌트
│       ├── router.tsx          # 라우팅 설정
│       └── sidebar.tsx         # 네비게이션 사이드바
├── constants/
│   └── navigation.tsx          # 네비게이션 메뉴 상수
├── pages/
│   ├── home.tsx               # 홈 페이지 (회고피드)
│   ├── knowledge.tsx          # 지식 페이지
│   ├── study.tsx              # 학일 페이지
│   ├── program.tsx            # 프로그램 페이지
│   ├── growth.tsx             # 성장 페이지
│   └── my.tsx                 # 마이페이지
├── types/
│   └── index.ts               # TypeScript 타입 정의
├── App.tsx                    # 메인 앱 컴포넌트
└── main.tsx                   # 앱 진입점
```

## 🎨 주요 기능-

### 회고피드 시스템
- 회고 카드 목록 표시
- 회고 온도 시각화
- 댓글 및 좋아요 기능
- 검색 및 필터링
- 읽음/안읽음 상태 관리

### UI/UX 특징
- 드롭다운 메뉴가 있는 사이드바
- 카드 기반 레이아웃
- 직관적인 한국어 인터페이스
- 부드러운 호버 효과 (#f5f5f5)

## 🛠️ 설치 및 실행

### 필수 요구사항
- Node.js 18+ 
- npm 

### 설치
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 📱 화면 구성

### 메인 레이아웃
- **왼쪽**: 네비게이션 사이드바 (고정 너비 224px)
- **오른쪽**: 메인 콘텐츠 영역 (가변 너비)

### 사이드바 메뉴
- 홈, 학일, 성장: 단일 페이지
- 지식, 프로그램, 마이페이지: 드롭다운 서브메뉴

### 회고피드 카드
- 작성자 정보 (이름, 학급)
- 회고 내용 미리보기
- 회고 온도 표시
- 상호작용 버튼 (댓글, 좋아요)
- 읽음 상태 표시

## 🎯 개발 가이드

### 컴포넌트 작성 규칙
```typescript

const ComponentName = () => {
  return <div>Content</div>;
};

export default ComponentName;
```

### 절대 경로 사용
```typescript

import Layout from '@/components/common/layout';
import { SIDEBAR_ITEMS } from '@/constants/navigation';
```

### 타입 정의
- `src/types/index.ts`에 인터페이스 정의
- `src/constants/`에 상수 정의

## 🔧 설정 파일

- **Vite**: `vite.config.ts` - 빌드 도구 설정
- **TypeScript**: `tsconfig.app.json` - 타입스크립트 설정
- **Tailwind**: `tailwind.config.js` - 스타일링 설정
- **ESLint**: `eslint.config.js` - 코드 품질 관리

## 📄 라이선스

이 프로젝트는 뉴로우 플랫폼의 일부입니다.