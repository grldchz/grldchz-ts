/**
This is a part of the GRLDCHZ Social network

Copyright (C) 2008 grilledcheeseoftheday.com
**/
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
      