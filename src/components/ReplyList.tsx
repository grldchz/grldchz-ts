/**
This is a part of the GRLDCHZ Social network

Copyright (C) 2008 grilledcheeseoftheday.com
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