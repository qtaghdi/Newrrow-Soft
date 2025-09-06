export interface SubmenuItem {
  label: string;
  path: string;
}

export interface SidebarItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  hasSubmenu?: boolean;
  submenu?: SubmenuItem[];
}

export interface User {
  name: string;
  email: string;
  class: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'personal' | 'group';
  status: 'active' | 'completed' | 'expired';
  points: number;
  deadline?: string;
  createdBy: string;
  completedBy?: string[];
  maxParticipants?: number;
  createdAt: string;
  updatedAt: string;
  isCompleted?: boolean;
  estimatedTime?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  theme?: string;
}

export interface GroupMember extends User {
  id: string;
  role: 'leader' | 'member';
  joinedAt: string;
  points: number;
  completedQuests: number;
  avatar?: string;
  isActive: boolean;
  lastActiveAt: string;
}

export interface GroupSettings {
  maxPersonalQuests: number; // 1-10
  allowMemberQuests: boolean;
  autoQuestEnabled: boolean;
  questApprovalRequired: boolean;
  pointsPerQuest: number;
  dailyQuestLimit: number;
  showTargetProgress: boolean;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  code: string;
  leader: GroupMember;
  members: GroupMember[];
  createdAt: string;
  updatedAt: string;
  settings: GroupSettings;
  quests: Quest[];
  totalPoints: number;
  targetPoints: number;
  icon: string;
  color: string;
  bgColor: string;
  isActive: boolean;
  memberCount: number;
  maxMembers?: number;
  duration: 'short' | 'long';
  endDate?: string;
  isCompleted?: boolean;
  completedAt?: string;
  isHidden?: boolean;
}

export interface QuestCreateRequest {
  title: string;
  description: string;
  type: 'personal' | 'group';
  points: number;
  deadline?: string;
  maxParticipants?: number;
  estimatedTime?: string;
}

export interface GroupCreateRequest {
  name: string;
  description: string;
  duration: 'short' | 'long';
  endDate?: string;
  targetPoints: number;
  icon?: string;
  maxMembers?: number;
  settings: {
    aiRecommendationEnabled: boolean;
    memberQuestCreationEnabled: boolean;
    showTargetProgress: boolean;
  };
}

export interface GroupJoinResponse {
  success: boolean;
  group?: Group;
  message: string;
  memberRole?: 'leader' | 'member';
}

export interface QuestCompletionRequest {
  questId: string;
  userId: string;
  completionNote?: string;
}

export interface AIQuestGenerateRequest {
  type: 'personal' | 'group';
  theme: string;
  count: number; // 0-10
}

export interface QuestUpdateRequest {
  title?: string;
  description?: string;
  points?: number;
  deadline?: string;
}

export interface GroupRanking {
  member: GroupMember;
  rank: number;
  pointsThisWeek: number;
  questsCompletedThisWeek: number;
}

export interface GroupStats {
  totalMembers: number;
  activeMembers: number;
  totalQuests: number;
  activeQuests: number;
  completedQuests: number;
  totalPoints: number;
  averagePointsPerMember: number;
}

export interface AIQuestSuggestion {
  title: string;
  description: string;
  type: 'personal' | 'group';
  suggestedPoints: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  estimatedTime: string;
}

export interface RetrospectiveComment {
  id: string;
  retrospectiveId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Retrospective {
  id: string;
  groupId: string;
  authorId: string;
  author: string;
  role: string;
  date: string;
  month?: string;
  bgColor: string;
  borderColor: string;
  avatarColor: string;
  dateColor: string;
  content: string;
  goals?: string;
  achievements?: string;
  isUserWritten?: boolean;
  type: 'project' | 'monthly';
  comments: RetrospectiveComment[];
}