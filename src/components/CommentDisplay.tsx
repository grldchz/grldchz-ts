/**
	This is a part of the grilledcheeseoftheday.com

	Copyright (C) 2022 grilledcheeseoftheday.com

    grilledcheeseoftheday.com is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    grilledcheeseoftheday.com is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see http://www.gnu.org/licenses/.
**/
import React, { useRef } from 'react';
import { Comment } from '../types/Comment';
import ProfileImage from './ProfileImage';
import MediaScroller from './MediaScroller';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import CommentForm from './CommentForm';
import { Profile } from '../types/Profile';
import useCommentService from '../services/useCommentService';
import { ProgressBar } from 'primereact/progressbar';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Menu } from 'primereact/menu';
import AppUtils from '../AppUtils';
import CopyToClipboardDialog from './CopyToClipboardDialog';
import { AppState } from '../types/AppState';
export interface Props{
  appState: AppState;
  comment: Comment;
  profile: Profile;
  loadComments(args?: any, content_id?: any): void;
}
interface UploadResponse{
  status: "success" | "error",
  msg?: string
}
interface UploadFile{
  name: string;
  size: number;
  type: string;
  objectURL: string;
  response?: UploadResponse;
}
interface Upload{
  files: UploadFile[];
  errors:boolean;
}
const CommentDisplay: React.FC<Props> = ({ appState, comment, profile, loadComments }) => {
  const rootEl = document.getElementById('root');
  const { getUnescapedText, getParameterByName, getContextRoot } = AppUtils();
  const { deleteComment } = useCommentService();
  const [ mediaScroller, setMediaScroller ] = React.useState(false);
  const [ editFormVisible, showEditForm ] = React.useState(false);
  const [ replyFormVisible, showReplyForm ] = React.useState(false);
  const [ deleteFormVisible, showDeleteForm ] = React.useState(false);
  const [ shareFormVisible, showShareForm ] = React.useState(false);
  const [ progressBarVisible, showProgressBar ] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [uploadFormVisible, showUploadForm] = React.useState(false);
  const menuItems = [
    {label: 'Reply', icon: 'pi pi-fw pi-reply',command:() => showReplyForm(true)}
  ];
  if(comment.user_name == profile.name){
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
      const topPortrait = -(((evnt.target.width/evnt.target.height)*20)/2);
      evnt.target.style['top'] = topPortrait + "%";
      evnt.target.style['width'] = '50%';
      evnt.target.style['left'] = '25%';
    }
    else if(evnt.target.width > evnt.target.height){
      const topLandscape = -(((evnt.target.height/evnt.target.width)*70)/2);
      evnt.target.style['top'] = topLandscape + "%";
    }
    else{
      evnt.target.style['top'] = '-70%';
    }
    setLoading(false);
  };
  let mainImageContainerClasses = "mainImageContainer";
  if(getParameterByName("contentid") || appState.commentQuery.content_id){
    mainImageContainerClasses += " extraHeight";
  }
  const renderMainImage = (comment: Comment) => {
    let slide = null;
    if(comment.image != null && comment.image != "" && !comment.image.endsWith(".mp4.jpeg")){
      slide = comment.image.replace("profile", "slide");
    }
    const src = process.env.REACT_APP_GRLDSERVICE_URL+'getfile.php?media=media/'
      + comment.user_name+ "/" 
      + slide;
    return (
      <div className="centerDiv">
      {comment.num_photos > 0 && slide != null && !comment.image.endsWith(".mp4.jpeg") && (
        <div className={mainImageContainerClasses} onClick={() => setMediaScroller(true)}>
          <div className="progressSpinner" style={{display: loading ? "block" : "none"}}>
            <ProgressSpinner/>
          </div>
          <img style={{display: loading ? "none" : "block"}} alt={slide} title={getUnescapedText(comment.image_title)}
            src={src} onLoad={onImgLoad} className="mainImage"/>
          <div className="imageCount">{"Photos:"+(comment.num_photos>0?comment.num_photos:"")}</div>
          {comment.num_videos > 0 && (
            <div className="videoCount">{"Videos:"+(comment.num_videos>0?comment.num_videos:"")}</div>
          )}
        </div>
      )}
      {comment.num_photos == 0 && comment.num_videos > 0 && (
        <div className={mainImageContainerClasses}>
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
        <div className={mainImageContainerClasses}>
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
	if(!comment.parent_id){
        loadComments(null, comment.id);
	}
	else{
		loadComments(null, comment.parent_id);
	}
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
	let shareUrl = getContextRoot() + "/content/" + comment.id;
    return shareUrl;
  };
  const menuItemsRef = useRef<Menu>(new Menu({}));
  const cardTitle = () => {
    return (
      <div className="p-grid">
        <div className="p-col-4">
        <ProfileImage profile={comment} /></div>
        <div className="p-col-8">{comment.first_name} @ {comment.post_date_time}</div>
     </div>
    );
  }
  const [ upload, setUpload ] = React.useState<Upload>({files:[], errors:false});
  const [ uploadProgressBarVisible, showUploadProgressBar ] = React.useState(false);
  const [ uploadProgress, setUploadProgress ] = React.useState(0);
  const uploadButtonRef = useRef<FileUpload>(null);
  const uploadHandler = async(event: any) => {
    setUploadProgress(0);
    showUploadProgressBar(true);
    const x = event.files.length;
    const space = 100/x;
    let increment = 1;
    const uploadProgressIncrements = [];
    for(let i=0; i<x; i++){
      increment += space;
      uploadProgressIncrements.push(increment);
    }
    uploadProgressIncrements.push(100);
    const files = event.files;
    for(let i = 0; i < files.length; i++){
      const response = await doUpload(files[i], Math.round(uploadProgressIncrements[i]));
      upload.files[i].response = response;
      if(response.status == 'error') upload.errors = true;
    };
    showUploadProgressBar(false);
    upload.files = upload.files.filter(file => (file.response && file.response.status == 'error'));
    if(!upload.errors){
      showUploadForm(false);
    }
    loadComments(null, comment.id);
    if(uploadButtonRef.current)uploadButtonRef.current.clear();
  };

  const getExtension = (filename: string) => {
    var parts = filename.split('.');
    return parts[parts.length - 1];
  };

  const isImage = (filename: string) => {
    var ext = getExtension(filename);
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'gif':
      case 'bmp':
      case 'png':
      case 'jpe':
      case 'jpeg':
      case 'ico':
      case 'tiff':
      case 'tif':
      case 'svg':
      case 'svgz':
      return true;
    }
    return false;
  };

  // const isVideo = (filename: string) => {
  //   var ext = getExtension(filename);
  //   switch (ext.toLowerCase()) {
  //     case 'm4v':
  //     case 'avi':
  //     case 'mpg':
  //     case 'mp4':
  //     case 'mov':
  //     case 'qt':
  //     case 'flv':
  //     case 'wmv':
  //     case 'webm':
  //     case 'ogv':
  //     case 'rm':
  //     return true;
  //   }
  //   return false;
  // };

  const isMp4 = (filename: string) => {
    var ext = getExtension(filename);
    if(ext.toLowerCase() == 'mp4') {
      return true;
    }
    return false;
  };  
  const validateFile = (file: any) => {
    if(process.env.REACT_APP_GRLDSERVICE_UPLOAD_MAX_SIZE 
      && file.size < process.env.REACT_APP_GRLDSERVICE_UPLOAD_MAX_SIZE
      && (isImage(file.name) || isMp4(file.name))){
      return true;
    }
    return false;
  };
  const doUpload = async(file: any, uploadProgressIncrement: number) => {
    const isValid = validateFile(file);
    if(isValid){
      let formData = new FormData();
      formData.append('upl[]', file);
      showProgressBar(true);  
      const response = await fetch(process.env.REACT_APP_GRLDSERVICE_URL+'upload.php?id=' + comment.id,
        {
          method: 'POST', 
          body: formData,
          credentials: "include"
        }
      );
      showProgressBar(false);
      const responseJson = await response.json();
      setUploadProgress(uploadProgressIncrement);
      return responseJson;
    }
    else{
      return {status: "error", msg: process.env.REACT_APP_GRLDSERVICE_UPLOAD_ERROR}
    }
  }
  const onSelect = (event: any) => {
      event.originalEvent.preventDefault();
      showUploadForm(true);
      const files = event.files;
      const uploadFiles: UploadFile[] = [];
      for(let i = 0; i < files.length; i++){
        uploadFiles.push(files[i]);
      }
      setUpload({files: uploadFiles,errors:false});
    };
    const formatUploadResponse = (file: UploadFile) => {
      if(!file.response){
        return <div></div>;
      }
      else{
        return <div style={{paddingLeft:'10px'}}>
          <div style={{color:upload.errors?'red':'inherit'}}>{file.response.status}</div>
          {file.response.msg && <div style={{color:upload.errors?'red':'inherit'}}>{file.response.msg}</div>}
        </div>;
      }
    }
    const setCodeBoxStyle = (content: string) => {
      content = content.replace("<pre","<pre class=\"pre-display\"");
      return content;
    };
  const renderComment = (comment: Comment) => {
    return (
    <div>
      {progressBarVisible && (
        <div className="progressBarContainer">
        <ProgressBar mode="indeterminate" /></div>
      )}
      {!comment.parent_id && getParameterByName("contentid") && (
        <div><a href={getContextRoot()} title={process.env.REACT_APP_TITLE}>{process.env.REACT_APP_TITLE}</a> {" > contentid=" + getParameterByName("contentid")}</div>
      )}
      {!comment.parent_id && comment.user_name == profile.name && process.env.REACT_APP_PUBLIC_ENABLED == "true" && (
        <div style={{color:'red'}}>
			{comment.open_public==0?"":"PUBLIC"}
        </div>
        )}
      {renderMainImage(comment)}
        {!comment.shared && !comment.parent_id && comment.user_name == profile.name && (
          <div style={{padding:'3px',float:'right'}}>
            <FileUpload key={'UPLOAD'+comment.id} ref={uploadButtonRef}
              multiple={true} mode="basic" chooseLabel="Upload"
              accept="image/*,video/mp4" customUpload={true} uploadHandler={uploadHandler}
              onSelect={onSelect} auto={true} />
          </div>
          )}
        {!comment.shared && profile.name != "guest" && ( 
          <> 
          {comment.user_name == profile.name && (
            <div style={{float:'right',paddingLeft:'3px'}}>
              <Menu model={menuItems} popup ref={menuItemsRef} appendTo={rootEl} />
              <Button icon="pi pi-bars" onClick={(event) => menuItemsRef.current.toggle(event)} style={{margin: '3px'}}/>
            </div>
          )}
          {comment.user_name != profile.name && (
            <div style={{float:'right',paddingLeft:'3px'}}>
              <Button icon="pi pi-reply" onClick={() => showReplyForm(true)} style={{margin: '3px'}} />
            </div>
          )}
          </>
        )}
        {!comment.parent_id && comment.user_name != profile.name &&  (
            <div style={{float:'right',paddingLeft:'3px'}}>
              <Button icon="pi pi-share-alt" onClick={() => showShareForm(true)} style={{margin: '3px'}} />
            </div>
        )}
      {cardTitle()}
      <div style={{padding:'3px'}} dangerouslySetInnerHTML={{__html: setCodeBoxStyle(getUnescapedText(comment.comment))}}></div>
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
            <MediaScroller profile={profile} content_id={comment.id} />
        </Dialog>
        <Dialog key={'UPLOAD_DETAILS'+comment.id} visible={uploadFormVisible} appendTo={rootEl} 
          onHide={() => showUploadForm(false)} blockScroll >
        {uploadProgressBarVisible && (
          <ProgressBar value={uploadProgress} />
        )}
        {upload.files.map((file: UploadFile) => {
          return <div className="commentDisplay" key={'UPLOAD_FILE'+file.name}>
            <div className="p-grid">
              <div className="p-col-4">
                <img src={file.objectURL} alt={file.objectURL} style={{width: '100px'}} />
              </div>
              <div className="p-col-8">
                <div style={{overflow:'hidden',textOverflow:'ellipsis'}}>{file.name}</div>
                <div>{file.size}</div>
                <div>{file.type}</div>
              </div>
              <div className="p-grid">
              <div className="p-col-12">
                <div>{formatUploadResponse(file)}</div>
              </div>
              </div>
            </div>
          </div>;
        })}
        </Dialog>

      </div>
      )}
      <CommentForm key={'REPLY'+comment.id} visible={replyFormVisible} onHide={() => showReplyForm(false)}
        parentId={comment.id} profile={profile} onSubmit={onSubmit} />
      <CommentForm key={'SHARE'+comment.id} visible={shareFormVisible} onHide={() => showShareForm(false)}
        shareId={comment.id} profile={profile} onSubmit={onSubmit}>
          <CopyToClipboardDialog key={'SHARE'+comment.id} textToCopy={getShareUrl()} onHide={()=>{}} asDialog={false}></CopyToClipboardDialog>
      </CommentForm>
      </div>
    );
  };
  return renderComment(comment);

};
export default CommentDisplay;
