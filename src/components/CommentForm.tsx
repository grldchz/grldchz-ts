import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Profile } from '../types/Profile';
import { Comment, PostComment } from '../types/Comment';
import useCommentService from '../services/useCommentService';
import AppUtils from '../AppUtils';
export interface Props{
  visible: boolean;
  onHide(): void;
  parentId?: number;
  shareId?: number;
  editComment?: Comment;
  profile: Profile;
  onSubmit(): void;
}
const CommentDialog: React.FC<Props> = ({ visible, onHide, parentId, shareId, editComment, profile, onSubmit, children }) => {
  const rootEl = document.getElementById('root');
  const { getUnescapedText } = AppUtils();
  const initState: PostComment = {
    comment: ''
  };
  if(parentId){
    initState.parentId = parentId;
  }
  else if(shareId){
    initState.shareId = shareId;
  }
  else if(editComment){
    initState.editId = editComment.id;
    initState.parentId = editComment.parent_id;
    initState.comment = getUnescapedText(editComment.comment);
  }
  const [postComment, setPostComment] = React.useState<PostComment>(initState);
  const { service, submitComment } = useCommentService();
  const handleChange = (event: any) => {
    event.persist();
    setPostComment((prevComment: any) => ({
      ...prevComment,
      [event.target.name]: event.target.value
    }));
  };
  const getDateTime = () => {
    const currentTime: Date = new Date();
    const year = currentTime.getFullYear();
    const month = currentTime.getMonth()+1;
    const day = currentTime.getDate();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();
    let submitDate = year+"-";
    if (month < 10){
      submitDate += "0" + month;
    }
    else{
      submitDate += month;
    }
    submitDate += "-";
    if (day < 10){
      submitDate += "0" + day;
    }
    else{
      submitDate += day;
    }
    submitDate += " ";
    if (hours < 10){
      submitDate += "0" + hours;
    }
    else{
      submitDate += hours;
    }
    submitDate += ":";
    if (minutes < 10){
      submitDate += "0" + minutes;
    }
    else{
      submitDate += minutes;
    }
    submitDate += ":";
    if (seconds < 10){
      submitDate += "0" + seconds;
    }
    else{
      submitDate += seconds;
    }
    //var submitDate=year+"-"+month+"-"+day+" "+hours + ":" + minutes + ":"+seconds;
    return submitDate;
  };

  const send = () => {
    postComment.dateTime = getDateTime();
    submitComment(postComment).then(() => {
      onSubmit();
    });
  };
  return (<div>
    {rootEl && (
    <Dialog visible={visible} appendTo={rootEl} 
      onHide={onHide} blockScroll footer={<Button onClick={() => send()} label="Send"/>} >
      <div className="p-grid p-fluid">
        <div className="p-col-12">
          {children}
        </div>
      </div>
      <div className="p-grid p-fluid">
        <div className="p-col-12">
          <InputTextarea rows={5} cols={30} 
            name="comment"
            value={postComment.comment} onChange={handleChange}/>
        </div>
      </div>
  
      {service.status === 'loading' && (
        <ProgressSpinner />
      )}
      {service.status === 'loaded' && (
        <div>Response: {service.payload}</div>
      )}
      {service.status === 'error' && (
        <div>
          {service.error.message}
        </div>
      )}
    </Dialog>
    )}</div>
  );
};

export default CommentDialog;
