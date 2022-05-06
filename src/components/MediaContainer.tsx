/**
This is a part of the GRLDCHZ Social network

Copyright (C) 2008 grilledcheeseoftheday.com
**/
import React, { useRef } from 'react';
import { Media, PostCaption } from '../types/Media';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';
import ImageViewer from './ImageViewer';
import { Profile } from '../types/Profile';
import { Button } from 'primereact/button';
import useMediaService from '../services/useMediaService';
import { ProgressBar } from 'primereact/progressbar';
import AppUtils from '../AppUtils';
import { InputTextarea } from 'primereact/inputtextarea';
import { Menu } from 'primereact/menu';
import CopyToClipboardDialog from './CopyToClipboardDialog';
export interface Props{
    media: Media;
    profile: Profile;
    loadMedia(): void;
}
const MediaContainer: React.FC<Props> = ({ media, profile, loadMedia }) => {
    const rootEl = document.getElementById('root');    
	const { getUnescapedText, getParameterByName } = AppUtils();
    const { deleteMedia, submitCaption, setImage } = useMediaService();
    const [loading, setLoading] = React.useState(true);
    const [openImageViewer, setOpenImageViewer] = React.useState(false);
    const [ deleteFormVisible, showDeleteForm ] = React.useState(false);
    const [ progressBarVisible, showProgressBar ] = React.useState(false);
    const [ captionFormVisible, showCaptionForm ] = React.useState(false); 
    const gcotd = process.env.REACT_APP_GRLDSERVICE_URL;
    const [ mediaVisible, showMedia ] = React.useState(true); 
    const [ shareFormVisible, showShareForm ] = React.useState(false);
    if(media.is_image){
        const full = gcotd+"getfile.php?media=media/"
            + media.user_name+ "/" 
            + media.content_id + "/img_full_" 
            + media.file + ".jpeg";
        media.full = full;
        const slide = gcotd+"getfile.php?media=media/"
            + media.user_name+ "/" 
            + media.content_id + "/img_slide_" 
            + media.file + ".jpeg";
        media.slide = slide;
        const original = gcotd+"getfile.php?media=media/"
            + media.user_name+ "/" 
            + media.content_id + "/src/" 
            + media.file;
        media.original = original + "&original=true";
    }
    else{
        const mp4 = gcotd+"getfile.php?media=media/"
            + media.user_name+ "/" 
            + media.content_id + "/proxy_mp4_" 
            + media.file + ".mp4";
        media.mp4 = mp4;
    }
    const setAsMain = () => {
        showProgressBar(true);
        const postData = {
            main_img:media.file, 
            content_id:media.content_id
        };
        setImage(postData).then(() => {
            showProgressBar(false);
        });
    };
    const setAsProfile = (e: any) => {
        showProgressBar(true);
        const postData = {
            profile_img:media.file, 
            content_id:media.content_id
        };
        if(e.originalEvent.currentTarget.innerHTML.indexOf("Unset") > -1){
            postData["unset"] = true;
        }
        setImage(postData).then(() => {
            showProgressBar(false);
        });
    };
    const menuItems = [
        {label: 'Share', command:() => showShareForm(true)},
        {label: 'Download Original', url:media.original, target:"_blank"},
        {label: 'Set As Main Image', command:() => setAsMain()},
        {label: 'Set As Profile Image', command:setAsProfile},
        {label: 'Unset Profile Image', command:setAsProfile}
    ];
    const onDelete = () => {
        showProgressBar(true);
        deleteMedia(media).then(() => {
            showMedia(false);
            showProgressBar(false);
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
    const getCaption = () => {
        if(media.title != media.file){
            return getUnescapedText(media.title);
        }
        else{
            return "";
        }
    };
    const initState: PostCaption = {
        caption: getCaption(),
        media_id:media.id
      };
    const [postCaption, setCaption] = React.useState<PostCaption>(initState);
    const handleChange = (event: any) => {
        event.persist();
        setCaption((prevCaption: any) => ({
          ...prevCaption,
          [event.target.name]: event.target.value
        }));
      };
    const sendCaption = () => {
        showProgressBar(true);
        submitCaption(postCaption).then(() => {
            media.title = postCaption.caption;
            showProgressBar(false);
            showCaptionForm(false);
        });
      };

 
    const getShareUrl = () => {
        var url = window.location.href;
        if(url.indexOf("?")>-1){
          url = url.substring(0, url.indexOf("?"));
        }
      return url+"?contentid="+media.content_id+"&mediaid="+media.id;
    };
    const menuItemsRef = useRef<Menu>(new Menu({}));
	let cssClasses = ""
	if(getParameterByName("mediaid")!=""){
		cssClasses = "commentDisplay extraWide";
	}
    return (
        <div className={cssClasses}>
		{getParameterByName("mediaid")!=""&&(
		<div>
			<a href={window.location.href.split("?")[0]}>Home</a> > 
			<a href={window.location.href.split("?")[0]+"?contentid="+media.content_id}>{"contentid=" + media.content_id}</a> > 
			mediaid={media.id}
		</div>
		)}
        {mediaVisible && (
        <div>
        {progressBarVisible && (
            <div className="progressBarContainer">
            <ProgressBar mode="indeterminate" /></div>
        )}
        {media.is_image && (
            <div>
                <div className="progressSpinner" style={{display: loading ? "block" : "none"}}>
                    <ProgressSpinner/>
                </div>
                <div style={{display: loading ? "none" : "block"}}>
                    <img alt={media.file} src={media.slide} title={media.title} style={{ width: '100%', maxWidth: '600px' }} 
                        onLoad={() => setLoading(false)}
                        onClick={() => setOpenImageViewer(true)}/>
                </div>
				{getParameterByName("mediaid")!=""&&(<div>{getCaption()}</div>)}
				{getParameterByName("mediaid")===""&&(<div><a href={getShareUrl()}>{getCaption()}</a></div>)}
                <Dialog key={'IMAGE'+media.id} visible={openImageViewer} style={{width: '100vw'}} 
                onHide={() => setOpenImageViewer(false)} blockScroll >
                    <ImageViewer media={media} />
                </Dialog>
            </div>
        )}
        {!media.is_image && (
            <div>
                <div className="embed-responsive embed-responsive-16by9" style={{ width: '100%', maxWidth: '600px' }}>
                    <video controls={true} className="embed-responsive-item" style={{ width: '100%', maxWidth: '600px' }}
						 title={media.title}>
                        <source src={media.mp4} type="video/mp4" />
                    </video>
                </div>					
				{getParameterByName("mediaid")!=""&&(<div>{getCaption()}</div>)}
				{getParameterByName("mediaid")===""&&(<div><a href={getShareUrl()}>{getCaption()}</a></div>)}
            </div>
        )}
        {profile.name == media.user_name && (
        <div style={{float:'right',paddingLeft:'3px'}}>
        <Button type="button" icon="pi pi-fw pi-trash" onClick={() => showDeleteForm(true)} style={{margin: '3px'}} />
        <Button type="button" icon="pi pi-fw pi-pencil" onClick={() => showCaptionForm(true)} style={{margin: '3px'}} />
        <Menu model={menuItems} popup ref={menuItemsRef} appendTo={rootEl} />
        {!media.is_image && (<Button icon="pi pi-share-alt" onClick={() => showShareForm(true)} style={{margin: '3px'}} />)}
        {media.is_image && (<Button icon="pi pi-bars" onClick={(event) => menuItemsRef.current.toggle(event)} style={{margin: '3px'}}/>)}
        <Dialog key={'DELETE'+media.id} visible={deleteFormVisible} 
            onHide={() => showDeleteForm(false)} blockScroll footer={renderDeleteFooter()}>
            Are you sure you want to delete this media?
        </Dialog>
        <Dialog key={'EDIT'+media.id} header="Caption" visible={captionFormVisible} 
                onHide={() => showCaptionForm(false)} blockScroll footer={<Button onClick={() => sendCaption()} label="Send"/>} >
            <div className="p-grid p-fluid">
                <div className="p-col-12">
                    <InputTextarea rows={2} cols={30} 
                        name="caption"
                        value={postCaption.caption} onChange={handleChange}/>
                </div>
            </div>
        </Dialog>
        </div>
        )}
        {media.user_name != profile.name &&  (
            <div style={{float:'right',paddingLeft:'3px'}}>
              <Button icon="pi pi-share-alt" onClick={() => showShareForm(true)} style={{margin: '3px'}} />
            </div>
        )}
		<div style={{float:'right',paddingLeft:'3px'}}>views: {media.num_hits}</div>
        </div>
        )}
        {!mediaVisible && (<div></div>)}
        <CopyToClipboardDialog key={'SHARE'+media.id} textToCopy={getShareUrl()} visible={shareFormVisible} 
            onHide={() => showShareForm(false)} asDialog={true}>            
        </CopyToClipboardDialog>
        </div>
    );
}
export default MediaContainer;
