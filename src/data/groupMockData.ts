import {
  Quest,
  GroupMember,
  Group,
  GroupJoinResponse,
  QuestCreateRequest,
  GroupCreateRequest,
  QuestCompletionRequest,
  GroupRanking,
  GroupStats,
  AIQuestSuggestion,
  Retrospective,
  RetrospectiveComment
} from '@/types/group';

// Mock 그룹 멤버 데이터
export const mockGroupMembers: GroupMember[] = [
  {
    id: 'gramdemaster',
    name: '그램드마스터',
    email: 'gramdemaster@madist.com',
    class: '개발자',
    role: 'member',
    joinedAt: '2024-12-01',
    points: 0,
    completedQuests: 0,
    avatar: '👨‍💻',
    isActive: true,
    lastActiveAt: '2025-01-05T12:00:00Z'
  },
  {
    id: '1',
    name: '김준호',
    email: 'kim@example.com',
    class: '1-1',
    role: 'leader',
    joinedAt: '2024-12-01',
    points: 850,
    completedQuests: 12,
    avatar: '👨💻',
    isActive: true,
    lastActiveAt: '2025-01-05T10:30:00Z'
  },
  {
    id: '2',
    name: '문태완',
    email: 'moon@example.com',
    class: '1-1',
    role: 'member',
    joinedAt: '2024-12-02',
    points: 720,
    completedQuests: 9,
    avatar: '👨🎓',
    isActive: true,
    lastActiveAt: '2025-01-05T09:15:00Z'
  },
  {
    id: '3',
    name: '김민수',
    email: 'kimms@example.com',
    class: '1-2',
    role: 'member',
    joinedAt: '2024-12-03',
    points: 680,
    completedQuests: 8,
    avatar: '👨🔬',
    isActive: true,
    lastActiveAt: '2025-01-05T08:45:00Z'
  },
  {
    id: '4',
    name: '이지은',
    email: 'lee@example.com',
    class: '2-1',
    role: 'member',
    joinedAt: '2024-12-05',
    points: 590,
    completedQuests: 7,
    avatar: '👩💼',
    isActive: false,
    lastActiveAt: '2025-01-04T16:20:00Z'
  },
  {
    id: '5',
    name: '박서준',
    email: 'park@example.com',
    class: '2-2',
    role: 'member',
    joinedAt: '2024-12-07',
    points: 520,
    completedQuests: 6,
    avatar: '👨🎨',
    isActive: true,
    lastActiveAt: '2025-01-05T11:00:00Z'
  },
  {
    id: '6',
    name: '최유진',
    email: 'choi@example.com',
    class: '1-3',
    role: 'member',
    joinedAt: '2024-12-10',
    points: 480,
    completedQuests: 5,
    avatar: '👩🎓',
    isActive: true,
    lastActiveAt: '2025-01-05T07:30:00Z'
  }
];

// Mock 퀘스트 데이터
export const mockQuests: Quest[] = [
  {
    id: '1',
    title: '오늘의 학습 회고 작성',
    description: '수업에서 배운 내용과 새롭게 깨달은 점을 정리하여 회고를 작성해보세요. 어려웠던 부분과 해결 방법도 함께 기록하면 좋습니다.',
    type: 'personal',
    status: 'active',
    points: 40,
    deadline: '2025-01-06',
    createdBy: 'system',
    completedBy: ['1', '2', '4'],
    createdAt: '2025-01-04T00:00:00Z',
    updatedAt: '2025-01-05T12:00:00Z',
    isCompleted: true,
    estimatedTime: '15분',
    difficulty: 'easy',
    theme: '회고'
  },
  {
    id: '2',
    title: '코딩테스트 문제 해결하기',
    description: '백준, 프로그래머스, 또는 리트코드에서 자신의 수준에 맞는 알고리즘 문제 2개를 선택하여 해결해보세요.',
    type: 'personal',
    status: 'active',
    points: 80,
    deadline: '2025-01-06',
    createdBy: '1',
    completedBy: ['1', '3'],
    createdAt: '2025-01-04T09:00:00Z',
    updatedAt: '2025-01-05T10:30:00Z',
    isCompleted: false,
    estimatedTime: '45분',
    difficulty: 'medium',
    theme: '프로그래밍'
  },
  {
    id: '3',
    title: '그룹 스터디 자료 준비',
    description: '다음 주 그룹 스터디를 위한 발표 자료를 준비하고, 핵심 개념을 정리하여 공유해보세요.',
    type: 'group',
    status: 'active',
    points: 120,
    deadline: '2025-01-10',
    createdBy: '1',
    completedBy: ['1', '2'],
    maxParticipants: 6,
    createdAt: '2025-01-03T14:00:00Z',
    updatedAt: '2025-01-05T09:00:00Z',
    isCompleted: false,
    estimatedTime: '1시간 30분',
    difficulty: 'medium',
    theme: '학습'
  },
  {
    id: '4',
    title: '동료 코드 리뷰 및 피드백',
    description: '팀원이 작성한 코드를 꼼꼼히 살펴보고 개선점이나 좋은 점에 대한 건설적인 피드백을 남겨주세요.',
    type: 'personal',
    status: 'active',
    points: 60,
    createdBy: '1',
    completedBy: ['2'],
    createdAt: '2025-01-04T11:00:00Z',
    updatedAt: '2025-01-05T08:15:00Z',
    isCompleted: false,
    estimatedTime: '25분',
    difficulty: 'easy',
    theme: '코드리뷰'
  },
  {
    id: '5',
    title: '개인 프로젝트 진행상황 공유',
    description: '현재 진행 중인 개인 프로젝트의 진행상황과 겪고 있는 어려움을 그룹에 공유하고 조언을 구해보세요.',
    type: 'personal',
    status: 'completed',
    points: 70,
    createdBy: '1',
    completedBy: ['1', '3', '4'],
    createdAt: '2025-01-02T10:00:00Z',
    updatedAt: '2025-01-04T18:00:00Z',
    isCompleted: true,
    estimatedTime: '20분',
    difficulty: 'easy',
    theme: '프로젝트'
  },
  {
    id: '6',
    title: '기술 블로그 포스팅 작성',
    description: '최근에 학습한 기술이나 해결한 문제에 대해 블로그 포스팅을 작성하여 지식을 정리하고 공유해보세요.',
    type: 'personal',
    status: 'active',
    points: 100,
    createdBy: '2',
    completedBy: [],
    createdAt: '2025-01-05T09:00:00Z',
    updatedAt: '2025-01-05T09:00:00Z',
    isCompleted: false,
    estimatedTime: '2시간',
    difficulty: 'medium',
    theme: '블로그'
  },
  {
    id: '7',
    title: '팀 프로젝트 아이디어 브레인스토밍',
    description: '모든 팀원이 참여하여 새로운 프로젝트 아이디어를 제안하고 토론하는 시간을 가져보세요.',
    type: 'group',
    status: 'active',
    points: 150,
    deadline: '2025-01-08',
    createdBy: '1',
    completedBy: ['1'],
    maxParticipants: 6,
    createdAt: '2025-01-05T14:00:00Z',
    updatedAt: '2025-01-05T14:00:00Z',
    isCompleted: false,
    estimatedTime: '1시간',
    difficulty: 'medium',
    theme: '협업'
  },
  {
    id: '8',
    title: '온라인 강의 수강 및 정리',
    description: '관심 있는 분야의 온라인 강의를 수강하고 핵심 내용을 노트로 정리해보세요.',
    type: 'personal',
    status: 'active',
    points: 90,
    deadline: '2025-01-07',
    createdBy: '3',
    completedBy: ['3', '5'],
    createdAt: '2025-01-04T16:00:00Z',
    updatedAt: '2025-01-05T11:00:00Z',
    isCompleted: false,
    estimatedTime: '1시간 30분',
    difficulty: 'easy',
    theme: '학습'
  }
];

