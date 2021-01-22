import React, { useRef } from 'react';
import useCommentScroller from '../services/useCommentScroller';
import {ProgressBar} from 'primereact/progressbar';
import { DataScroller } from "primereact/datascroller";
import ListItem from './ListItem';
import { Button } from 'primereact/button';
import { AppState } from '../types/AppState';
import { Comment } from "../types/Comment";
import { Profile } from '../types/Profile';

export interface Props{
  appState: AppState;
  setAppState(appState: AppState): void;
  profile: Profile;
  loadComments(): void;
}

const CommentScroller: React.FC<Props> = ({ appState, setAppState, profile, loadComments }) => {
  const service = useCommentScroller(appState);
  const itemTemplate = (comment: Comment) => {
    if (!comment) {
      return (<div></div>);
    }
    return (<ListItem comment={comment} key={comment.id} profile={profile} loadComments={loadComments} />);
  };
  const onScroll = (evnt?: any) => {
    let start = appState.commentQuery.start;
    if(appState.commentQuery.limit > appState.commentsTotal){
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
  const moreButtonRef = useRef(null);
  return (
    <>
      <div>
        {(appState.loading || service.status === 'loading') && (
          <div className="progressBarContainer">
            <ProgressBar mode="indeterminate" /></div>
        )}
        {service.status === 'error' && (
          <div>Error: {service.error.message}</div>
        )}
        {service.status === 'loaded' && service.payload && service.payload.length > 0 &&
            <div>
              <DataScroller value={service.payload} className="centerDiv"
                  itemTemplate={itemTemplate} rows={10}
                  lazy={true} onLazyLoad={onScroll} loader={moreButtonRef.current}/>
              <Button icon="pi pi-angle-double-down" ref={moreButtonRef} type="button" label="more" style={{margin: '3px'}}/>
            </div>
        }
        {service.status === 'loaded' && service.payload && service.payload.length === 0 &&
            <div>
              No results found.
            </div>
        }
      </div>
    </>
  );
};

export default CommentScroller;
