import React from 'react';
import { Comment } from '../types/Comment'
import CommentDisplay from './CommentDisplay'
import { Profile } from '../types/Profile';
import ReplyList from './ReplyList';
export interface Props{
    comment: Comment;
    profile: Profile;
    loadComments(): void;
    openMediaScroller(comment: Comment): void;
  }
const ListItem: React.FC<Props> = ({ comment, profile, loadComments, openMediaScroller }) => {
  return (
    <div className="commentDisplay">
      <CommentDisplay comment={comment} profile={profile} loadComments={loadComments} openMediaScroller={openMediaScroller}/>
      {(comment.replies.length>0 &&
      <ReplyList comment={comment} profile={profile} loadComments={loadComments} openMediaScroller={openMediaScroller}/>
      )}
    </div>
  );

};
export default ListItem;