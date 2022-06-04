/**
	This is a part of the grilledcheeseoftheday.com

	Copyright (C) 2022 grilledcheeseoftheday.com

    GRLDCHZ is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    GRLDCHZ is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see http://www.gnu.org/licenses/.
**/
import qs from 'qs';
import { useState } from 'react';
import { Service } from '../types/Service';

const useTermsService = () => {
  const [service, setService] = useState<Service<any>>({
    status: 'init'
  }); 
  const acceptTerms = () => {
    setService({ status: 'loading' });

    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
    headers.append('Accept', 'application/json; charset=utf-8');
    return new Promise((resolve, reject) => {
      fetch(process.env.REACT_APP_GRLDSERVICE_URL+'auth/service.php', {
        method: 'POST',
        body: qs.stringify({ accept: "Terms", terms_accepted : 0}),
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
  const acceptCookies = () => {
    setService({ status: 'loading' });

    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
    headers.append('Accept', 'application/json; charset=utf-8');
    return new Promise((resolve, reject) => {
      fetch(process.env.REACT_APP_GRLDSERVICE_URL+'auth/service.php', {
        method: 'POST',
        body: qs.stringify({ acceptCookies: "Cookies", cookies_accepted : 0}),
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

  return {service, acceptTerms, acceptCookies};

};

export default useTermsService;
