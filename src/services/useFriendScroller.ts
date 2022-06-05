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
