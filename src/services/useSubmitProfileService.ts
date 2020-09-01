import qs from 'qs';
import { useState } from 'react';
import { Service } from '../types/Service';
import { PostProfile, Profile } from '../types/Profile';

const useSubmitProfileService = () => {
  const [service, setService] = useState<Service<Profile>>({
    status: 'init'
  }); 
  const submitProfile = (profile: PostProfile) => {
    setService({ status: 'loading' });

    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
    headers.append('Accept', 'application/json; charset=utf-8');
    return new Promise((resolve, reject) => {
      fetch(process.env.REACT_APP_GRLDSERVICE_URL+'service.php', {
        method: 'POST',
        body: qs.stringify(profile),
        credentials: "include",
        headers
        })
        .then(response => {
          return response.json();
        })
        .then(response => {
          if(response.status === 'FAIL'){
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

  return {service, submitProfile};

};

export default useSubmitProfileService;
