/**
This is a part of the GRLDCHZ Social network

Copyright (C) 2008 grilledcheeseoftheday.com
**/
import React from 'react';
import { Service } from '../types/Service';
import { Profile } from '../types/Profile';

const useProfileService = (setProfile: any) => {
  const [service, setService] = React.useState<Service<Profile>>({
    status: 'loading'
  }); 
  React.useEffect(() => {
    fetch(process.env.REACT_APP_GRLDSERVICE_URL+'service.php?get=profile', {
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
        if (response.status == 'FAIL') {
          const error = new Error(response.msg);
          setService({ status: 'error', error });
        }
        else if (response.status == 'TERMS') {
          const error = new Error(response.msg);
          setService({ status: 'terms', error });
        }
        else {
          setProfile(response);
          setService({ status: 'loaded', payload: response });
        }
      })
      .catch(error => setService({ status: 'error', error }));
  }, [setProfile]);

  return service;

};

export default useProfileService;
