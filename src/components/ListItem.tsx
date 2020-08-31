import React from 'react';
import { Comment } from '../types/Comment'
import CommentDisplay from './CommentDisplay'
import { Profile } from '../types/Profile';
import ReplyList from './ReplyList';
export interface Props{
    comment: Comment;
    profile: Profile;
    loadComments(): void;
  }
const ListItem: React.FC<Props> = ({ comment, profile, loadComments }) => {
  return (
    <div>
      <CommentDisplay comment={comment} profile={profile} loadComments={loadComments}/>
      <ReplyList comment={comment} profile={profile} loadComments={loadComments}/>
    </div>
  );

};
export default ListItem;