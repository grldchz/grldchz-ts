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
  appStateIn?: AppState;
  profile: Profile;
  loadComments(): void;
}

const CommentScroller: React.FC<Props> = ({ appStateIn, profile, loadComments }) => {
  const [ appState, setAppState ] = React.useState<AppState>({
    commentQuery: { start: 0, limit: 10 },
    comments: [], commentsTotal: 0, loading: false
  });
  const service = useCommentScroller(appStateIn?appStateIn:appState);
  const itemTemplate = (comment: Comment) => {
    if (!comment) {
      return (<div></div>);
    }
    return (<ListItem comment={comment} key={comment.id} profile={profile} loadComments={loadComments} />);
  };
  const onScroll = (evnt?: any) => {
      console.log("appstate", appState);
      console.log("evnt", evnt);
    let start = appState.commentQuery.start;
    if(appState.commentQuery.limit > appState.commentsTotal){
      start = 0;
      setAppState({
        commentQuery: {
          start: start,
          limit: appState.commentQuery.limit
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
            limit: evnt.rows
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
        {((appStateIn && appStateIn.loading) || appState.loading || service.status === 'loading') && (
          <div style={{position:'fixed', top: '0px', margin: '0px', width: '100%'}}>
            <ProgressBar mode="indeterminate" style={{height: '3px'}} /></div>
        )}
        {service.status === 'error' && (
          <div>Error: {service.error.message}</div>
        )}
        {service.status === 'loaded' && service.payload &&
            <div>
              <DataScroller value={service.payload}
                  itemTemplate={itemTemplate} rows={10}
                  lazy={true} onLazyLoad={onScroll} loader={moreButtonRef.current}/>
              <Button ref={moreButtonRef} type="button" label="more"/>
            </div>
        }
      </div>
    </>
  );
};

export default CommentScroller;
