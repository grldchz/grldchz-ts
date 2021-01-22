import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Editor } from "@tinymce/tinymce-react";
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
  const handleChange = (content: any, editor: any) => {
    setPostComment((prevComment: any) => ({
      ...prevComment,
      comment: content
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
  const nowHour = new Date().getHours();
  const DARK = nowHour > 17 || nowHour < 6;

  return (<div>
    {rootEl && (
    <Dialog visible={visible} appendTo={rootEl} style={{width: '100vw'}}
      onHide={onHide} blockScroll footer={<Button icon="pi pi-check" onClick={() => send()} label="Send"/>} >
      <div className="p-grid p-fluid">
        <div className="p-col-12">
          {children}
        </div>
      </div>
      <div className="p-grid p-fluid">
        <div className="p-col-12">
        </div>
        <Editor init={{menubar:false, width:'100%', skin: DARK?"oxide-dark":"", content_css: DARK?"dark":""}}
          apiKey={process.env.REACT_APP_TINYMCE_API_KEY} 
          toolbar="emoticons link image | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat"
          plugins={['emoticons advlist autolink lists link']}
          value={postComment.comment} onEditorChange={handleChange}
        />
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
