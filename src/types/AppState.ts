import { Comment, CommentQuery } from "./Comment";
import { Friend, FriendQuery } from "./Friend";

export interface AppState {
    commentQuery: CommentQuery;
    comments: Comment[];
    commentsTotal: number;
    loading: boolean;
}
export interface FriendAppState {
    friendQuery: FriendQuery;
    friends: Friend[];
    friendsTotal: number;
    loading: boolean;
}
      