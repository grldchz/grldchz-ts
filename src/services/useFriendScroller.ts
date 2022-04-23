/**
This is a part of the GRLDCHZ Social network

Copyright (C) 2008 grilledcheeseoftheday.com
**/
import qs from 'qs';
import { useEffect, useState } from 'react';
import { Service } from '../types/Service';
import { Friend, FriendQuery } from '../types/Friend';
import { FriendAppState } from '../types/AppState';

/**
 * Fetch and add the response to the return
 * @param query 
 * @param postAccumulator 
 */
const useFriendScroller = (appState: FriendAppState) => {
  const [result, setResult] = useState<Service<Friend[]>>({
    status: 'loading'
  });
  useEffect(() => {
    const query: FriendQuery = appState.friendQuery;
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
    headers.append('Accept', 'application/json; charset=utf-8');
    fetch(process.env.REACT_APP_GRLDSERVICE_URL+'service.php?', {
      method: "POST",
      body: qs.stringify(query),
      credentials: "include",
      headers
    })
      .then(response => response.json())
      .then(response => {
        if(response.status){
          const error = new Error(response.msg);
          setResult({ status: 'error', error });
        }
        else{
            appState.friends = appState.friends.concat(response.results);
            appState.friendsTotal = response.total;
            appState.loading = false;
            setResult({ status: 'loaded', payload: appState.friends });
        }
      })
      .catch(error => setResult({ status: 'error', error }));
  }, [appState]);

  return result;
};

export default useFriendScroller;
