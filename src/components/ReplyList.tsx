/**
	This is a part of the grilledcheeseoftheday.com

	Copyright (C) 2022 grilledcheeseoftheday.com

    GRLDCHZ is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    GRLDCHZ is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see http://www.gnu.org/licenses/.
**/
import React from 'react';
import { Comment } from '../types/Comment';
import { Profile } from '../types/Profile';
import CommentDisplay from './CommentDisplay';
import { AppState } from '../types/AppState';
export interface Props{
	appState: AppState;
  comment: Comment;
  profile: Profile;
  loadComments(): void;
}
const ReplyList: React.FC<Props> = ({ appState, comment, profile, loadComments }) => {
    const renderReply = (reply: Comment) => {
      const replycss = reply.shared==1?"shareDisplay p-datascroller-content":"replyDisplay p-datascroller-content";
      return (
        <li className={replycss} key={reply.id}>
        <CommentDisplay appState={appState} comment={reply} profile={profile} loadComments={loadComments}/>
        {(reply.replies.length>0 &&
        <ul className="replyList">{reply.replies.map(rep => renderReply(rep))}</ul> 
        )}         
        </li>
      );
    };
    return (
    <ul className="replyList">{comment.replies.map(reply => renderReply(reply))}</ul>
    );

};
export default ReplyList;