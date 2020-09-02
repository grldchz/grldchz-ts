import React from 'react';
import { Comment } from '../types/Comment';
import ProfileImage from './ProfileImage';
import MediaScroller from './MediaScroller';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import {FileUpload} from 'primereact/fileupload';
import CommentForm from './CommentForm';
import { Profile } from '../types/Profile';
import useCommentService from '../services/useCommentService';
import { ProgressBar } from 'primereact/progressbar';
export interface Props{
    comment: Comment;
    profile: Profile;
    loadComments(): void;
  }
const CommentDisplay: React.FC<Props> = ({ comment, profile, loadComments }) => {
  const { deleteComment } = useCommentService();
  const [ mediaScroller, setMediaScroller ] = React.useState(false);
  const [ editFormVisible, showEditForm ] = React.useState(false);
  const [ replyFormVisible, showReplyForm ] = React.useState(false);
  const [ deleteFormVisible, showDeleteForm ] = React.useState(false);
  const [ shareFormVisible, showShareForm ] = React.useState(false);
  const [ progressBarVisible, showProgressBar ] = React.useState(false);
  const renderMainImage = () => {
    const style = {display:'block'};
    if(comment.image === null || comment.num_photos === 0){
      style.display = 'none';
    }
    var src = process.env.REACT_APP_GRLDSERVICE_URL+'getfile.php?media=media/'
      + comment.user_name+ "/" 
      + comment.image;
    return (
      <div>
        <span title={comment.image}><img src={src} style={style} onClick={() => setMediaScroller(true)}/></span>
      </div>
    );
  };
  const onDelete = () => {
    deleteComment(comment.id).then(() => {
      loadComments();
    });
  };
  const renderDeleteFooter = () => {
      return (
          <div>
              <Button label="Yes" icon="pi pi-check" onClick={() => onDelete()} />
              <Button label="No" icon="pi pi-times" onClick={() => showDeleteForm(false)} className="p-button-secondary"/>
          </div>
      );
  };
  const getShareUrl = () => {
    var url = window.location.href;
    if(url.indexOf("?")>-1){
      url = url.substring(0, url.indexOf("?")-1);
    }
    return url + "?content_id=" + comment.id;
  };
  const renderComment = (comment: Comment) => {
    return (
    <div>
      {progressBarVisible && (
        <div style={{position:'fixed', top: '0px', margin: '0px', width: '100%'}}>
        <ProgressBar mode="indeterminate" style={{backgroundColor: 'black', height: '3px'}} /></div>
      )}
      <div className="p-grid">
        <div className="p-col-12 p-md-8">
        <div className="p-grid">
            <div className="p-col-12 p-md-2"><ProfileImage comment={comment} /></div>
            <div className="p-col-12 p-md-8">{comment.first_name} @ {comment.post_date_time}</div>
            <div className="p-col-12 p-md-2"><a href='#' onClick={() => setMediaScroller(true)}>photos: {comment.num_photos}, videos: {comment.num_videos}</a></div>
          </div>
        </div>
        <div className="p-col-12 p-md-4" style={{textAlign:'right'}}>
            <Button type="button" icon="pi pi-pencil" onClick={() => showEditForm(true)} style={{margin: '3px'}} />
            <Button type="button" icon="pi pi-trash" onClick={() => showDeleteForm(true)} style={{margin: '3px'}} />
            <Button type="button" icon="pi pi-reply" onClick={() => showReplyForm(true)} style={{margin: '3px'}} />
            <Button type="button" icon="pi pi-share-alt" onClick={() => showShareForm(true)} style={{margin: '3px'}} />
            <div style={{paddingTop:'3px',float:'right',paddingLeft:'3px'}}>
            <FileUpload name="upl[]" url={process.env.REACT_APP_GRLDSERVICE_URL+'upload.php?id=' + comment.id} 
              multiple={true} withCredentials={true} mode="basic" auto={true} chooseLabel="Upload"
              accept="image/*,video/mp4" 
              onUpload={() => {loadComments();showProgressBar(false);}} 
              onSelect={() => showProgressBar(true)} />
            </div>
        </div>
      </div>
      <div className="p-grid">
      <div className="p-col-12 p-md-12">
          <div className="p-grid">
            <div className="p-col-12 p-md-4">{renderMainImage()}</div>
            <div className="p-col-12 p-md-8">{comment.comment}</div>
          </div>
        </div>
      </div>
      <CommentForm key={'EDIT'+comment.id} visible={editFormVisible} onHide={() => showEditForm(false)}
        editComment={comment} profile={profile} onSubmit={loadComments} />
      <Dialog visible={deleteFormVisible} style={{width: '100vw'}} 
        onHide={() => showDeleteForm(false)} blockScroll footer={renderDeleteFooter()}>
          Are you sure you want to delete this comment?
      </Dialog>
      <CommentForm key={'REPLY'+comment.id} visible={replyFormVisible} onHide={() => showReplyForm(false)}
        parentId={comment.id} profile={profile} onSubmit={loadComments} />
      <CommentForm key={'SHARE'+comment.id} visible={shareFormVisible} onHide={() => showShareForm(false)}
        shareId={comment.id} profile={profile} onSubmit={loadComments}>
          <div><a href={getShareUrl()}>{getShareUrl()}</a></div>
      </CommentForm>
      <Dialog header="Media" visible={mediaScroller} style={{width: '100vw'}} 
        onHide={() => setMediaScroller(false)} blockScroll >
          <MediaScroller profile={profile} comment={comment} />
      </Dialog>
      </div>
    );
  };
  return renderComment(comment);

};
export default CommentDisplay;
