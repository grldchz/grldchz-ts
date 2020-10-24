import qs from 'qs';
import { useState } from 'react';
import { Service } from '../types/Service';
import { Media, MediaScrollerState, PostCaption } from '../types/Media';

const useMediaService = () => {
  const [service, setResult] = useState<Service<Media[]>>({
    status: 'loading'
  });
  const loadMedia = (scrollerState: MediaScrollerState) => {
    var queryString = 'limit='+scrollerState.query.limit+'&sort=[{"property":"id","direction":"desc"}]';
    if(scrollerState.query.start){
        queryString += '&start='+scrollerState.query.start;
    }
    else{
        queryString += '&start=0';
    }
    if(scrollerState.query.searchTerm){
        queryString += '&searchTerm='+scrollerState.query.searchTerm;
    }
    if(scrollerState.query.fromDate){
        queryString += '&fromDate='+scrollerState.query.fromDate;
    }
    if(scrollerState.query.toDate){
        queryString += '&toDate='+scrollerState.query.toDate;
    }
    if(scrollerState.query.content_id){
      queryString += '&content_id='+scrollerState.query.content_id;
      if(scrollerState.query.media_id){
        queryString += "&media_id=" + scrollerState.query.media_id;
      }
    }
    return new Promise((resolve, reject) => {
      fetch(process.env.REACT_APP_GRLDSERVICE_URL+'service.php?get=media&'+queryString, {
        method: "GET", // POST, PUT, DELETE, etc.
        headers: {
          // the content type header value is usually auto-set
          // depending on the request body
          "Content-Type": "text/plain;charset=UTF-8"
        },
        body: undefined, // string, FormData, Blob, BufferSource, or URLSearchParams
        referrer: "about:client", // or "" to send no Referer header,
        // or an url from the current origin
        referrerPolicy: "no-referrer-when-downgrade", // no-referrer, origin, same-origin...
        mode: "cors", // same-origin, no-cors
        credentials: "include", //"same-origin", // omit, include
        cache: "default", // no-store, reload, no-cache, force-cache, or only-if-cached
        redirect: "follow", // manual, error
        integrity: "", // a hash, like "sha256-abcdef1234567890"
        keepalive: false, // true
        signal: undefined, // AbortController to abort request
        window: window // null
      })
        .then(response => response.json())
        .then(response => {
          if(response.status === 'FAIL'){
            const error = new Error(response.msg);
            setResult({ status: 'error', error });
          }
          else{
            console.log("useMediaScroller results", response.results);
            setResult({ status: 'loaded', payload: response.results });
          }
          resolve(response);
        })
        .catch(error => {
          setResult({ status: 'error', error });
          reject(error);
        });
    });
  };
  const deleteMedia = (mediaItem: Media) => {
    //setResult({ status: 'loading' });

    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
    headers.append('Accept', 'application/json; charset=utf-8');
    return new Promise((resolve, reject) => {
      fetch(process.env.REACT_APP_GRLDSERVICE_URL+'service.php', {
        method: 'POST',
        body: qs.stringify({deletefile:mediaItem.file, id:mediaItem.content_id}),
        credentials: "include",
        headers
        })
        .then(response => {
          return response.json();
        })
        .then(response => {
          if(response.status === 'FAIL'){
            const error = new Error(response.msg);
            setResult({ status: 'error', error });
          }
          else{
            setResult({ status: 'loaded', payload: response });
          }
          resolve(response);
        })
        .catch(error => {
          setResult({ status: 'error', error });
          reject(error);
        });
    });
  };
  const submitCaption = (mediaItem: PostCaption) => {
    // setResult({ status: 'loading' });

    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
    headers.append('Accept', 'application/json; charset=utf-8');
    return new Promise((resolve, reject) => {
      fetch(process.env.REACT_APP_GRLDSERVICE_URL+'service.php', {
        method: 'POST',
        body: qs.stringify({media_id:mediaItem.media_id, caption:mediaItem.caption}),
        credentials: "include",
        headers
        })
        .then(response => {
          return response.json();
        })
        .then(response => {
          if(response.status === 'FAIL'){
            const error = new Error(response.msg);
            setResult({ status: 'error', error });
          }
          else{
            setResult({ status: 'loaded', payload: response });
          }
          resolve(response);
        })
        .catch(error => {
          setResult({ status: 'error', error });
          reject(error);
        });
    });
  };
  const setImage = (postData: any) => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
    headers.append('Accept', 'application/json; charset=utf-8');
    return new Promise((resolve, reject) => {
      fetch(process.env.REACT_APP_GRLDSERVICE_URL+'service.php', {
        method: 'POST',
        body: qs.stringify(postData),
        credentials: "include",
        headers
        })
        .then(response => {
          return response.json();
        })
        .then(response => {
          if(response.status === 'FAIL'){
            const error = new Error(response.msg);
            setResult({ status: 'error', error });
          }
          else{
            setResult({ status: 'loaded', payload: response });
          }
          resolve(response);
        })
        .catch(error => {
          setResult({ status: 'error', error });
          reject(error);
        });
    });
  };
  return {service, loadMedia, deleteMedia, submitCaption, setImage};
};

export default useMediaService;
