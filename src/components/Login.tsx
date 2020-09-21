import React from 'react';
import useLoginService, {
  PostLogin
} from '../services/useLoginService';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';

export interface Props {
  setProfile(profile: any): void;
}

const Login: React.FC<Props> = ({ setProfile }) => {
  const initialLoginState: PostLogin = {
    login: 'Login',
    username: '',
    password: ''
  };
  const [login, setLogin] = React.useState<PostLogin>(
    initialLoginState
  );
  const { service, submitLogin } = useLoginService();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    setLogin(prevLogin => ({
      ...prevLogin,
      [event.target.name]: event.target.value
    }));
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitLogin(login).then((response) => {
      setProfile(response);
    });
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <div className="content-section implementation">
          <h3 className="first">Please Login</h3>
          <div className="p-grid p-fluid">
            <div className="p-col-12 p-md-6">
              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-user"></i>
                </span>
                <InputText placeholder="Username"
                  name="username"
                  value={login.username}
                  onChange={handleChange} />
              </div>
            </div>
            <div className="p-col-12 p-md-6">
              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-lock"></i>
                </span>
                <Password placeholder="Password"
                  name="password" feedback={false}
                  value={login.password}
                  onChange={handleChange} />
              </div>
            </div>
          </div>
          <Button type="submit" label="Send" icon="pi pi-check" />
        </div>
      </form>

      {service.status === 'loading' && (
        <ProgressSpinner />
      )}
      {service.status === 'loaded' && (
        <div>Logged In</div>
      )}
      {service.status === 'error' && (
        <div>
         Login Component: {service.error.message}
        </div>
      )}
    </div>
  );
};

export default Login;
