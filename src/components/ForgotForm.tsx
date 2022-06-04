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
import React from 'react';
import useForgotService from '../services/ForgotService';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Captcha } from 'primereact/captcha';
export type ForgotForm = {
    forgot: string; 
    username : string; 
    email: string;
    "g-recaptcha-response": string;
    info?: string;
    error?: string;				
}
const ForgotFormComponent: React.FC<{}> = () => {
  const initialState: ForgotForm = {
    forgot: 'Forgot',
    username : "", 
    email: "", 
    "g-recaptcha-response": "",
};
  const [forgotForm, setForgotForm] = React.useState<ForgotForm>(
    initialState
  );
  const { service, submitForgotForm } = useForgotService();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    setForgotForm(prevForgotForm => ({
      ...prevForgotForm,
      [event.target.name]: event.target.value
    }));
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitForgotForm(forgotForm).then((response) => {
      window["grecaptcha"].reset();
    });
  };

  const handleCaptchaResponse = (event: any) => {
    forgotForm["g-recaptcha-response"] = event.response;
  }

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <div className="content-section implementation">
          <h3 className="first">Please provide your</h3>
          <div className="p-grid p-fluid">
            <div className="p-col-12 p-md-5">
              <div className="p-inputgroup">
                <InputText placeholder="User Name"
                  name="username"
                  value={forgotForm.username}
                  onChange={handleChange} />
              </div>
            </div>
            <div className="p-col-12 p-md-1">or</div>
            <div className="p-col-12 p-md-6">
              <div className="p-inputgroup">
                <InputText placeholder="Email"
                  name="email"
                  value={forgotForm.email}
                  onChange={handleChange} />
              </div>
            </div>
          </div>
          <Captcha siteKey={process.env.REACT_APP_CAPTCHA_KEY} onResponse={handleCaptchaResponse}></Captcha>
          <Button type="submit" label="Reset Password" icon="pi pi-check" />
        </div>
      </form>

      {service.status == 'loading' && (
        <ProgressSpinner />
      )}
      {service.status == 'loaded' && (
        <div>{service.payload}</div>
      )}
      {service.status == 'error' && (
        <div>{service.error.message}</div>
      )}
    </div>
  );
};

export default ForgotFormComponent;
