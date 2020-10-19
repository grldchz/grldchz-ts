import React from 'react';
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
export interface Props{
    media: Media;
    profile: Profile;
    loadMedia(): void;
}
const MediaContainer: React.FC<Props> = ({ media, profile, loadMedia }) => {
    const { getUnescapedText } = AppUtils();
    const { deleteMedia, submitCaption } = useMediaService();
    const [loading, setLoading] = React.useState(true);
    const [openImageViewer, setOpenImageViewer] = React.useState(false);
    const [ deleteFormVisible, showDeleteForm ] = React.useState(false);
    const [ progressBarVisible, showProgressBar ] = React.useState(false);
    const [ captionFormVisible, showCaptionForm ] = React.useState(false); 
    const gcotd = process.env.REACT_APP_GRLDSERVICE_URL;
    const [ mediaVisible, showMedia ] = React.useState(true); 
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
        var original = gcotd+"getfile.php?media=media/"
            + media.user_name+ "/" 
            + media.content_id + "/src/" 
            + media.file;
        media.original = original + "&original=true";
    }
    else{
        var mp4 = gcotd+"getfile.php?media=media/"
            + media.user_name+ "/" 
            + media.content_id + "/proxy_mp4_" 
            + media.file + ".mp4";
        media.mp4 = mp4;
    }
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
        if(media.title !== media.file){
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
      return (
          <div>
          {mediaVisible && (
        <div>
        {progressBarVisible && (
            <div style={{position:'fixed', top: '0px', margin: '0px', width: '100%'}}>
            <ProgressBar mode="indeterminate" style={{height: '3px'}} /></div>
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
                <div>{getCaption()}</div>
				<div>views: {media.num_hits}</div>
                <Dialog key={'IMAGE'+media.id} visible={openImageViewer} style={{width: '100vw'}} 
                onHide={() => setOpenImageViewer(false)} blockScroll >
                    <ImageViewer media={media} />
                </Dialog>
            </div>
        )}
        {!media.is_image && (
            <div>
                <div className="embed-responsive embed-responsive-16by9" style={{ width: '100%', maxWidth: '600px' }}>
                    <video controls={true} className="embed-responsive-item" style={{ width: '100%', maxWidth: '600px' }}>
                        <source src={media.mp4} type="video/mp4" />
                    </video>
                </div>					
            </div>
        )}
        {profile.name === media.user_name && (
        <div>
        <Button type="button" icon="pi pi-fw pi-trash" onClick={() => showDeleteForm(true)} style={{margin: '3px'}} />
        <Button type="button" icon="pi pi-fw pi-pencil" onClick={() => showCaptionForm(true)} style={{margin: '3px'}} />
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
        </div>
        )}
        {!mediaVisible && (<div></div>)}
        </div>
    );
}
export default MediaContainer;
