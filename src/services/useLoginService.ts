import qs from 'qs';
import { useState } from 'react';
import { Service } from '../types/Service';
import { Form } from '../types/Login';
export type PostLogin = Pick<
  Form,
  'login' | 'username' | 'password'
>;

const useLoginService = () => {
  const [service, setService] = useState<Service<PostLogin>>({
    status: 'init'
  });

  const submitLogin = (login: PostLogin) => {
    setService({ status: 'loading' });

    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
    headers.append('Accept', 'application/json; charset=utf-8');
    return new Promise((resolve, reject) => {
      fetch('http://localhost/grldservice-dev/auth/service.php', {
        method: 'POST',
        body: qs.stringify(login),
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

  return {
    service,
    submitLogin
  };
};

export default useLoginService;
