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
import { useEffect, useState } from 'react';
import { Service } from '../types/Service';
import { Comment, CommentQuery } from '../types/Comment';
import { AppState } from '../types/AppState';
import AppUtils from '../AppUtils';

/**
 * Fetch and add the response to the return
 * @param query 
 * @param postAccumulator 
 */
const useCommentScroller = (appState: AppState) => {
  const [result, setResult] = useState<Service<Comment[]>>({
    status: 'loading'
  });
  const { getParameterByName, getQueryParamByName } = AppUtils();

  useEffect(() => {
    const query: CommentQuery = appState.commentQuery;
    let queryString = 'limit='+query.limit+'&sort=[{"property":"id","direction":"desc"}]';
    //let queryString = 'limit='+query.limit+'&sort=[{"property":"modify_date_time","direction":"desc"}]';
	let start = 0;
    if(getParameterByName("start")){
      start += parseInt(getParameterByName("start"));
    }
    if(query.start){
      start += query.start;
    }
	queryString += '&start='+start;
    if(query.content_id){
      queryString += '&content_id='+query.content_id;
    }
    else if(getParameterByName("contentid")){
      queryString += '&content_id='+getParameterByName("contentid");
    }
    if(getQueryParamByName("searchTerm")){
      queryString += '&searchTerm='+getQueryParamByName("searchTerm");
    }
    if(getQueryParamByName("fromDate")){
      queryString += '&fromDate='+getQueryParamByName("fromDate");
    }
    if(getQueryParamByName("toDate")){
      queryString += '&toDate='+getQueryParamByName("toDate");
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
    setResult({status: 'loading'});
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
      signal: undefined // AbortController to abort request
    })
      .then(response => response.json())
      .then(response => {
        if(response.status){
          const error = new Error(response.msg);
          setResult({ status: 'error', error });
        }
        else{
            if(query.content_id){
			  if(query.deleteComment){
				  // remove comment from appState.comments
				  appState.comments = appState.comments.filter(obj => obj.id != parseInt(query.content_id || "0"));
				  query.deleteComment = null;
			  }
			  else{
                //Replace the one in the appState.comments with the one in response.results
                appState.comments = appState.comments.map(obj => response.results.find((o: Comment) => o.id === obj.id) || obj);
			  }
			  appState.commentQuery.content_id = null;
            }
            else{
				/*
				const uniqIds:any[] = [];
				appState.comments = comments.filter((comment: Comment) => {
					const isDupe = uniqIds.find(o => o == comment.id);
					if(!isDupe){
						uniqIds.push(comment.id);
						return true;
					}
					return false;
				});
				*/
				appState.comments = appState.comments.concat(response.results);
                appState.commentsTotal = response.total;
            }
            appState.loading = false;
			//const comments = appState.comments.map(comment => {return {...comment}});
            setResult({ status: 'loaded', payload: appState.comments });
			window.scrollTo(0, appState.scrollPosition);
        }
      })
      .catch(error => setResult({ status: 'error', error }));
  }, [appState]);

  return result;
};

export default useCommentScroller;
