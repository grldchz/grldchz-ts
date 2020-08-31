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
  setAppState(commentQuery: any): void;
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
    let start = appState.commentQuery.start + evnt.rows;
    if(start < appState.commentsTotal){
      setAppState({
        commentQuery: {
          start: start,
          limit: evnt.rows
        },
        comments: appState.comments, 
        commentsTotal: appState.commentsTotal,
        loading: true
      });
    }
  };
  const moreButtonRef = useRef(null);
  return (
    <>
      <div>
        {(appState.loading || service.status === 'loading') && (
          <div style={{position:'fixed', top: '0px', margin: '0px', width: '100%'}}>
            <ProgressBar mode="indeterminate" style={{backgroundColor: 'black', height: '3px'}} /></div>
        )}
        {service.status === 'error' && (
          <div>CommentScroller Component: {service.error.message}</div>
        )}
        {service.status === 'loaded' && service.payload &&
            <div>
              <DataScroller value={service.payload}
                  itemTemplate={itemTemplate} rows={5}
                  lazy={true} onLazyLoad={onScroll} loader={moreButtonRef.current}/>
              <Button ref={moreButtonRef} type="button" label="more"/>
            </div>
        }
      </div>
    </>
  );
};

export default CommentScroller;
