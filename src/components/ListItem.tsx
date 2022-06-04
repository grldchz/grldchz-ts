/**
This is a part of the GRLDCHZ Social network

Copyright (C) 2008 grilledcheeseoftheday.com
**/
import React from 'react';
import { Comment } from '../types/Comment'
import CommentDisplay from './CommentDisplay'
import { Profile } from '../types/Profile';
import ReplyList from './ReplyList';
import AppUtils from '../AppUtils';
import { AppState } from '../types/AppState';
export interface Props{
	appState: AppState;
    comment: Comment;
    profile: Profile;
    loadComments(): void;
  }
const ListItem: React.FC<Props> = ({ appState, comment, profile, loadComments }) => {
  const { getParameterByName } = AppUtils();
  let cssClasses = "commentDisplay";
  if(getParameterByName("contentid") || appState.commentQuery.content_id){
    cssClasses += " extraWide";
  }
  return (
    <div className={cssClasses} id={comment.id+""}>
      <CommentDisplay appState={appState} comment={comment} profile={profile} loadComments={loadComments}/>
      {(comment.replies.length>0 &&
      <ReplyList appState={appState} comment={comment} profile={profile} loadComments={loadComments}/>
      )}
    </div>
  );

};
export default ListItem;