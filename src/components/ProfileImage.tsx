/**
This is a part of the GRLDCHZ Social network

Copyright (C) 2008 grilledcheeseoftheday.com
**/
import React from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import ImageViewer, { MediaImage } from './ImageViewer';
import { Profile } from '../types/Profile';

export interface Props{
    profile: Partial<Profile>;
}
const ProfileImage: React.FC<Props> = ({ profile }) => {
    if(profile.user_name) profile.name=  profile.user_name;
    if(profile.name) profile.user_name = profile.name;
    const rootEl = document.getElementById('root');
    const [ state, setState ] = React.useState({display: false});
    const [openImageViewer, setOpenImageViewer] = React.useState(false);
    const openProfileDisplay = () => {
        setState({display: true});
    }
    const onImgLoad = (evnt?: any) => {
        if(evnt.target.width < evnt.target.height){
            evnt.target.style['width']='100%';
            evnt.target.style['height']='unset';            
            const topPortrait = -(((evnt.target.width/evnt.target.height)*(evnt.target.height-evnt.target.width)));
            evnt.target.style['top'] = topPortrait + "%";
        }
        else if(evnt.target.width > evnt.target.height){
            const leftLandscape = -(((evnt.target.height/evnt.target.width)*((evnt.target.width-evnt.target.height)*2)));
            evnt.target.style['left']= leftLandscape + '%'; 
        }
        else{
            evnt.target.style['width']='100%';
        }
      };
      const renderImage = () => {
        if(profile.img_file){
            const img_file = process.env.REACT_APP_GRLDSERVICE_URL+'media/'+profile.user_name+'/'+profile.img_file;
            return (
                <div className="profileImageContainer">
                    <img className="profile-img" src={img_file} alt={profile.first_name+" "+profile.last_name} onClick={openProfileDisplay}
                      onLoad={onImgLoad} title={profile.first_name+" "+profile.last_name}/>
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
        if(profile.img_file){
            const img_file = process.env.REACT_APP_GRLDSERVICE_URL+'media/'+profile.user_name+'/'+profile.img_file;
            return (
                <div className="profileImageContainer">
                    <img className="profile-img" src={img_file} alt={profile.first_name+" "+profile.last_name} onClick={() => setOpenImageViewer(true)}
                      onLoad={onImgLoad} title={profile.first_name+" "+profile.last_name}/>
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
    if(profile.img_file){
        const href_file = profile.img_file.replace(/img_thumb_/, "img_full_");
        const img_href = process.env.REACT_APP_GRLDSERVICE_URL + "getfile.php?media=media/"
            + profile.user_name + "/" + href_file;
        media = {
            full:img_href, 
            title:profile.first_name+" "+profile.last_name
        };	
    }
    return (
        <div>
            {renderImage()}
            {rootEl && (
            <div>
            <Dialog header="Profile" visible={state.display} style={{width: '90vw'}} 
                onHide={() => setState({display: false})} blockScroll appendTo={rootEl} >
                    {renderCardImage()} {profile.first_name} {profile.last_name} {profile.description}
            </Dialog>
            <Dialog visible={openImageViewer} style={{width: '100vw'}} 
                onHide={() => setOpenImageViewer(false)} blockScroll appendTo={rootEl} >
                <ImageViewer media={media} />
            </Dialog>
            </div>
            )}
        </div>
    );
};
export default ProfileImage;