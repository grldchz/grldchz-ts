import React from 'react';
import { Media } from '../types/Media';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';
import ImageViewer from './ImageViewer';
import { Profile } from '../types/Profile';
import { Button } from 'primereact/button';
import useMediaService from '../services/useMediaService';
import { ProgressBar } from 'primereact/progressbar';
export interface Props{
    media: Media;
    profile: Profile;
    loadMedia(): void;
}
const MediaContainer: React.FC<Props> = ({ media, profile, loadMedia }) => {
    const { deleteMedia } = useMediaService();
    const [loading, setLoading] = React.useState(true);
    const [openImageViewer, setOpenImageViewer] = React.useState(false);
    const [ deleteFormVisible, showDeleteForm ] = React.useState(false);
    const [ progressBarVisible, showProgressBar ] = React.useState(false);
     
    const gcotd = process.env.REACT_APP_GRLDSERVICE_URL;
    if(media.is_image){
        const full = gcotd+"/media/"
            + media.user_name+ "/" 
            + media.content_id + "/img_full_" 
            + media.file + ".jpeg";
        media.full = full;
        const slide = gcotd+"/getfile.php?media=media/"
            + media.user_name+ "/" 
            + media.content_id + "/img_slide_" 
            + media.file + ".jpeg";
        media.slide = slide;
        var original = gcotd+"/getfile.php?media=media/"
            + media.user_name+ "/" 
            + media.content_id + "/src/" 
            + media.file;
        media.original = original + "&original=true";
    }
    else{
        var mp4 = gcotd+"/getfile.php?media=media/"
            + media.user_name+ "/" 
            + media.content_id + "/proxy_mp4_" 
            + media.file + ".mp4";
        media.mp4 = mp4;
    }
    const onDelete = () => {
        showProgressBar(true);
        deleteMedia(media).then(() => {
            showProgressBar(false);
            loadMedia();
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
      return (
        <div>
        {progressBarVisible && (
            <div style={{position:'fixed', top: '0px', margin: '0px', width: '100%'}}>
            <ProgressBar mode="indeterminate" style={{backgroundColor: 'black', height: '3px'}} /></div>
        )}
        {media.is_image && (
            <div>
                <div style={{display: loading ? "block" : "none"}}>
                    <ProgressSpinner/>
                </div>
                <div style={{display: loading ? "none" : "block"}}>
                    <img src={media.slide} alt={media.title} style={{ width: '100%', maxWidth: '600px' }} 
                        onLoad={() => setLoading(false)}
                        onClick={() => setOpenImageViewer(true)}/>
                </div>
                <Dialog header="Photo" visible={openImageViewer} style={{width: '100vw'}} 
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
        <Button type="button" icon="pi pi-trash" onClick={() => showDeleteForm(true)} style={{margin: '3px'}} />
        <Dialog visible={deleteFormVisible} style={{width: '100vw'}} 
            onHide={() => showDeleteForm(false)} blockScroll footer={renderDeleteFooter()}>
            Are you sure you want to delete this media?
        </Dialog>
        </div>
    );
}
export default MediaContainer;
