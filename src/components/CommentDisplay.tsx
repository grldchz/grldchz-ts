import React, { useRef } from 'react';
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
import { ProgressSpinner } from 'primereact/progressspinner';
import { Menu } from 'primereact/menu';
import AppUtils from '../AppUtils';
export interface Props{
    comment: Comment;
    profile: Profile;
    loadComments(): void;
  }
const CommentDisplay: React.FC<Props> = ({ comment, profile, loadComments }) => {
  const rootEl = document.getElementById('root');
  const { getUnescapedText } = AppUtils();
  const { deleteComment } = useCommentService();
  const [ mediaScroller, setMediaScroller ] = React.useState(false);
  const [ editFormVisible, showEditForm ] = React.useState(false);
  const [ replyFormVisible, showReplyForm ] = React.useState(false);
  const [ deleteFormVisible, showDeleteForm ] = React.useState(false);
  const [ shareFormVisible, showShareForm ] = React.useState(false);
  const [ progressBarVisible, showProgressBar ] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const menuItems = [
    {label: 'Reply', icon: 'pi pi-fw pi-plus',command:() => showReplyForm(true)}
  ];
  if(comment.user_name === profile.name){
    menuItems.push(
      {label: 'Edit', icon: 'pi pi-fw pi-pencil',command:() => showEditForm(true)},
      {label: 'Delete', icon: 'pi pi-fw pi-trash',command:() => showDeleteForm(true)}
    );
  }
  if(!comment.parent_id){
    menuItems.push(
      {label: 'Share', icon: 'pi pi-fw pi-share-alt',command:() => showShareForm(true)}
      );
  }
  const onImgLoad = (evnt?: any) => {
    if(evnt.target.width < evnt.target.height){
      const topPortrait = -(((evnt.target.width/evnt.target.height)*50)/2);
      evnt.target.style['top'] = topPortrait + "%";
      evnt.target.style['width'] = '50%';
      evnt.target.style['left'] = '25%';
    }
    else if(evnt.target.width > evnt.target.height){
      const topLandscape = -(((evnt.target.height/evnt.target.width)*100)/2);
      evnt.target.style['top'] = topLandscape + "%";
    }
    else{
      evnt.target.style['top'] = '-70%';
    }
    setLoading(false);
  };
  const renderMainImage = (comment: Comment) => {
    let slide = null;
    if(comment.image != null && comment.image != "" && !comment.image.endsWith(".mp4.jpeg")){
      slide = comment.image.replace("profile", "slide");
    }
    const src = process.env.REACT_APP_GRLDSERVICE_URL+'getfile.php?hitcounter=false&media=media/'
      + comment.user_name+ "/" 
      + slide;
    return (
        <div className="centerDiv">
      {comment.num_photos > 0 && slide != null && !comment.image.endsWith(".mp4.jpeg") && (
          <div className="mainImageContainer" onClick={() => setMediaScroller(true)}>
                <div className="progressSpinner" style={{display: loading ? "block" : "none"}}>
                  <ProgressSpinner/>
                </div>
              <img style={{display: loading ? "none" : "block"}} alt={slide} 
                src={src} onLoad={onImgLoad} className="mainImage"/>
              <div className="imageCount">{"Photos:"+(comment.num_photos>0?comment.num_photos:"")}</div>
              {comment.num_videos > 0 && (
              <div className="videoCount">{"Videos:"+(comment.num_videos>0?comment.num_videos:"")}</div>
              )}
          </div>
      )}
      {comment.num_photos == 0 && comment.num_videos > 0 && (
        <div className="mainImageContainer">
            <div className="mainNoImage"><Button alt="Main Photo not set" icon="pi pi-images" onClick={() => setMediaScroller(true)}></Button>
            {comment.num_photos > 0 && (
            <div className="imageCount">{"Photos:"+(comment.num_photos>0?comment.num_photos:"")}</div>
            )}
            {comment.num_videos > 0 && (
            <div className="videoCount">{"Videos:"+(comment.num_videos>0?comment.num_videos:"")}</div>
            )}
            </div>
        </div>
      )}
      {comment.num_photos > 0 && slide == null && (
        <div className="mainImageContainer">
            <div className="mainNoImage"><Button alt="Main Photo not set" icon="pi pi-images" onClick={() => setMediaScroller(true)}></Button>
            {comment.num_photos > 0 && (
            <div className="imageCount">{"Photos:"+(comment.num_photos>0?comment.num_photos:"")}</div>
            )}
            {comment.num_videos > 0 && (
            <div className="videoCount">{"Videos:"+(comment.num_videos>0?comment.num_videos:"")}</div>
            )}
            </div>
        </div>
      )}
      </div>
      );
  };
  const onDelete = () => {
    showDeleteForm(false);
    showProgressBar(true);
    deleteComment(comment.id).then(() => {
      showProgressBar(false);
      loadComments();
    });
  };
  const onSubmit = () => {
    showEditForm(false);
    showShareForm(false);
    showReplyForm(false);
    loadComments();
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
  const menuItemsRef = useRef<Menu>(new Menu({}));
  const cardTitle = () => {
    return (
      <div className="p-grid">
        <div className="p-col-4">
        <ProfileImage comment={comment} /></div>
        <div className="p-col-8"><b>{comment.first_name} @ {comment.post_date_time}</b></div>
      </div>
    );
  }
  const renderComment = (comment: Comment) => {
    return (
    <div>
      {progressBarVisible && (
        <div className="progressBarContainer">
        <ProgressBar mode="indeterminate" /></div>
      )}
      {renderMainImage(comment)}
        {!comment.shared && !comment.parent_id && comment.user_name === profile.name && (
          <div style={{padding:'3px',float:'right'}}>
          <FileUpload name="upl[]" url={process.env.REACT_APP_GRLDSERVICE_URL+'upload.php?id=' + comment.id} 
            multiple={true} withCredentials={true} mode="basic" auto={true} chooseLabel="Upload"
            accept="image/*,video/mp4" 
            onUpload={() => {loadComments();showProgressBar(false);}} 
            onSelect={() => showProgressBar(true)} />
          </div>
          )}
        {!comment.shared && (  
          <div style={{float:'right',paddingLeft:'3px'}}>
          <Menu model={menuItems} popup ref={menuItemsRef} appendTo={rootEl} />
          <Button icon="pi pi-bars" onClick={(event) => menuItemsRef.current.toggle(event)} style={{margin: '3px'}}/>
          </div>
        )}
      {cardTitle()}
      <div style={{padding:'3px'}} dangerouslySetInnerHTML={{__html: getUnescapedText(comment.comment)}}></div>
      <CommentForm key={'EDIT'+comment.id} visible={editFormVisible} onHide={() => showEditForm(false)}
        editComment={comment} profile={profile} onSubmit={onSubmit} />
      {rootEl && (
      <div>
        <Dialog key={'DELETE'+comment.id} visible={deleteFormVisible} appendTo={rootEl} 
          onHide={() => showDeleteForm(false)} blockScroll footer={renderDeleteFooter()}>
            Are you sure you want to delete this comment?
        </Dialog>
        <Dialog key={'MEDIA'+comment.id} visible={mediaScroller} appendTo={rootEl} 
          onHide={() => setMediaScroller(false)} blockScroll >
            <MediaScroller profile={profile} comment={comment} />
        </Dialog>
      </div>
      )}
      <CommentForm key={'REPLY'+comment.id} visible={replyFormVisible} onHide={() => showReplyForm(false)}
        parentId={comment.id} profile={profile} onSubmit={onSubmit} />
      <CommentForm key={'SHARE'+comment.id} visible={shareFormVisible} onHide={() => showShareForm(false)}
        shareId={comment.id} profile={profile} onSubmit={onSubmit}>
          <div><a href={getShareUrl()}>{getShareUrl()}</a></div>
      </CommentForm>
      </div>
    );
  };
  return renderComment(comment);

};
export default CommentDisplay;
