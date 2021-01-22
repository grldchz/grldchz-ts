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
      const replycss = reply.shared==1?"shareDisplay p-datascroller-content":"replyDisplay p-datascroller-content";
      return (
        <li className={replycss} key={reply.id}>
        <CommentDisplay comment={reply} profile={profile} loadComments={loadComments}/>
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