import { Comment, CommentQuery } from "./Comment";

export interface AppState {
    commentQuery: CommentQuery;
    comments: Comment[];
    commentsTotal: number;
    loading: boolean;
    }
  