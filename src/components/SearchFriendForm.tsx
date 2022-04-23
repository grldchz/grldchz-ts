/**
This is a part of the GRLDCHZ Social network

Copyright (C) 2008 grilledcheeseoftheday.com
**/
import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Profile } from '../types/Profile';
import { FriendAppState } from '../types/AppState';
import { FriendQuery, PostSearch } from '../types/Friend';
import FriendScroller from '../components/FriendScroller';
export interface Props{
    profile: Profile;
  }
const SearchForm: React.FC<Props> = ({profile}) => {
    const [ appState, setAppState ] = React.useState<FriendAppState>({
        friendQuery: { start: 0, limit: 10, skilletSearchTerm: '%', skilletUserId: profile.id },
        friends: [], friendsTotal: 0, loading: false
      });
    const initSearchState: PostSearch = {
        skilletSearchTerm: '', skilletUserId: profile.id
      };
        
    const [postSearch, setPostSearch] = React.useState<PostSearch>(initSearchState);
    const loadFriends = () => {
        const friendQuery:FriendQuery={ start: 0, limit: 10, skilletUserId: profile.id };
        if(postSearch && postSearch.skilletSearchTerm){
            friendQuery.skilletSearchTerm = postSearch.skilletSearchTerm;
            friendQuery.skilletUserId = undefined;
        }
        else{
            friendQuery.skilletSearchTerm = '%';
            friendQuery.skilletUserId = profile.id;
        }
        setAppState({
            friendQuery: friendQuery,
            friends: [], friendsTotal: 0, loading: true
        });
    };
    const handleChange = (event: any) => {
        event.persist();
        setPostSearch((prevSearch: any) => ({
        ...prevSearch,
        [event.target.name]: event.target.value
        }));
    };

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        loadFriends();
        };
    return (
        <div>
        <form onSubmit={handleFormSubmit}>
            <div className="p-grid p-fluid">
                <div className="p-col-12 p-md-6">
                <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-search"></i>
                    </span>
                    <InputText placeholder="Search"
                        name="skilletSearchTerm"
                        value={postSearch.skilletSearchTerm}
                        onChange={handleChange} />
                </div>
                </div>
                </div>
            <div>
            <Button icon="pi pi-check" type="submit" label="Send"/>
            </div>
        </form>
        <FriendScroller appState={appState} setAppState={setAppState} loadFriends={loadFriends}/>
        </div>
    );
};

export default SearchForm;
