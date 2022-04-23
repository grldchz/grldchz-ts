/**
This is a part of the GRLDCHZ Social network

Copyright (C) 2008 grilledcheeseoftheday.com
**/
import React, { useRef } from 'react';
import useFriendScroller from '../services/useFriendScroller';
import {ProgressBar} from 'primereact/progressbar';
import { DataScroller } from "primereact/datascroller";
import { Button } from 'primereact/button';
import { FriendAppState } from '../types/AppState';
import { Friend } from "../types/Friend";
import FriendListItem from '../components/FriendListItem';
export interface Props{
  appState: FriendAppState;
  setAppState(appState: FriendAppState): void;
  loadFriends(): void;
}

const FriendScroller: React.FC<Props> = ({ appState, setAppState, loadFriends }) => {
  const service = useFriendScroller(appState);
  const itemTemplate = (friend: Friend) => {
    if (!friend) {
      return (<div></div>);
    }
    return (<FriendListItem friend={friend} key={friend.id} loadFriends={loadFriends} />);
  };
  const onScroll = (evnt?: any) => {
    let start = appState.friendQuery.start;
    if(appState.friendQuery.limit > appState.friendsTotal){
      start = 0;
      setAppState({
        friendQuery: {
          start: start,
          limit: appState.friendQuery.limit,
          skilletSearchTerm: appState.friendQuery.skilletSearchTerm, skilletUserId: appState.friendQuery.skilletUserId
        },
        friends: [], 
        friendsTotal: appState.friendsTotal,
        loading: true
      });
    }
    else{
      start = appState.friendQuery.start + evnt.rows;
      if(start < appState.friendsTotal){
        setAppState({
          friendQuery: {
            start: start,
            limit: evnt.rows,
            skilletSearchTerm: appState.friendQuery.skilletSearchTerm, skilletUserId: appState.friendQuery.skilletUserId
          },
          friends: appState.friends, 
          friendsTotal: appState.friendsTotal,
          loading: true
        });
      }
    }
  };
  const moreButtonRef = useRef(null);
  return (
    <>
      <div>
        {(appState.loading || service.status == 'loading') && (
          <div className="progressBarContainer">
            <ProgressBar mode="indeterminate" /></div>
        )}
        {service.status == 'error' && (
          <div>Error: {service.error.message}</div>
        )}
        {service.status == 'loaded' && service.payload && service.payload.length > 0 &&
            <div>
              <DataScroller value={service.payload} className="centerDiv"
                  itemTemplate={itemTemplate} rows={10}
                  lazy={true} onLazyLoad={onScroll} loader={moreButtonRef.current}/>
              <Button icon="pi pi-angle-double-down" ref={moreButtonRef} type="button" label="more" style={{margin: '3px'}}/>
            </div>
        }
        {service.status == 'loaded' && service.payload && service.payload.length == 0 &&
            <div>
              Nobody found.
            </div>
        }
      </div>
    </>
  );
};

export default FriendScroller;
