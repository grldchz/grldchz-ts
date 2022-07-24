/**
	This is a part of the grilledcheeseoftheday.com

	Copyright (C) 2022 grilledcheeseoftheday.com

    grilledcheeseoftheday.com is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    grilledcheeseoftheday.com is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see http://www.gnu.org/licenses/.
**/
import { Comment, CommentQuery } from "./Comment";
import { Friend, FriendQuery } from "./Friend";

export interface AppState {
    commentQuery: CommentQuery;
    comments: Comment[];
    commentsTotal: number;
    loading: boolean;
	scrollPosition: number;
}
export interface FriendAppState {
    friendQuery: FriendQuery;
    friends: Friend[];
    friendsTotal: number;
    loading: boolean;
}
      