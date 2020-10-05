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
    <div style={{marginBottom:'20px'}} className="commentDisplay">
      <CommentDisplay comment={comment} profile={profile} loadComments={loadComments}/>
      {(comment.replies.length>0 &&
      <ReplyList comment={comment} profile={profile} loadComments={loadComments}/>
      )}
    </div>
  );

};
export default ListItem;