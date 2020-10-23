import React from 'react';
import { Comment } from '../types/Comment';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import ImageViewer, { MediaImage } from './ImageViewer';

export interface Props{
    comment: Comment;
}
const ProfileImage: React.FC<Props> = ({ comment }) => {
    const rootEl = document.getElementById('root');
    const [ state, setState ] = React.useState({display: false});
    const [openImageViewer, setOpenImageViewer] = React.useState(false);
    const openProfileDisplay = () => {
        setState({display: true});
    }
    const onImgLoad = (evnt?: any) => {
        if(evnt.target.width <= evnt.target.height){
            evnt.target.style['width']='100%';
            evnt.target.style['height']='unset';            
        }
        else{
            evnt.target.style['left']='-15%'; 
        }
      };
      const renderImage = () => {
        if(comment.img_file){
            const img_file = process.env.REACT_APP_GRLDSERVICE_URL+'media/'+comment.user_name+'/'+comment.img_file;
            return (
                <div className="profileImageContainer">
                    <img className="profile-img" src={img_file} alt={comment.img_file} onClick={openProfileDisplay}
                      onLoad={onImgLoad}/>
                </div>
            );
        }
        else{
            return (
                    <Button type="button" icon="pi pi-user" onClick={openProfileDisplay} />
            );				
        }
    }
    const renderCardImage = () => {
        if(comment.img_file){
            const img_file = process.env.REACT_APP_GRLDSERVICE_URL+'media/'+comment.user_name+'/'+comment.img_file;
            return (
                <div className="profileImageContainer">
                    <img className="profile-img" src={img_file} alt={comment.img_file} onClick={() => setOpenImageViewer(true)}
                      onLoad={onImgLoad}/>
                </div>
            );
        }
        else{
            return (
                <div>
                    <span className="pi pi-user" />
                </div>
            );				
        }
    }
    let media:MediaImage = {'full':'', 'title':''};
    if(comment.img_file){
        const href_file = comment.img_file.replace(/img_thumb_/, "img_full_");
        const img_href = process.env.REACT_APP_GRLDSERVICE_URL + "getfile.php?media=media/"
            + comment.user_name + "/" + href_file;
        media = {
            full:img_href, 
            title:comment.img_file.split("/")[1].replace(/img_thumb_/, "img_profile_")
        };	
    }
    return (
        <div>
            {renderImage()}
            {rootEl && (
            <div>
            <Dialog header="Profile" visible={state.display} style={{width: '90vw'}} 
                onHide={() => setState({display: false})} blockScroll appendTo={rootEl} >
                    {renderCardImage()} {comment.first_name} {comment.last_name} {comment.description}
            </Dialog>
            <Dialog header="Photo" visible={openImageViewer} style={{width: '100vw'}} 
                onHide={() => setOpenImageViewer(false)} blockScroll appendTo={rootEl} >
                <ImageViewer media={media} />
            </Dialog>
            </div>
            )}
        </div>
    );
};
export default ProfileImage;