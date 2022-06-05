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
import { useState } from 'react';
import { Service } from '../types/Service';
import { PostComment } from '../types/Comment';

const useCommentService = () => {
  const [service, setService] = useState<Service<PostComment>>({
    status: 'init'
  }); 
  const submitComment = (comment: PostComment) => {
    setService({ status: 'loading' });

    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
    headers.append('Accept', 'application/json; charset=utf-8');
    return new Promise((resolve, reject) => {
      fetch(process.env.REACT_APP_GRLDSERVICE_URL+'service.php', {
        method: 'POST',
        body: qs.stringify(comment),
        credentials: "include",
        headers
        })
        .then(response => {
          return response.json();
        })
        .then(response => {
          if(response.status == 'FAIL'){
            const error = new Error(response.msg);
            setService({ status: 'error', error });
          }
          else if(response.status == 'PERMS'){
            const error = new Error(response.msg);
            setService({ status: 'perms', error });
          }
          else{
            setService({ status: 'loaded', payload: response });
          }
          resolve(response);
        })
        .catch(error => {
          setService({ status: 'error', error });
          reject(error);
        });
    });
  };
  const deleteComment = (deleteid: number) => {
    setService({ status: 'loading' });

    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
    headers.append('Accept', 'application/json; charset=utf-8');
    return new Promise((resolve, reject) => {
      fetch(process.env.REACT_APP_GRLDSERVICE_URL+'service.php', {
        method: 'POST',
        body: qs.stringify({deleteid:deleteid}),
        credentials: "include",
        headers
        })
        .then(response => {
          return response.json();
        })
        .then(response => {
          if(response.status == 'FAIL'){
            const error = new Error(response.msg);
            setService({ status: 'error', error });
          }
          else{
            setService({ status: 'loaded', payload: response });
          }
          resolve(response);
        })
        .catch(error => {
          setService({ status: 'error', error });
          reject(error);
        });
    });
  };
  return {service, submitComment, deleteComment};

};

export default useCommentService;
