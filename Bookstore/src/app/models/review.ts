import { AppComment } from './comment';

export interface Review {
  id: string;
  title: string;
  text: string;
  rating: number;
  comments?: AppComment[];
  commentsLoaded?: boolean;
  commentsLoading?: boolean;
  commentsExpanded?: boolean;
}
