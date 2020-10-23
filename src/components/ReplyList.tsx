import React from 'react';
import { Comment } from '../types/Comment';
import { Profile } from '../types/Profile';
import CommentDisplay from './CommentDisplay';
export interface Props{
  comment: Comment;
  profile: Profile;
  loadComments(): void;
}
const ReplyList: React.FC<Props> = ({ comment, profile, loadComments }) => {
    const renderReply = (reply: Comment) => {
      return (
        <li key={reply.id}>
        <CommentDisplay comment={reply} profile={profile} loadComments={loadComments}/>
        {(reply.replies.length>0 &&
        <ul style={{listStyle:'none',marginBottom:'20px'}} className="p-datascroller-content">{reply.replies.map(rep => renderReply(rep))}</ul> 
        )}         
        </li>
      );
    };
    return (
    <ul className="replyDisplay p-datascroller-content">{comment.replies.map(reply => renderReply(reply))}</ul>
    );

};
export default ReplyList;