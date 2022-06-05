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
                    <img className="profile-img" src={img_file} alt={profile.first_name} onClick={openProfileDisplay}
                      onLoad={onImgLoad} title={profile.first_name}/>
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
                    <img className="profile-img" src={img_file} alt={profile.first_name} onClick={() => setOpenImageViewer(true)}
                      onLoad={onImgLoad} title={profile.first_name}/>
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
            title:profile.first_name+" "
        };	
    }
    return (
        <div>
            {renderImage()}
            {rootEl && (
            <div>
            <Dialog header="Profile" visible={state.display} style={{width: '90vw'}} 
                onHide={() => setState({display: false})} blockScroll appendTo={rootEl} >
                    {renderCardImage()} {profile.first_name+" - "} {profile.description}
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