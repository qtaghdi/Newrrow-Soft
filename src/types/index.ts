// Re-export group types
export * from './group';

export interface RetrospectiveCard {
  id: string;
  author: import('./group').User;
  content: string;
  temperature: number;
  comments: number;
  likes: number;
  isLiked: boolean;
  date: string;
  isRead: boolean;
}