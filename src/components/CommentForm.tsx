import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import {InputSwitch} from 'primereact/inputswitch';
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
    comment: '',
    openPublic: false
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
    initState.openPublic = editComment.open_public==1?true:false;
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
    submitComment(postComment).then((response: any) => {
      if(!response.status){
        onSubmit();
      }
    });
  };
  const nowHour = new Date().getHours();
  const DARK = nowHour > 17 || nowHour < 6;
  const handlePublicChange = (e: any) => {
    setPostComment((prevComment: any) => ({
      ...prevComment,
      openPublic: e.value
    }));
  }
  const footer = (
    <>
    {profile.name != "guest" && (
    <div>
        {process.env.REACT_APP_PUBLIC_ENABLED == "true" && (
        <>
        <div style={{float:'left',display:'flex',alignItems:'center'}}>
          <InputSwitch checked={postComment.openPublic} onChange={handlePublicChange} /> 
          </div>
          <div style={{float:'left',display:'flex',alignItems:'center',paddingLeft:'5px'}}>
          {postComment.openPublic?"Public":"Friends Only"}
        </div>
        </>
        )}
        <Button icon="pi pi-check" onClick={() => send()} label="Send"/>
    </div>
    )}
    </>
  );
  return (<div>
    {rootEl && (
    <Dialog visible={visible} appendTo={rootEl} style={{width: '100vw'}}
      onHide={onHide} blockScroll footer={footer} >
      <div className="p-grid p-fluid">
        <div className="p-col-12">
          {children}
        </div>
      </div>
      {profile.name != "guest" && (
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
      )}
      {service.status == 'loading' && (
        <ProgressSpinner />
      )}
      {service.status == 'loaded' && (
        <div style={{color:'green'}}>{service.payload}</div>
      )}
      {service.status == 'error' && (
        <div style={{color:'red'}}>
          {service.error.message}
        </div>
      )}
    </Dialog>
    )}</div>
  );
};

export default CommentDialog;
