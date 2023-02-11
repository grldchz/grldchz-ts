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
  dialog: any;
}

const FriendScroller: React.FC<Props> = ({ appState, setAppState, loadFriends, dialog }) => {
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
          skilletSearchTerm: appState.friendQuery.skilletSearchTerm,
          skilletUserId: appState.friendQuery.skilletUserId
        },
        friends: [], 
        friendsTotal: appState.friendsTotal,
        loading: true, dialog: dialog
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
          loading: true, dialog: dialog
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
          <div style={{color:'red'}}>{service.error.message}</div>
        )}
        {service.status == 'loaded' && service.payload && service.payload.length > 0 &&
            <div>
              <DataScroller value={service.payload} className="centerDiv"
                  itemTemplate={itemTemplate} rows={service.payload.length}/>
                {appState.friendsTotal > service.payload.length && (
				    <Button icon="pi pi-angle-double-down" ref={moreButtonRef} type="button" label="more" style={{margin: '3px'}}
					  title="Load more friends" onClick={() => onScroll({rows:10})}/>
              )}
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
