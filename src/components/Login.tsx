import React from 'react';
import useLoginService, {
  PostLogin
} from '../services/useLoginService';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import RegisterForm from './RegisterForm';
import ForgotForm from './ForgotForm';
import Terms from './Terms';
import { Profile } from '../types/Profile';

export interface Props {
  setProfile(profile: any): void;
}

const Login: React.FC<Props> = ({ setProfile }) => {
  const [ registerFormVisible, showRegisterForm ] = React.useState(false);
  const [ forgotFormVisible, showForgotForm ] = React.useState(false);
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
    submitLogin(login).then((response: any) => {
      if(response != null && response.terms_accepted === 1){
        service.status = 'terms';
      }
      else if(response.status){
        service.status = response.status;
      }
      else{
        setProfile(response);
      }
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
          <Button type="button" label="Register" icon="pi pi-user-plus" onClick={() => showRegisterForm(true)} style={{margin: '3px'}} />
          <Button type="button" label="Forgot" icon="pi pi-question" onClick={() => showForgotForm(true)} style={{margin: '3px'}} />
        </div>
      </form>
      <Dialog key="Register" visible={registerFormVisible} onHide={() => showRegisterForm(false)}>
        <RegisterForm />
      </Dialog>
      <Dialog key="Forgot" visible={forgotFormVisible} onHide={() => showForgotForm(false)}>
        <ForgotForm />
      </Dialog>

      {service.status === 'loading' && (
        <ProgressSpinner />
      )}
      {service.status === 'error' && (
        <div>
         {service.error.message}
        </div>
      )}
      {service.status === 'loaded' && (
        <Terms setProfile={(profile: Profile) => setProfile(profile)} />
      )}
    </div>
  );
};

export default Login;
