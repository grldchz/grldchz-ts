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
  if(getParameterByName("contentid")){
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