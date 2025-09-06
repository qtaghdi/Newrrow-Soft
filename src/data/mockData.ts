import { RetrospectiveCard, User } from '@/types';

// Mock 사용자 데이터
export const mockUsers: User[] = [
  { name: '김준호', email: 'kim@example.com', class: '1-1' },
  { name: '문태완', email: 'moon@example.com', class: '1-1' },
  { name: '김민수', email: 'kimms@example.com', class: '1-2' },
  { name: '이지은', email: 'lee@example.com', class: '2-1' },
  { name: '박서준', email: 'park@example.com', class: '2-2' },
];

// Mock 회고 데이터
export const mockRetrospectives: RetrospectiveCard[] = [
  {
    id: '1',
    author: mockUsers[0],
    content: 'DCC 인공지능 캠프의 첫 멘토링 데이를 맞두고 과제 진행 속도를 높이고 있다. 고려해야 할 문제를 해결하며 데이터셋의 시각화 요소를 개발했다. 다양한 데이터셋 중 y2 데이터셋이 학습에 적합하다는 결론을 얻었고, 시각화를 통해 데이터에 대한 직관적인 이해가 필요함을 느꼈다. 앞으로는 matplotlib 같은 도구를 활용해 데이터를 시각화할 계획이다. 비록 일정 속도는 장...',
    temperature: 78,
    comments: 0,
    likes: 0,
    isLiked: false,
    date: '2025.01.04',
    isRead: true
  },
  {
    id: '2',
    author: mockUsers[1],
    content: '오늘은 디지털 리터러시에 성공하고, 새롭게 방과후 데이터사이언스 온라인도 잘 이루었다. 그러나 생산적인 활동이 부족해 아쉬움이 남는다. 나로선 프로젝트의 요구사항 명세서를 개선하고, 팀의 주제를 구체화하며 디지털 인력을 보강했다. JS 특성 방식은 실무 중심으로 진행하여 실무 경험을 쌓으려 한다. 방과후 활동 시간은 데이터사이언스에 집중하여 효율적으로 활동할 계획이다. 내일 마이...',
    temperature: 32,
    comments: 1,
    likes: 3,
    isLiked: false,
    date: '2025.01.04',
    isRead: true
  },
  {
    id: '3',
    author: mockUsers[2],
    content: '오늘 React 컴포넌트 설계에 대해 깊이 있게 학습했다. 함수형 컴포넌트와 훅을 활용한 상태 관리의 중요성을 깨달았고, 특히 useEffect의 의존성 배열 관리가 성능에 미치는 영향을 실습을 통해 체감할 수 있었다. 내일은 Context API를 활용한 전역 상태 관리를 학습할 예정이다.',
    temperature: 67,
    comments: 2,
    likes: 1,
    isLiked: false,
    date: '2025.01.03',
    isRead: false
  },
  {
    id: '4',
    author: mockUsers[3],
    content: '팀 프로젝트에서 API 설계를 담당하게 되었다. RESTful API의 원칙을 준수하면서도 프론트엔드 팀의 요구사항을 만족시키는 것이 생각보다 어려웠다. 특히 데이터 구조를 어떻게 설계할지에 대한 고민이 많았다. 멘토님과의 상담을 통해 좋은 방향을 찾을 수 있었고, 내일부터 본격적인 개발에 들어갈 예정이다.',
    temperature: 45,
    comments: 0,
    likes: 2,
    isLiked: false,
    date: '2025.01.03',
    isRead: false
  },
  {
    id: '5',
    author: mockUsers[4],
    content: '알고리즘 문제 해결 능력을 기르기 위해 매일 코딩 테스트 문제를 풀고 있다. 오늘은 동적 계획법 문제를 해결했는데, 처음에는 접근 방법을 찾지 못해 어려웠지만 단계별로 문제를 분해해서 해결할 수 있었다. 문제 해결 과정에서 논리적 사고력이 향상되는 것을 느꼈다.',
    temperature: 89,
    comments: 1,
    likes: 0,
    isLiked: false,
    date: '2025.01.02',
    isRead: false
  },
  {
    id: '6',
    author: mockUsers[1],
    content: '팀 프로젝트에서 백엔드 API 개발을 담당하게 되었다. Node.js와 Express를 사용해서 RESTful API를 구축하는 과정에서 많은 것을 배웠다. 특히 데이터베이스 설계와 API 문서화의 중요성을 깨달았다. 내일은 프론트엔드 팀과 API 연동 테스트를 진행할 예정이다.',
    temperature: 71,
    comments: 0,
    likes: 1,
    isLiked: false,
    date: '2025.01.04',
    isRead: false
  },
  {
    id: '7',
    author: mockUsers[3],
    content: '오늘은 CSS Grid와 Flexbox를 활용한 반응형 웹 디자인을 학습했다. 복잡한 레이아웃도 Grid를 사용하면 간단하게 구현할 수 있다는 것을 알게 되었다. 특히 모바일 퍼스트 접근법의 중요성을 실감했다. 다양한 디바이스에서 일관된 사용자 경험을 제공하는 것이 얼마나 중요한지 깨달았다.',
    temperature: 58,
    comments: 2,
    likes: 0,
    isLiked: false,
    date: '2025.01.03',
    isRead: false
  },
  {
    id: '8',
    author: mockUsers[0],
    content: '머신러닝 모델의 성능을 개선하기 위해 하이퍼파라미터 튜닝을 진행했다. Grid Search와 Random Search를 비교해보니 Random Search가 더 효율적이었다. 모델의 정확도가 85%에서 92%로 향상되어 매우 만족스럽다. 내일은 모델을 실제 서비스에 배포하는 과정을 학습할 예정이다.',
    temperature: 94,
    comments: 1,
    likes: 2,
    isLiked: false,
    date: '2025.01.02',
    isRead: false
  },
  {
    id: '9',
    author: mockUsers[2],
    content: '데이터베이스 정규화에 대해 학습하면서 실제 프로젝트에 적용해보았다. 1NF부터 3NF까지 단계별로 정규화를 진행하니 데이터 중복이 크게 줄어들었다. 하지만 조인 연산이 복잡해져서 성능 최적화가 필요하다는 것을 깨달았다. 인덱스 설계의 중요성도 함께 배울 수 있었다.',
    temperature: 23,
    comments: 0,
    likes: 1,
    isLiked: false,
    date: '2025.01.02',
    isRead: false
  },
  {
    id: '10',
    author: mockUsers[4],
    content: '오늘은 Docker를 활용한 컨테이너화 작업을 진행했다. 개발 환경과 운영 환경의 차이로 인한 문제를 해결할 수 있어서 매우 유용했다. Dockerfile 작성부터 docker-compose를 활용한 멀티 컨테이너 관리까지 전반적인 과정을 익혔다. 앞으로는 Kubernetes도 학습해볼 계획이다.',
    temperature: 82,
    comments: 3,
    likes: 0,
    isLiked: false,
    date: '2025.01.01',
    isRead: false
  }
];

// Mock API 함수들
export const mockAPI = {
  getRetrospectives: (): Promise<RetrospectiveCard[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockRetrospectives);
      }, 500); // 실제 API 호출을 시뮬레이션
    });
  },

  markAsRead: (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const item = mockRetrospectives.find(r => r.id === id);
        if (item) {
          item.isRead = true;
        }
        resolve();
      }, 200);
    });
  },

  addLike: (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const item = mockRetrospectives.find(r => r.id === id);
        if (item) {
          item.likes += 1;
          item.isLiked = true;
        }
        resolve();
      }, 200);
    });
  },

  removeLike: (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const item = mockRetrospectives.find(r => r.id === id);
        if (item && item.likes > 0) {
          item.likes -= 1;
          item.isLiked = false;
        }
        resolve();
      }, 200);
    });
  }
};