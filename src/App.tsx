import React from 'react';
import './App.css';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import Login from './components/Login';
import ProfileForm from './components/ProfileForm';
import useProfileService from './services/useProfileService';
import {ProgressBar} from 'primereact/progressbar';
import { Profile } from './types/Profile';
import { AppState } from './types/AppState';
import CommentScroller from './components/CommentScroller';
import CommentForm from './components/CommentForm';

const App: React.FC<{}> = () => {
  const [profile, setProfile] = React.useState<Profile>();
  const [ profileFormVisible, showProfileForm ] = React.useState(false);
  const [ commentFormVisible, showCommentForm ] = React.useState(false);
  const [ appState, setAppState ] = React.useState<AppState>();
  const profileService = useProfileService(setProfile);
  const loadComments = () => {
    setAppState({
      commentQuery: { start: 0, limit: 10 },
      comments: [], commentsTotal: 0, loading: true
    });
  };
  const handleProfileFormSubmit = (profile: Profile) => {
    setProfile(profile);
    loadComments();
  };
  return (
    <div>
      <div className="menu-bar">
        {profile && (
        <div>
          <div style={{textAlign: 'right'}}>
            <Button type="button" icon="pi pi-user-edit" onClick={() => showProfileForm(true)} style={{margin: '3px'}} />
            <Button type="button" icon="pi pi-plus" onClick={() => showCommentForm(true)} style={{margin: '3px'}} />
          </div>
            <Dialog header="Profile" visible={profileFormVisible} style={{width: '100vw'}} 
              onHide={() => showProfileForm(false)} blockScroll >
                <ProfileForm profile={profile} onSubmit={handleProfileFormSubmit} />
            </Dialog>
            <CommentForm key="NEW" visible={commentFormVisible} onHide={() => showCommentForm(false)}
              profile={profile} onSubmit={loadComments} />
        </div>
        )}
      </div>
        {profile &&
           <CommentScroller appStateIn={appState} profile={profile} loadComments={loadComments}/>
        }
      {profileService.status === 'loading' && (
          <div style={{position:'fixed', top: '0px', margin: '0px', width: '100%'}}>
          <ProgressBar mode="indeterminate" style={{height: '3px'}} /></div>
    )}
      {profileService.status === 'error' && !profile && (
        <Login setProfile={(profile: Profile) => handleProfileFormSubmit(profile)} />
      )}


    </div>
  );
};

export default App;