// Mock 그룹 데이터
export const mockGroups: Group[] = [
  {
    id: '1',
    name: '우리 반 활동',
    description: '같은 반 친구들과 함께하는 활동과 소통 공간입니다.',
    code: 'ABC123',
    leader: mockGroupMembers[1],
    members: [mockGroupMembers[0], ...mockGroupMembers.slice(1, 5)], // 그램드마스터 + 김준호, 문태완, 김민수, 이지은
    createdAt: '2024-12-01',
    updatedAt: '2025-01-05T12:00:00Z',
    settings: {
      maxPersonalQuests: 5,
      allowMemberQuests: true,
      autoQuestEnabled: true,
      questApprovalRequired: false,
      pointsPerQuest: 50,
      dailyQuestLimit: 3,
      showTargetProgress: true
    },
    quests: mockQuests.slice(0, 5),
    totalPoints: 3240,
    targetPoints: 5000,
    icon: '🏫',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    isActive: true,
    memberCount: 5,
    maxMembers: 20,
    duration: 'long'
  },
  {
    id: '2',
    name: '알고리즘 마스터',
    description: '코딩테스트 준비와 알고리즘 실력 향상을 위한 집중 스터디 그룹입니다.',
    code: 'DEF456',
    leader: mockGroupMembers[0], // 그램드마스터로 변경
    members: [mockGroupMembers[0], ...mockGroupMembers.slice(1, 4)], // 그램드마스터 + 김준호, 문태완, 김민수
    createdAt: '2024-12-05',
    updatedAt: '2025-01-05T11:30:00Z',
    settings: {
      maxPersonalQuests: 3,
      allowMemberQuests: false,
      autoQuestEnabled: true,
      questApprovalRequired: true,
      pointsPerQuest: 75,
      dailyQuestLimit: 2,
      showTargetProgress: true
    },
    quests: mockQuests.slice(1, 6),
    totalPoints: 2180,
    targetPoints: 3000,
    icon: '🧮',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    isActive: true,
    memberCount: 4,
    maxMembers: 15,
    duration: 'short',
    endDate: '2025-03-15'
  },
  {
    id: '3',
    name: '웹 개발 프로젝트',
    description: '실무 경험을 쌓기 위한 웹 애플리케이션 개발 프로젝트 팀입니다.',
    code: 'GHI789',
    leader: mockGroupMembers[0], // 그램드마스터로 변경
    members: [mockGroupMembers[0], ...mockGroupMembers.slice(2, 6)], // 그램드마스터 + 김민수, 이지은, 박서준, 최유진
    createdAt: '2024-12-10',
    updatedAt: '2025-01-05T10:45:00Z',
    settings: {
      maxPersonalQuests: 7,
      allowMemberQuests: true,
      autoQuestEnabled: false,
      questApprovalRequired: false,
      pointsPerQuest: 100,
      dailyQuestLimit: 5,
      showTargetProgress: true
    },
    quests: mockQuests.slice(2, 8),
    totalPoints: 2890,
    targetPoints: 4000,
    icon: '💻',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    isActive: true,
    memberCount: 5,
    maxMembers: 10,
    duration: 'long'
  },
  {
    id: '4',
    name: '데이터 사이언스 연구',
    description: '데이터 분석과 머신러닝을 활용한 프로젝트를 진행하는 연구 그룹입니다.',
    code: 'JKL012',
    leader: mockGroupMembers[0], // 그램드마스터로 변경
    members: [mockGroupMembers[0], ...mockGroupMembers.slice(3, 6)], // 그램드마스터 + 이지은, 박서준, 최유진
    createdAt: '2024-12-15',
    updatedAt: '2025-01-05T09:20:00Z',
    settings: {
      maxPersonalQuests: 10,
      allowMemberQuests: true,
      autoQuestEnabled: true,
      questApprovalRequired: false,
      pointsPerQuest: 60,
      dailyQuestLimit: 4,
      showTargetProgress: false
    },
    quests: mockQuests.slice(5, 8),
    totalPoints: 1820,
    targetPoints: 3500,
    icon: '📊',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    isActive: true,
    memberCount: 4,
    maxMembers: 12,
    duration: 'short',
    endDate: '2025-04-30'
  },
  {
    id: '5',
    name: '모바일 앱 개발 완료',
    description: 'React Native를 활용한 모바일 애플리케이션 개발 프로젝트가 성공적으로 완료되었습니다.',
    code: 'MNO345',
    leader: mockGroupMembers[0],
    members: mockGroupMembers.slice(0, 3), // 그램드마스터, 김준호, 문태완
    createdAt: '2024-11-01',
    updatedAt: '2025-01-03T18:00:00Z',
    settings: {
      maxPersonalQuests: 8,
      allowMemberQuests: true,
      autoQuestEnabled: false,
      questApprovalRequired: false,
      pointsPerQuest: 80,
      dailyQuestLimit: 4,
      showTargetProgress: true
    },
    quests: [
      {
        id: 'completed_1',
        title: 'UI/UX 디자인 완성',
        description: '사용자 친화적인 인터페이스 디자인 및 프로토타입 제작',
        type: 'group',
        status: 'completed',
        points: 150,
        createdBy: '1',
        completedBy: ['1', '2', '3'],
        createdAt: '2024-11-05T00:00:00Z',
        updatedAt: '2024-11-20T00:00:00Z',
        isCompleted: true,
        estimatedTime: '3시간',
        difficulty: 'medium',
        theme: '디자인'
      },
      {
        id: 'completed_2',
        title: '백엔드 API 개발',
        description: 'RESTful API 설계 및 구현, 데이터베이스 연동',
        type: 'group',
        status: 'completed',
        points: 200,
        createdBy: '1',
        completedBy: ['1', '2', '3'],
        createdAt: '2024-11-10T00:00:00Z',
        updatedAt: '2024-12-05T00:00:00Z',
        isCompleted: true,
        estimatedTime: '4시간',
        difficulty: 'hard',
        theme: '백엔드'
      },
      {
        id: 'completed_3',
        title: '프론트엔드 구현',
        description: 'React Native 컴포넌트 개발 및 상태 관리',
        type: 'group',
        status: 'completed',
        points: 180,
        createdBy: '1',
        completedBy: ['1', '2', '3'],
        createdAt: '2024-11-15T00:00:00Z',
        updatedAt: '2024-12-10T00:00:00Z',
        isCompleted: true,
        estimatedTime: '3시간',
        difficulty: 'medium',
        theme: '프론트엔드'
      },
      {
        id: 'completed_4',
        title: '테스트 및 배포',
        description: '앱 테스트, 버그 수정 및 스토어 배포',
        type: 'group',
        status: 'completed',
        points: 120,
        createdBy: '1',
        completedBy: ['1', '2', '3'],
        createdAt: '2024-12-01T00:00:00Z',
        updatedAt: '2024-12-20T00:00:00Z',
        isCompleted: true,
        estimatedTime: '2시간',
        difficulty: 'medium',
        theme: '배포'
      }
    ],
    totalPoints: 2000,
    targetPoints: 2000,
    icon: '📱',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    isActive: false,
    memberCount: 3,
    maxMembers: 10,
    duration: 'short',
    endDate: '2025-09-30',
    isCompleted: true,
    completedAt: '2025-09-05T18:00:00Z' // 2025-09-30 기한 내 완료 (성공)
  },
  {
    id: '6',
    name: '장기 학습 프로젝트 완료',
    description: '1년간 진행된 지속적인 학습과 성장 프로젝트가 성공적으로 완료되었습니다.',
    code: 'LONG01',
    leader: mockGroupMembers[1], // 김준호
    members: [mockGroupMembers[0], ...mockGroupMembers.slice(1, 4)], // 그램드마스터 + 김준호, 문태완, 김민수
    createdAt: '2024-01-01',
    updatedAt: '2025-01-05T20:00:00Z',
    settings: {
      maxPersonalQuests: 10,
      allowMemberQuests: true,
      autoQuestEnabled: true,
      questApprovalRequired: false,
      pointsPerQuest: 80,
      dailyQuestLimit: 5,
      showTargetProgress: true
    },
    quests: [
      {
        id: 'long_completed_1',
        title: '연간 학습 목표 달성',
        description: '1년간 설정한 학습 목표를 모두 달성하고 성과를 정리',
        type: 'group',
        status: 'completed',
        points: 300,
        createdBy: '1',
        completedBy: ['gramdemaster', '1', '2', '3'],
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2025-01-05T18:00:00Z',
        isCompleted: true,
        estimatedTime: '5시간',
        difficulty: 'hard',
        theme: '학습'
      },
      {
        id: 'long_completed_2',
        title: '포트폴리오 완성',
        description: '개인별 포트폴리오를 완성하고 발표 준비',
        type: 'personal',
        status: 'completed',
        points: 200,
        createdBy: '1',
        completedBy: ['gramdemaster', '1', '2', '3'],
        createdAt: '2024-06-01T00:00:00Z',
        updatedAt: '2025-01-05T17:00:00Z',
        isCompleted: true,
        estimatedTime: '4시간',
        difficulty: 'medium',
        theme: '포트폴리오'
      }
    ],
    totalPoints: 4000,
    targetPoints: 4000,
    icon: '🎓',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    isActive: false,
    memberCount: 4,
    maxMembers: 15,
    duration: 'long',
    isCompleted: true,
    completedAt: '2025-01-05T18:00:00Z'
  },
  {
    id: '7',
    name: '숨겨진 스터디 그룹',
    description: '특별한 초대를 받은 멤버들만 참여할 수 있는 비밀 스터디 그룹입니다. 고급 학습 자료와 심화 과제를 다룹니다.',
    code: 'MID005',
    leader: mockGroupMembers[1], // 김준호
    members: [mockGroupMembers[1], mockGroupMembers[2], mockGroupMembers[3]], // 김준호, 문태완, 김민수
    createdAt: '2024-11-20',
    updatedAt: '2025-01-05T15:30:00Z',
    settings: {
      maxPersonalQuests: 10,
      allowMemberQuests: false,
      autoQuestEnabled: false,
      questApprovalRequired: true,
      pointsPerQuest: 100,
      dailyQuestLimit: 2,
      showTargetProgress: false
    },
    quests: [
      {
        id: 'hidden_1',
        title: '고급 알고리즘 연구',
        description: '복잡한 알고리즘 문제를 분석하고 최적화 방안을 연구합니다.',
        type: 'personal',
        status: 'active',
        points: 150,
        createdBy: '1',
        completedBy: ['1', '2'],
        createdAt: '2024-11-25T00:00:00Z',
        updatedAt: '2025-01-05T10:00:00Z',
        isCompleted: false,
        estimatedTime: '3시간',
        difficulty: 'hard',
        theme: '알고리즘'
      },
      {
        id: 'hidden_2',
        title: '시스템 설계 스터디',
        description: '대규모 시스템 아키텍처 설계 원리를 학습합니다.',
        type: 'group',
        status: 'active',
        points: 200,
        createdBy: '1',
        completedBy: ['1'],
        maxParticipants: 3,
        createdAt: '2024-12-01T00:00:00Z',
        updatedAt: '2025-01-05T14:00:00Z',
        isCompleted: false,
        estimatedTime: '4시간',
        difficulty: 'hard',
        theme: '시스템설계'
      }
    ],
    totalPoints: 1950,
    targetPoints: 3000,
    icon: '📱',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    isActive: true,
    memberCount: 3,
    maxMembers: 5,
    duration: 'long',
    isHidden: true // 일반 목록에서 숨김
  }
];

