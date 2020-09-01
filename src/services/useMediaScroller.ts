import { useEffect, useState } from 'react';
import { Service } from '../types/Service';
import { Media, MediaScrollerState } from '../types/Media';
/**
 * Fetch and add the response to the return
 */
const useMediaScroller = (scrollerState: MediaScrollerState) => {
  const [result, setResult] = useState<Service<Media[]>>({
    status: 'loading'
  });
  const getParameterByName = (name: string) => {
    name = name.replace(/[[]/, "[").replace(/[\]]/, "]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(window.location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  };
  
  useEffect(() => {
    var queryString = 'get=media&limit='+scrollerState.query.limit+'&sort=[{"property":"id","direction":"desc"}]';
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
        queryString += "&" + "media_id=" + scrollerState.query.media_id;
      }
    }
    else if(getParameterByName("content_id")){
      queryString += '&content_id='+getParameterByName("content_id");
      if(getParameterByName("media_id")){
        queryString += "&" + "media_id=" + getParameterByName("media_id");
      }
    }
      //setResult({status: 'loading'});
    fetch(process.env.REACT_APP_GRLDSERVICE_URL+'service.php?'+queryString, {
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
          //console.log("useMediaScroller response", response);
          scrollerState.results = scrollerState.results.concat(response.results);
            scrollerState.total = response.total;
            scrollerState.loading = false;
            //console.log("useMediaScroller results", scrollerState.results);
            setResult({ status: 'loaded', payload: scrollerState.results });
        }
      })
      .catch(error => setResult({ status: 'error', error }));
  }, [scrollerState]);

  return result;
};

export default useMediaScroller;
