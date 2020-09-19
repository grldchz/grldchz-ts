import React from 'react';
import { Comment } from '../types/Comment';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

export interface Props{
    comment: Comment;
}
const ProfileImage: React.FC<Props> = ({ comment }) => {
    const [ state, setState ] = React.useState({display: false});
    const openProfileDisplay = () => {
        setState({display: true});
    }
    const renderImage = () => {
        if(comment.img_file){
            const img_file = process.env.REACT_APP_GRLDSERVICE_URL+'media/'+comment.user_name+'/'+comment.img_file;
            return (
                <div>
                <img width='64px' className="profile-img" src={img_file} alt={comment.img_file} onClick={openProfileDisplay}/>
                </div>
            );
        }
        else{
            return (
                <div>
                    <Button type="button" icon="pi pi-user" onClick={openProfileDisplay} />
                </div>
            );				
        }
    }
    return (
        <div>
            {renderImage()}
            <Dialog header="Profile" visible={state.display} style={{width: '90vw'}} 
                onHide={() => setState({display: false})} blockScroll >
                    {renderImage()} {comment.first_name} {comment.last_name} {comment.description}
            </Dialog>
        </div>
    );
};
export default ProfileImage;