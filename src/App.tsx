/**
This is a part of the GRLDCHZ Social network

Copyright (C) 2008 grilledcheeseoftheday.com
**/
import React from 'react';
import './App.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import Login from './components/Login';
import Terms from './components/Terms';
import Cookies from './components/Cookies';
import ProfileForm from './components/ProfileForm';
import useProfileService from './services/useProfileService';
import {ProgressBar} from 'primereact/progressbar';
import { Profile } from './types/Profile';
import { AppState } from './types/AppState';
import CommentScroller from './components/CommentScroller';
import CommentForm from './components/CommentForm';
import SearchForm from './components/SearchForm';
import SearchFriendForm from './components/SearchFriendForm';
import { CommentQuery, PostSearch } from './types/Comment';
import useLoginService from './services/useLoginService';
import MediaScroller from './components/MediaScroller';
import AppUtils from './AppUtils';
const App: React.FC<{}> = () => {
  const { getParameterByName } = AppUtils();
  const [profile, setProfile] = React.useState<Profile>();
  const [ profileFormVisible, showProfileForm ] = React.useState(false);
  const [ searchFormVisible, showSearchForm ] = React.useState(false);
  const [ searchFriendFormVisible, showSearchFriendForm ] = React.useState(false);
  const [ commentFormVisible, showCommentForm ] = React.useState(false);
  const [ logoutDialogVisible, showLogoutDialog ] = React.useState(false);
  const [ appState, setAppState ] = React.useState<AppState>({
    commentQuery: { start: 0, limit: 10 },
    comments: [], commentsTotal: 0, loading: false
  });
  const profileService = useProfileService(setProfile);
  const [prevSearch, setPrevSearch ] = React.useState<PostSearch>({
    searchTerm: '', fromDate: '', toDate: ''
  });
  const loadComments = (search?: PostSearch) => {
    showCommentForm(false);
    showSearchForm(false);
    showSearchFriendForm(false);
    const commentQuery:CommentQuery={ start: 0, limit: 10 };
    if(search){
      setPrevSearch(search);
      if(search.searchTerm){
        commentQuery.searchTerm = search.searchTerm;
      }
      if(search.fromDate){
        commentQuery.fromDate = search.fromDate;
      }
      if(search.toDate){
        commentQuery.toDate = search.toDate;
      }
    }
    setAppState({
      commentQuery: commentQuery,
      comments: [], commentsTotal: 0, loading: true
    });
  };
  const handleProfileFormSubmit = (profile: Profile) => {
    setProfile(profile);
    showProfileForm(false);
  };
  const renderLogoutFooter = () => {
    return (
        <div>
            <Button label="Yes" icon="pi pi-check" onClick={() => onLogout()} />
            <Button label="No" icon="pi pi-times" onClick={() => showLogoutDialog(false)} className="p-button-secondary"/>
        </div>
    );
  };
  const { service, logout } = useLoginService();
  const onLogout = () => {
    logout().then((response) => {
      showLogoutDialog(false);
      profileService.status = 'error';
      setProfile(undefined);
      setAppState({
        commentQuery: { start: 0, limit: 10 },
        comments: [], commentsTotal: 0, loading: true
      });
    });
  };
  const LightTheme = React.lazy(() => import('./LightTheme'));
  const DarkTheme = React.lazy(() => import('./DarkTheme'));
  const ThemeSelector = () => {
    const nowHour = new Date().getHours();
    const DARK = nowHour > 18 || nowHour < 6;
    return (
      <>
        <React.Suspense fallback={<></>}>
          {(!DARK) && <LightTheme />}
          {(DARK) && <DarkTheme />}
        </React.Suspense>
      </>
    )
  }
  return (
    <div><ThemeSelector/>
      <div className="menu-bar">
        {profile && profile.name && profile.name == "guest" && (
          <div style={{display: 'inline'}}>
            <Button type="button" icon="pi pi-search" onClick={() => showSearchForm(true)} style={{margin: '3px'}} />
            <Button type="button" icon="pi pi-sign-in" onClick={() => onLogout()} label="Login" style={{margin: '3px'}} />
          </div>
        )}
        {profile && profile.name && profile.name != "guest" && (
          <div style={{display: 'inline'}}>
            <Button type="button" icon="pi pi-search" onClick={() => showSearchForm(true)} style={{margin: '3px'}} />
            <Button type="button" icon="pi pi-users" onClick={() => showSearchFriendForm(true)} style={{margin: '3px'}} />
            <Button type="button" icon="pi pi-user-edit" onClick={() => showProfileForm(true)} style={{margin: '3px'}} />
            <Button type="button" icon="pi pi-plus" onClick={() => showCommentForm(true)} style={{margin: '3px'}} />
            <Button type="button" icon="pi pi-sign-out" onClick={() => showLogoutDialog(true)} style={{margin: '3px'}} />
          </div>
        )}
      </div>
      {profile && profile.name &&
        <div>
          <Dialog key="SearchFriend" visible={searchFriendFormVisible} onHide={() => showSearchFriendForm(false)}>
            <SearchFriendForm profile={profile}/>
          </Dialog>
          <Dialog visible={profileFormVisible} 
            onHide={() => showProfileForm(false)} blockScroll >
            <ProfileForm profile={profile} onSubmit={handleProfileFormSubmit} />
          </Dialog>
          <CommentForm key="NEW" visible={commentFormVisible} onHide={() => showCommentForm(false)}
            profile={profile} onSubmit={loadComments} />
          <Dialog key="Search" visible={searchFormVisible} onHide={() => showSearchForm(false)}>
            <SearchForm onSubmit={loadComments} prevSearch={prevSearch}/>
          </Dialog>
          <Dialog visible={logoutDialogVisible} 
            onHide={() => showLogoutDialog(false)} blockScroll footer={renderLogoutFooter()}>
              Are you sure you want to logout?
          </Dialog>
          {profile.cookie_policy && (
            <Cookies setProfile={(profile: Profile) => handleProfileFormSubmit(profile)} />
          )}
          {getParameterByName("mediaid") && (
          <div>
          <MediaScroller profile={profile} content_id={getParameterByName("contentid")} media_id={getParameterByName("mediaid")} />
          </div>
          )}
          {getParameterByName("mediaid") == "" && (
          <CommentScroller appState={appState} setAppState={setAppState} profile={profile} loadComments={loadComments}/>
          )}
        </div>
      }
      {(service.status == 'loading' || profileService.status == 'loading') && (
        <div className="progressBarContainer">
        <ProgressBar mode="indeterminate" /></div>
      )}
      {profileService.status == 'error' && !profile && (
        <Login setProfile={(profile: Profile) => handleProfileFormSubmit(profile)} />
      )}
      {profileService.status == 'terms' && !profile && (
        <Terms setProfile={(profile: Profile) => handleProfileFormSubmit(profile)} />
      )}
    </div>
  );
};

export default App;
