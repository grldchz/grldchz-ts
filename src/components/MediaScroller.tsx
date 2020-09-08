import React from 'react';
import { DataScroller } from 'primereact/datascroller';
import useMediaScroller from '../services/useMediaScroller';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Media } from '../types/Media';
import { Comment } from '../types/Comment';
import MediaContainer from './MediaContainer';
import { Profile } from '../types/Profile';

export interface Props{
    profile: Profile;
    comment: Comment;
  }
const MediaScroller: React.FC<Props> = ({ profile, comment }) => {
  const defaultState = {
    query: { start: 0, limit: 5, content_id: comment.id },
    results: [], total: 0, loading: true
  };
  const [ scrollerState, setScrollerState ] = React.useState(defaultState);
  const service = useMediaScroller(scrollerState);
  const loadMedia = () => {
    setScrollerState(defaultState);
  };
  const itemTemplate = (media: Media) => {
    if (!media) {
      return (<div></div>);
    }
    return (
        <MediaContainer media={media} profile={profile} loadMedia={loadMedia} />
    );
  };
  
  const onScroll = (evnt?: any) => {
    let start = scrollerState.query.start + evnt.rows;
    setScrollerState({
      query: { 
        start: start, 
        limit: scrollerState.total-evnt.rows, 
        content_id: comment.id 
      },
      results: scrollerState.results, 
      total: scrollerState.total, 
      loading: true
    });
  };
  
  return (
    <>
      <div>
        {(scrollerState.loading || service.status === 'loading') && (
            <ProgressSpinner />
        )}
        {service.status === 'error' && (
          <div>{service.error.message}</div>
        )}
        {service.status === 'loaded' && scrollerState.results.length>0 &&
          <div>
            <DataScroller value={service.payload} itemTemplate={itemTemplate} rows={5}
              lazy={true} onLazyLoad={onScroll}/>
          </div>
        }
      </div>
    </>
  );
};

export default MediaScroller;
