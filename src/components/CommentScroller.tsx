/**
	This is a part of the grilledcheeseoftheday.com

	Copyright (C) 2022 grilledcheeseoftheday.com

    GRLDCHZ is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    GRLDCHZ is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see http://www.gnu.org/licenses/.
**/
import React, { useRef } from 'react';
import useCommentScroller from '../services/useCommentScroller';
import {ProgressBar} from 'primereact/progressbar';
import { DataScroller } from "primereact/datascroller";
import ListItem from './ListItem';
import { Button } from 'primereact/button';
import { AppState } from '../types/AppState';
import { Comment } from "../types/Comment";
import { Profile } from '../types/Profile';
import AppUtils from '../AppUtils';
export interface Props{
  appState: AppState;
  setAppState(appState: AppState): void;
  profile: Profile;
  loadComments(): void;
}

const CommentScroller: React.FC<Props> = ({ appState, setAppState, profile, loadComments }) => {
  const { getParameterByName, getContextRoot } = AppUtils();
  const service = useCommentScroller(appState);
  const itemTemplate = (comment: Comment) => {
    if (!comment) {
      return (<div></div>);
    }
    return (<ListItem appState={appState} comment={comment} key={comment.id} profile={profile} loadComments={loadComments} />);
  };
  const onScroll = (evnt?: any) => {
    let start = appState.commentQuery.start;
    if(getParameterByName("start")){
      start += parseInt(getParameterByName("start"));
    }
    if(appState.commentQuery.limit >= appState.commentsTotal){
      start = 0;
      setAppState({
        commentQuery: {
          start: start,
          limit: appState.commentQuery.limit,
          searchTerm: appState.commentQuery.searchTerm,
          fromDate: appState.commentQuery.fromDate,
          toDate: appState.commentQuery.toDate
        },
        comments: [], 
        commentsTotal: appState.commentsTotal,
        loading: true
      });
    }
    else{
      start = appState.commentQuery.start + evnt.rows;
      if(start < appState.commentsTotal){
        setAppState({
          commentQuery: {
            start: start,
            limit: evnt.rows,
            searchTerm: appState.commentQuery.searchTerm,
            fromDate: appState.commentQuery.fromDate,
            toDate: appState.commentQuery.toDate
          },
          comments: appState.comments, 
          commentsTotal: appState.commentsTotal,
          loading: true
        });
      }
    }
  };
  const backButtonRef = useRef(null);
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
				{getParameterByName("start")!="" && (
					<div><Button icon="pi pi-angle-double-left" ref={backButtonRef} type="button" label="back" style={{margin: '3px'}}
					 onClick={() => window.location.href=getContextRoot()} title="Load most recent posts"/>
					 You are currently viewing page {(parseInt(getParameterByName("start"))/10)+1} of older posts.</div>
				)}
              <DataScroller value={service.payload} className="centerDiv"
                  itemTemplate={itemTemplate} rows={10}
                  lazy={true} onLazyLoad={onScroll} loader={moreButtonRef.current}/>
				{getParameterByName("contentid")=="" && (appState.commentsTotal > (appState.commentQuery.start+10)) && (
					<Button icon="pi pi-angle-double-down" ref={moreButtonRef} type="button" label="more" style={{margin: '3px'}}
					 title="Load older posts"/>
				)}
            </div>
        }
        {service.status == 'loaded' && service.payload && service.payload.length == 0 &&
            <div>
              No results found.
            </div>
        }
      </div>
    </>
  );
};

export default CommentScroller;
