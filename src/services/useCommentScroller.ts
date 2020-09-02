import { useEffect, useState } from 'react';
import { Service } from '../types/Service';
import { Comment, CommentQuery } from '../types/Comment';
import { AppState } from '../types/AppState';

/**
 * Fetch and add the response to the return
 * @param query 
 * @param postAccumulator 
 */
const useCommentScroller = (appState: AppState) => {
  const [result, setResult] = useState<Service<Comment[]>>({
    status: 'loading'
  });
  const getParameterByName = (name: string) => {
    name = name.replace(/[[]/, "[").replace(/[\]]/, "]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(window.location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  };
  
  useEffect(() => {
    const query: CommentQuery = appState.commentQuery;
    let queryString = 'limit='+query.limit+'&sort=[{"property":"id","direction":"desc"}]';
    if(query.start){
      queryString += '&start='+query.start;
    }
    else{
      queryString += '&start=0';
    }
    if(query.content_id){
      queryString += '&content_id='+query.content_id;
    }
    else if(getParameterByName("content_id")){
      queryString += '&content_id='+getParameterByName("content_id");
    }
    if(query.searchTerm){
      queryString += '&searchTerm='+query.searchTerm;
    }
    if(query.fromDate){
      queryString += '&fromDate='+query.fromDate;
    }
    if(query.toDate){
      queryString += '&toDate='+query.toDate;
    }
      //setResult({status: 'loading'});
    fetch(process.env.REACT_APP_GRLDSERVICE_URL+'service.php?get=posts&'+queryString, {
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
            appState.comments = appState.comments.concat(response.results);
            appState.commentsTotal = response.total;
            appState.loading = false;
            setResult({ status: 'loaded', payload: appState.comments });
        }
      })
      .catch(error => setResult({ status: 'error', error }));
  }, [appState]);

  return result;
};

export default useCommentScroller;