// 로컬 스토리지에서 그룹 데이터 로드
const loadGroupsFromStorage = (): Group[] => {
  try {
    const stored = localStorage.getItem('mockGroups');
    if (stored) {
      const parsedGroups = JSON.parse(stored);
      console.log('로컬 스토리지에서 그룹 데이터 로드:', parsedGroups.length, '개');
      return parsedGroups;
    }
  } catch (error) {
    console.error('로컬 스토리지에서 그룹 데이터 로드 실패:', error);
  }

  // 로컬 스토리지에 데이터가 없으면 기본 데이터 사용
  console.log('기본 그룹 데이터 사용:', mockGroups.length, '개');
  return [...mockGroups];
};

// 회고 데이터 로드
const loadRetrospectivesFromStorage = (): Retrospective[] => {
  try {
    const stored = localStorage.getItem('retrospectives');
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('로컬 스토리지에서 회고 데이터 로드:', parsed.length, '개');
      return parsed;
    }
  } catch (error) {
    console.error('회고 데이터 로드 실패:', error);
  }

  // 기본 회고 데이터 생성
  const defaultRetrospectives: Retrospective[] = [
    {
      id: 'monthly_retro_1',
      groupId: '1',
      authorId: '1',
      authorName: '김준호',
      authorAvatar: '👨💻',
      title: '12월 학습 회고',
      content: '이번 달은 알고리즘 공부에 집중했습니다. 특히 동적 계획법 문제들을 많이 풀어보면서 점진적으로 실력이 향상되는 것을 느꼈습니다.',
      type: 'monthly',
      createdAt: '2024-12-31T23:59:59Z',
      updatedAt: '2024-12-31T23:59:59Z',
      comments: []
    },
    {
      id: 'project_retro_1',
      groupId: '1',
      authorId: '2',
      authorName: '문태완',
      authorAvatar: '👨🎓',
      title: '웹 프로젝트 회고',
      content: 'React와 TypeScript를 활용한 프로젝트를 완성했습니다. 처음에는 타입 정의가 어려웠지만, 점차 익숙해지면서 코드의 안정성이 크게 향상되었습니다.',
      type: 'project',
      createdAt: '2024-12-28T18:00:00Z',
      updatedAt: '2024-12-28T18:00:00Z',
      comments: []
    }
  ];
  console.log('기본 회고 데이터 사용:', defaultRetrospectives.length, '개');
  return defaultRetrospectives;
};

