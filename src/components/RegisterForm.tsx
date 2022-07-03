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
import React from 'react';
import useRegisterService from '../services/useRegisterService';
import { RegisterForm } from '../types/Register';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Captcha } from 'primereact/captcha';

const RegisterFormComponent: React.FC<{}> = () => {
  const initialState: RegisterForm = {
    register: 'Register',
    firstname : "", 
    lastname : "", 
    email: "", 
    "g-recaptcha-response": "",
};
  const [registerForm, setRegisterForm] = React.useState<RegisterForm>(
    initialState
  );
  const { service, submitRegisterForm } = useRegisterService();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    setRegisterForm(prevRegisterForm => ({
      ...prevRegisterForm,
      [event.target.name]: event.target.value
    }));
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitRegisterForm(registerForm).then((response) => {
      window["grecaptcha"].reset();
    });
  };

  const handleCaptchaResponse = (event: any) => {
    registerForm["g-recaptcha-response"] = event.response;
  }

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <div className="content-section implementation">
          <h3 className="first">Please Register</h3>
          <div className="p-grid p-fluid">
            <div className="p-col-12 p-md-3">
              <div className="p-inputgroup">
                <InputText placeholder="First Name"
                  name="firstname"
                  value={registerForm.firstname}
                  onChange={handleChange} />
              </div>
            </div>
            <div className="p-col-12 p-md-3">
              <div className="p-inputgroup">
                <InputText placeholder="Last Name"
                  name="lastname"
                  value={registerForm.lastname}
                  onChange={handleChange} />
              </div>
            </div>
            <div className="p-col-12 p-md-6">
              <div className="p-inputgroup">
                <InputText placeholder="Email"
                  name="email"
                  value={registerForm.email}
                  onChange={handleChange} />
              </div>
            </div>
          </div>
          <Captcha siteKey={process.env.REACT_APP_CAPTCHA_KEY} onResponse={handleCaptchaResponse}></Captcha>
          <Button type="submit" label="Send" icon="pi pi-check" />
        </div>
      </form>

      {service.status == 'loading' && (
        <ProgressSpinner />
      )}
      {service.status == 'loaded' && (
        <div style={{color:'green'}}>{service.payload}</div>
      )}
      {service.status == 'error' && (
        <div style={{color:'red'}}>{service.error.message}</div>
      )}
    </div>
  );
};

export default RegisterFormComponent;