// 회고 데이터 저장
const saveRetrospectivesToStorage = (retrospectives: Retrospective[]) => {
  try {
    console.log('회고 데이터 저장 중:', retrospectives.length, '개');
    localStorage.setItem('retrospectives', JSON.stringify(retrospectives));
    console.log('회고 데이터 저장 완료');
  } catch (error) {
    console.error('회고 데이터 저장 실패:', error);
  }
};

// 초기 로드 시 로컬 스토리지에서 데이터 가져오기
let currentMockGroups = loadGroupsFromStorage();
let currentRetrospectives = loadRetrospectivesFromStorage();

// Mock API 함수들
export const groupMockAPI = {
  getGroups: (): Promise<Group[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 그램드마스터가 멤버인 그룹만 반환하되, MID005는 참여하지 않은 경우 숨김
        const userGroups = currentMockGroups.filter(group => {
          const isMember = group.members.some(member => member.id === 'gramdemaster');
          // MID005 그룹은 그램드마스터가 멤버가 아닌 경우 숨김
          if (group.code === 'MID005' && !isMember) {
            return false;
          }
          return isMember;
        });

        console.log('=== getGroups 반환 ===');
        console.log('전체 그룹 수:', currentMockGroups.length);
        console.log('그램드마스터 참여 그룹 수:', userGroups.length);
        console.log('참여 그룹 목록:', userGroups.map(g => ({ name: g.name, code: g.code })));
        resolve(userGroups);
      }, 500);
    });
  },

  getGroup: (id: string): Promise<Group | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const groupIndex = currentMockGroups.findIndex(g => g.id === id);
        if (groupIndex !== -1) {
          console.log('=== getGroup 반환 데이터 ===');
          console.log('그룹 총 포인트:', currentMockGroups[groupIndex].totalPoints);
          console.log('그램드마스터 포인트:', currentMockGroups[groupIndex].members.find(m => m.id === 'gramdemaster')?.points);
          resolve(currentMockGroups[groupIndex]);
        } else {
          resolve(null);
        }
      }, 300);
    });
  },

  joinGroup: (code: string): Promise<GroupJoinResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const group = currentMockGroups.find(g => g.code === code);
        if (group) {
          // 그램드마스터를 멤버로 추가 (이미 멤버가 아닌 경우에만)
          const isAlreadyMember = group.members.some(m => m.id === 'gramdemaster');
          if (!isAlreadyMember) {
            const gramdemasterMember = mockGroupMembers.find(m => m.id === 'gramdemaster');
            if (gramdemasterMember) {
              console.log('=== 그램드마스터 멤버 추가 ===');
              console.log('그룹:', group.name);
              console.log('추가 전 멤버 수:', group.members.length);

              group.members.push({
                ...gramdemasterMember,
                joinedAt: new Date().toISOString(),
                points: 0,
                completedQuests: 0
              });
              group.memberCount = group.members.length;
              group.updatedAt = new Date().toISOString();

              console.log('추가 후 멤버 수:', group.members.length);
              console.log('그램드마스터 추가 완료');

              // 로컬 스토리지 업데이트
              try {
                localStorage.setItem('mockGroups', JSON.stringify(currentMockGroups));
              } catch (error) {
                console.error('로컬 스토리지 저장 실패:', error);
              }
            }
          }

          resolve({
            success: true,
            group,
            message: `${group.name}에 성공적으로 참여했습니다!`,
            memberRole: 'member'
          });
        } else {
          resolve({
            success: false,
            message: '존재하지 않는 그룹 코드입니다. 다시 확인해주세요.'
          });
        }
      }, 1000);
    });
  },

  createGroup: (groupData: GroupCreateRequest): Promise<Group> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newGroup: Group = {
          id: Date.now().toString(),
          name: groupData.name,
          description: groupData.description,
          code: Math.random().toString(36).substring(2, 8).toUpperCase(),
          leader: mockGroupMembers[0], // 현재 사용자를 리더로 설정
          members: [mockGroupMembers[0]],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          settings: {
            maxPersonalQuests: 5,
            allowMemberQuests: true,
            autoQuestEnabled: true,
            questApprovalRequired: false,
            pointsPerQuest: 50,
            dailyQuestLimit: 3,
            showTargetProgress: groupData.settings.showTargetProgress
          },
          quests: [],
          totalPoints: 0,
          targetPoints: groupData.targetPoints,
          icon: groupData.icon || '🎯',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          isActive: true,
          memberCount: 1,
          maxMembers: groupData.maxMembers || 20,
          duration: groupData.duration,
          endDate: groupData.endDate
        };
        currentMockGroups.push(newGroup);

        // 로컬 스토리지 업데이트
        try {
          localStorage.setItem('mockGroups', JSON.stringify(currentMockGroups));
        } catch (error) {
          console.error('로컬 스토리지 저장 실패:', error);
        }

        resolve(newGroup);
      }, 800);
    });
  },

  createQuest: (groupId: string, quest: QuestCreateRequest): Promise<Quest> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const group = currentMockGroups.find(g => g.id === groupId);
        if (!group) {
          reject(new Error('그룹을 찾을 수 없습니다.'));
          return;
        }

        // 개인 퀘스트 일일 생성 제한 체크
        if (quest.type === 'personal') {
          const today = new Date().toISOString().split('T')[0];
          const todayPersonalQuests = group.quests.filter(q =>
              q.type === 'personal' &&
              q.createdAt.startsWith(today) &&
              q.createdBy === '1' // 현재 사용자 ID
          );

          if (todayPersonalQuests.length >= 3) {
            reject(new Error('개인 퀘스트는 하루에 최대 3개까지만 생성할 수 있습니다.'));
            return;
          }
        }

        const newQuest: Quest = {
          id: Date.now().toString(),
          title: quest.title,
          description: quest.description,
          type: quest.type,
          status: 'active',
          points: quest.points,
          deadline: quest.deadline,
          createdBy: '1', // 현재 사용자 ID
          completedBy: [],
          maxParticipants: quest.maxParticipants,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          estimatedTime: quest.estimatedTime
        };

        group.quests.push(newQuest);

        // 로컬 스토리지 업데이트
        try {
          localStorage.setItem('mockGroups', JSON.stringify(currentMockGroups));
        } catch (error) {
          console.error('로컬 스토리지 저장 실패:', error);
        }

        resolve(newQuest);
      }, 500);
    });
  },

  completeQuest: (data: QuestCompletionRequest): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        currentMockGroups.forEach(group => {
          const quest = group.quests.find(q => q.id === data.questId);
          if (quest && !quest.completedBy?.includes(data.userId)) {
            if (!quest.completedBy) quest.completedBy = [];
            quest.completedBy.push(data.userId);
            quest.updatedAt = new Date().toISOString();

            // 포인트 업데이트
            const member = group.members.find(m => m.id === data.userId);
            if (member) {
              member.points += quest.points;
              member.completedQuests += 1;
            }
          }
        });

        // 로컬 스토리지 업데이트
        try {
          localStorage.setItem('mockGroups', JSON.stringify(currentMockGroups));
        } catch (error) {
          console.error('로컬 스토리지 저장 실패:', error);
        }

        resolve();
      }, 300);
    });
  },

  generateAIQuests: (groupId: string, request: AIQuestGenerateRequest): Promise<Quest[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const questTemplates = {
          personal: {
            '프로그래밍': [
              { title: '일일 알고리즘 문제 풀기', description: '백준 또는 프로그래머스에서 알고리즘 문제 1개 해결하기', points: 50, time: '30분', difficulty: 'easy' },
              { title: '코드 리뷰 참여하기', description: '팀원의 코드를 리뷰하고 피드백 남기기', points: 75, time: '45분', difficulty: 'medium' },
              { title: '새로운 기술 학습하기', description: '관심 있는 새로운 프로그래밍 기술이나 라이브러리 학습', points: 100, time: '2시간', difficulty: 'hard' },
              { title: '버그 수정하기', description: '프로젝트에서 발견된 버그를 찾아서 수정하기', points: 80, time: '1시간', difficulty: 'medium' },
              { title: '단위 테스트 작성하기', description: '작성한 코드에 대한 단위 테스트 코드 작성', points: 60, time: '40분', difficulty: 'medium' }
            ],
            '학습': [
              { title: '일일 회고 작성하기', description: '오늘 배운 내용과 느낀 점을 정리하여 회고 작성', points: 30, time: '15분', difficulty: 'easy' },
              { title: '학습 노트 정리하기', description: '수업 내용을 체계적으로 정리하여 노트 작성', points: 40, time: '30분', difficulty: 'easy' },
              { title: '온라인 강의 수강하기', description: '관심 분야의 온라인 강의 1개 챕터 완주', points: 70, time: '1시간', difficulty: 'medium' },
              { title: '독서 및 요약하기', description: '전공 관련 도서 1챕터 읽고 핵심 내용 요약', points: 90, time: '1.5시간', difficulty: 'medium' }
            ],
            '건강': [
              { title: '운동하기', description: '30분 이상 운동하기 (산책, 헬스, 홈트 등)', points: 50, time: '30분', difficulty: 'easy' },
              { title: '물 마시기', description: '하루 8잔 이상의 물 마시기', points: 20, time: '하루종일', difficulty: 'easy' },
              { title: '일찍 자기', description: '12시 이전에 잠자리에 들기', points: 40, time: '저녁', difficulty: 'medium' }
            ]
          },
          group: {
            '협업': [
              { title: '팀 프로젝트 기획하기', description: '그룹 전체가 협력하여 새로운 프로젝트 아이디어 구상', points: 200, time: '2시간', difficulty: 'hard' },
              { title: '스터디 자료 공유하기', description: '유용한 학습 자료나 정보를 그룹에 공유', points: 100, time: '30분', difficulty: 'easy' },
              { title: '그룹 회의 참여하기', description: '정기 그룹 회의에 참여하여 의견 나누기', points: 80, time: '1시간', difficulty: 'medium' },
              { title: '멘토링 활동하기', description: '후배나 동료에게 지식 공유 및 멘토링', points: 120, time: '1시간', difficulty: 'medium' }
            ],
            '프로젝트': [
              { title: '공동 코딩 세션', description: '그룹원들과 함께 페어 프로그래밍 또는 코딩 세션 진행', points: 150, time: '2시간', difficulty: 'medium' },
              { title: '프로젝트 발표 준비', description: '팀 프로젝트 결과물을 발표용으로 정리', points: 180, time: '3시간', difficulty: 'hard' },
              { title: '코드 통합 작업', description: '각자 작업한 코드를 통합하고 충돌 해결', points: 160, time: '2시간', difficulty: 'hard' }
            ]
          }
        };

        const templates = questTemplates[request.type][request.theme] || questTemplates[request.type]['프로그래밍'] || [];
        const selectedCount = Math.min(request.count, templates.length);
        const selectedTemplates = templates.slice(0, selectedCount);

        const generatedQuests: Quest[] = selectedTemplates.map((template, index) => ({
          id: `temp_${Date.now()}_${index}`,
          title: template.title,
          description: template.description,
          type: request.type,
          status: 'active' as const,
          points: template.points,
          createdBy: '1',
          completedBy: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isCompleted: false,
          estimatedTime: template.time,
          difficulty: template.difficulty as 'easy' | 'medium' | 'hard',
          theme: request.theme
        }));

        resolve(generatedQuests);
      }, 800);
    });
  },

  updateQuest: (questId: string, updates: QuestUpdateRequest): Promise<Quest> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Find quest in groups
        let updatedQuest: Quest | null = null;
        currentMockGroups.forEach(group => {
          const questIndex = group.quests.findIndex(q => q.id === questId);
          if (questIndex !== -1) {
            group.quests[questIndex] = {
              ...group.quests[questIndex],
              ...updates,
              updatedAt: new Date().toISOString()
            };
            updatedQuest = group.quests[questIndex];
          }
        });

        // 로컬 스토리지 업데이트
        try {
          localStorage.setItem('mockGroups', JSON.stringify(currentMockGroups));
        } catch (error) {
          console.error('로컬 스토리지 저장 실패:', error);
        }

        if (updatedQuest) {
          resolve(updatedQuest);
        }
      }, 300);
    });
  },

  toggleQuestCompletion: (questId: string, userId: string): Promise<{ isCompleted: boolean; pointsEarned?: number }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('=== toggleQuestCompletion 시작 ===');
        console.log('questId:', questId, 'userId:', userId);

        let result = { isCompleted: false, pointsEarned: 0 };
        let questFound = false;

        for (const group of currentMockGroups) {
          const quest = group.quests.find(q => q.id === questId);
          if (quest) {
            if (questFound) {
              console.log('퀘스트 이미 처리됨, 건너뛰기');
              continue;
            }
            questFound = true;

            console.log('퀘스트 찾음:', quest.title, '포인트:', quest.points);
            const isCurrentlyCompleted = quest.completedBy?.includes(userId) || false;
            console.log('현재 완료 상태:', isCurrentlyCompleted);

            if (isCurrentlyCompleted) {
              // 완료 취소
              console.log('완료 취소 처리 중...');
              quest.completedBy = quest.completedBy?.filter(id => id !== userId) || [];

              // 퀘스트 완료 상태 업데이트 (단체 퀘스트는 모든 멤버 완료시에만 완료)
              quest.isCompleted = quest.type === 'group'
                  ? quest.completedBy.length === group.members.length
                  : false;

              result = { isCompleted: false };

              // 포인트 차감 (개인 퀘스트는 즉시, 단체 퀘스트는 이전에 모든 멤버가 완료했던 경우에만)
              const member = group.members.find(m => m.id === userId);
              if (member) {
                // 개인 퀘스트는 항상 포인트 차감
                // 단체 퀘스트는 이전에 모든 멤버가 완료했고 포인트를 받았던 경우에만 차감
                const shouldDeductPoints = quest.type === 'personal' ||
                    (quest.type === 'group' && quest.completedBy.length + 1 === group.members.length);

                if (shouldDeductPoints && member.points >= quest.points) {
                  console.log('포인트 차감:', quest.points, '차감 전:', member.points);
                  member.points -= quest.points;
                  member.completedQuests = Math.max(0, member.completedQuests - 1);
                  group.totalPoints = Math.max(0, group.totalPoints - quest.points);
                  console.log('차감 후 멤버 포인트:', member.points, '그룹 총 포인트:', group.totalPoints);

                  // currentMockGroups 배열에서 직접 업데이트
                  const groupIndex = currentMockGroups.findIndex(g => g.id === group.id);
                  if (groupIndex !== -1) {
                    const memberIndex = currentMockGroups[groupIndex].members.findIndex(m => m.id === userId);
                    if (memberIndex !== -1) {
                      currentMockGroups[groupIndex].members[memberIndex].points = member.points;
                      currentMockGroups[groupIndex].members[memberIndex].completedQuests = member.completedQuests;
                    }
                    currentMockGroups[groupIndex].totalPoints = group.totalPoints;
                    currentMockGroups[groupIndex].updatedAt = new Date().toISOString();
                    console.log('currentMockGroups 배열 업데이트 완료 - 총 포인트:', currentMockGroups[groupIndex].totalPoints);
                  }
                }
              }
            } else {
              // 완료 처리
              console.log('완료 처리 중...');
              if (!quest.completedBy) quest.completedBy = [];
              quest.completedBy.push(userId);

              // 퀘스트 완료 상태 업데이트
              const allMembersCompleted = quest.type === 'group' && quest.completedBy.length === group.members.length;
              quest.isCompleted = quest.type === 'personal' || allMembersCompleted;

              // 포인트 지급 로직
              const member = group.members.find(m => m.id === userId);
              if (member) {
                // 개인 퀘스트: 즉시 포인트 지급
                // 단체 퀘스트: 모든 멤버가 완료했을 때만 포인트 지급
                const shouldGivePoints = quest.type === 'personal' || allMembersCompleted;

                if (shouldGivePoints) {
                  console.log('개인 퀘스트 포인트 지급:', quest.points, '지급 전:', member.points);
                  member.points += quest.points;
                  member.completedQuests += 1;
                  group.totalPoints += quest.points;
                  console.log('지급 후 멤버 포인트:', member.points, '그룹 총 포인트:', group.totalPoints);

                  result = { isCompleted: true, pointsEarned: quest.points };
                } else {
                  // 단체 퀘스트에서 개별 완료했지만 아직 모든 멤버가 완료하지 않은 경우
                  console.log('단체 퀘스트 개별 완료 - 포인트 지급 안함');
                  result = { isCompleted: true, pointsEarned: 0 };
                }

                // currentMockGroups 배열에서 직접 업데이트 (포인트가 지급된 경우에만)
                if (shouldGivePoints) {
                  const groupIndex = currentMockGroups.findIndex(g => g.id === group.id);
                  if (groupIndex !== -1) {
                    const memberIndex = currentMockGroups[groupIndex].members.findIndex(m => m.id === userId);
                    if (memberIndex !== -1) {
                      currentMockGroups[groupIndex].members[memberIndex].points = member.points;
                      currentMockGroups[groupIndex].members[memberIndex].completedQuests = member.completedQuests;
                    }
                    currentMockGroups[groupIndex].totalPoints = group.totalPoints;
                    currentMockGroups[groupIndex].updatedAt = new Date().toISOString();
                    console.log('currentMockGroups 배열 업데이트 완료 - 총 포인트:', currentMockGroups[groupIndex].totalPoints);
                  }
                }
              } else {
                result = { isCompleted: true, pointsEarned: 0 };
              }
            }

            quest.updatedAt = new Date().toISOString();
            group.updatedAt = new Date().toISOString();
            break; // 퀘스트를 찾았으므로 루프 종료
          }
        }

        // 로컬 스토리지 업데이트
        try {
          localStorage.setItem('mockGroups', JSON.stringify(currentMockGroups));
        } catch (error) {
          console.error('로컬 스토리지 저장 실패:', error);
        }

        console.log('최종 결과:', result);
        console.log('=== toggleQuestCompletion 완료 ===');
        resolve(result);
      }, 300);
    });
  },

  getRanking: (groupId: string): Promise<GroupRanking[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const group = currentMockGroups.find(g => g.id === groupId);
        if (group) {
          const sortedMembers = [...group.members].sort((a, b) => b.points - a.points);
          const ranking: GroupRanking[] = sortedMembers.map((member, index) => ({
            member,
            rank: index + 1,
            pointsThisWeek: Math.floor(member.points * 0.3), // 이번 주 포인트 (임시)
            questsCompletedThisWeek: Math.floor(member.completedQuests * 0.2) // 이번 주 완료 퀘스트 (임시)
          }));
          resolve(ranking);
        } else {
          resolve([]);
        }
      }, 300);
    });
  },

  getGroupStats: (groupId: string): Promise<GroupStats> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const group = currentMockGroups.find(g => g.id === groupId);
        if (group) {
          const stats: GroupStats = {
            totalMembers: group.members.length,
            activeMembers: group.members.filter(m => m.isActive).length,
            totalQuests: group.quests.length,
            activeQuests: group.quests.filter(q => q.status === 'active').length,
            completedQuests: group.quests.filter(q => q.status === 'completed').length,
            totalPoints: group.totalPoints,
            averagePointsPerMember: Math.floor(group.totalPoints / group.members.length)
          };
          resolve(stats);
        } else {
          resolve({
            totalMembers: 0,
            activeMembers: 0,
            totalQuests: 0,
            activeQuests: 0,
            completedQuests: 0,
            totalPoints: 0,
            averagePointsPerMember: 0
          });
        }
      }, 200);
    });
  },

  getAIQuestSuggestions: (groupId: string, type: 'personal' | 'group'): Promise<AIQuestSuggestion[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const suggestions: AIQuestSuggestion[] = [
          {
            title: '일일 코딩 챌린지',
            description: '매일 알고리즘 문제 1개씩 해결하기',
            type: 'personal',
            suggestedPoints: 50,
            difficulty: 'easy',
            category: '프로그래밍',
            estimatedTime: '30분'
          },
          {
            title: '팀 프로젝트 기획',
            description: '그룹 전체가 협력하여 프로젝트 아이디어 구상하기',
            type: 'group',
            suggestedPoints: 200,
            difficulty: 'medium',
            category: '협업',
            estimatedTime: '2시간'
          },
          {
            title: '학습 노트 정리',
            description: '오늘 배운 내용을 정리하여 공유하기',
            type: 'personal',
            suggestedPoints: 30,
            difficulty: 'easy',
            category: '학습',
            estimatedTime: '20분'
          }
        ].filter(s => s.type === type);

        resolve(suggestions);
      }, 500);
    });
  },

  deleteQuest: (questId: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Find and remove quest from groups
        currentMockGroups.forEach(group => {
          const questIndex = group.quests.findIndex(q => q.id === questId);
          if (questIndex !== -1) {
            group.quests.splice(questIndex, 1);
            group.updatedAt = new Date().toISOString();
          }
        });

        // 로컬 스토리지 업데이트
        try {
          localStorage.setItem('mockGroups', JSON.stringify(currentMockGroups));
        } catch (error) {
          console.error('로컬 스토리지 저장 실패:', error);
        }

        resolve();
      }, 300);
    });
  },

  updateGroupSettings: (groupId: string, settings: Partial<GroupSettings>): Promise<Group> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const group = currentMockGroups.find(g => g.id === groupId);
        if (group) {
          group.settings = { ...group.settings, ...settings };
          group.updatedAt = new Date().toISOString();

          // 로컬 스토리지 업데이트
          try {
            localStorage.setItem('mockGroups', JSON.stringify(currentMockGroups));
          } catch (error) {
            console.error('로컬 스토리지 저장 실패:', error);
          }

          resolve(group);
        }
      }, 300);
    });
  },

  updateGroup: (groupId: string, updates: Partial<Group>): Promise<Group> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('=== mockAPI updateGroup 시작 ===');
        console.log('groupId:', groupId);
        console.log('updates:', updates);

        const groupIndex = currentMockGroups.findIndex(g => g.id === groupId);
        console.log('찾은 groupIndex:', groupIndex);

        if (groupIndex !== -1) {
          console.log('업데이트 전 그룹:', currentMockGroups[groupIndex]);
          currentMockGroups[groupIndex] = { ...currentMockGroups[groupIndex], ...updates, updatedAt: new Date().toISOString() };
          console.log('업데이트 후 그룹:', currentMockGroups[groupIndex]);

          // 로컬 스토리지 업데이트
          try {
            localStorage.setItem('mockGroups', JSON.stringify(currentMockGroups));
          } catch (error) {
            console.error('로컬 스토리지 저장 실패:', error);
          }

          resolve(currentMockGroups[groupIndex]);
        } else {
          console.error('그룹을 찾을 수 없음:', groupId);
        }
        console.log('=== mockAPI updateGroup 완료 ===');
      }, 300);
    });
  },

  removeMember: (groupId: string, memberId: string): Promise<Group> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const group = currentMockGroups.find(g => g.id === groupId);
        if (group) {
          group.members = group.members.filter(m => m.id !== memberId);
          group.memberCount = group.members.length;
          group.updatedAt = new Date().toISOString();

          // 로컬 스토리지 업데이트
          try {
            localStorage.setItem('mockGroups', JSON.stringify(currentMockGroups));
          } catch (error) {
            console.error('로컬 스토리지 저장 실패:', error);
          }

          resolve(group);
        }
      }, 300);
    });
  },

  // 회고 관련 API
  getRetrospectives: (groupId: string): Promise<Retrospective[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const groupRetrospectives = currentRetrospectives.filter(r => r.groupId === groupId);
        resolve(groupRetrospectives);
      }, 300);
    });
  },

  createRetrospective: (retrospective: Omit<Retrospective, 'id' | 'comments'>): Promise<Retrospective> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRetrospective: Retrospective = {
          ...retrospective,
          id: Date.now().toString(),
          comments: []
        };

        currentRetrospectives.push(newRetrospective);
        saveRetrospectivesToStorage(currentRetrospectives);
        resolve(newRetrospective);
      }, 300);
    });
  },

  addComment: (retrospectiveId: string, comment: Omit<RetrospectiveComment, 'id' | 'createdAt' | 'updatedAt'>): Promise<RetrospectiveComment> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('=== addComment 시작 ===');
        console.log('retrospectiveId:', retrospectiveId);
        console.log('comment:', comment);
        console.log('현재 회고 수:', currentRetrospectives.length);

        const newComment: RetrospectiveComment = {
          ...comment,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        console.log('생성된 newComment:', newComment);

        const retrospectiveIndex = currentRetrospectives.findIndex(r => r.id === retrospectiveId);
        console.log('찾은 회고 인덱스:', retrospectiveIndex);

        if (retrospectiveIndex !== -1) {
          if (!currentRetrospectives[retrospectiveIndex].comments) {
            currentRetrospectives[retrospectiveIndex].comments = [];
          }
          currentRetrospectives[retrospectiveIndex].comments.push(newComment);
          console.log('댓글 추가 후 댓글 수:', currentRetrospectives[retrospectiveIndex].comments.length);
          console.log('업데이트된 회고:', currentRetrospectives[retrospectiveIndex]);
          saveRetrospectivesToStorage(currentRetrospectives);
          resolve(newComment);
        } else {
          console.error('회고를 찾을 수 없음:', retrospectiveId);
          // 회고를 찾을 수 없어도 새 댓글 반환
          resolve(newComment);
        }

        console.log('=== addComment 완료 ===');
      }, 100); // 응답 시간 단축
    });
  },

  updateComment: (commentId: string, content: string): Promise<RetrospectiveComment> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let updatedComment: RetrospectiveComment | null = null;

        for (const retrospective of currentRetrospectives) {
          const commentIndex = retrospective.comments.findIndex(c => c.id === commentId);
          if (commentIndex !== -1) {
            retrospective.comments[commentIndex].content = content;
            retrospective.comments[commentIndex].updatedAt = new Date().toISOString();
            updatedComment = retrospective.comments[commentIndex];
            break;
          }
        }

        if (updatedComment) {
          saveRetrospectivesToStorage(currentRetrospectives);
          resolve(updatedComment);
        }
      }, 300);
    });
  },

  deleteComment: (commentId: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        for (const retrospective of currentRetrospectives) {
          const commentIndex = retrospective.comments.findIndex(c => c.id === commentId);
          if (commentIndex !== -1) {
            retrospective.comments.splice(commentIndex, 1);
            saveRetrospectivesToStorage(currentRetrospectives);
            break;
          }
        }
        resolve();
      }, 300);
    });
  },

  leaveGroup: (groupId: string, userId: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('=== leaveGroup 시작 ===');
        console.log('탈퇴할 groupId:', groupId, 'userId:', userId);

        const groupIndex = currentMockGroups.findIndex(g => g.id === groupId);
        console.log('찾은 groupIndex:', groupIndex);

        if (groupIndex !== -1) {
          const group = currentMockGroups[groupIndex];
          console.log('탈퇴 전 멤버 수:', group.members.length);

          // 해당 사용자를 멤버 목록에서 제거
          group.members = group.members.filter(m => m.id !== userId);
          group.memberCount = group.members.length;
          group.updatedAt = new Date().toISOString();

          console.log('탈퇴 후 멤버 수:', group.members.length);

          // 로컬 스토리지에도 업데이트된 그룹 목록 저장
          try {
            localStorage.setItem('mockGroups', JSON.stringify(currentMockGroups));
            console.log('로컬 스토리지에 업데이트된 그룹 목록 저장 완료');
          } catch (error) {
            console.error('로컬 스토리지 저장 실패:', error);
          }
        }
        console.log('=== leaveGroup 완료 ===');
        resolve();
      }, 300);
    });
  },

  deleteGroup: (groupId: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('=== deleteGroup 시작 ===');
        console.log('삭제할 groupId:', groupId);
        console.log('삭제 전 그룹 수:', currentMockGroups.length);

        const groupIndex = currentMockGroups.findIndex(g => g.id === groupId);
        console.log('찾은 groupIndex:', groupIndex);

        if (groupIndex !== -1) {
          const deletedGroup = currentMockGroups[groupIndex];
          console.log('삭제할 그룹:', deletedGroup.name);
          currentMockGroups.splice(groupIndex, 1);
          console.log('삭제 후 그룹 수:', currentMockGroups.length);

          // 로컬 스토리지에도 업데이트된 그룹 목록 저장
          try {
            localStorage.setItem('mockGroups', JSON.stringify(currentMockGroups));
            console.log('로컬 스토리지에 업데이트된 그룹 목록 저장 완료');
          } catch (error) {
            console.error('로컬 스토리지 저장 실패:', error);
          }
        }
        console.log('=== deleteGroup 완료 ===');
        resolve();
      }, 300);
    });
  }
};