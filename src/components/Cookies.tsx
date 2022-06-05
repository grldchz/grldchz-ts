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
import useTermsService from '../services/useTermsService';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

export interface Props {
  setProfile(profile: any): void;
}

const Cookies: React.FC<Props> = ({ setProfile }) => {
  const { service, acceptCookies } = useTermsService();
  const [ cookieFormVisible, showCookieForm ] = React.useState(true);

  const handleOnClick = () => {
    acceptCookies().then((response) => {
      showCookieForm(false);
    });
  };

  const content = () => (
    <noindex><div><h1>Cookie Policy</h1>
    <h2><blockquote>By using grilledcheeseoftheday.com you agree to the following cookie policy:</blockquote></h2>
    <h3><blockquote>
    You agree grilledcheeseoftheday.com can store a cookie on your device.  This first party cookie is strictly necessary for grilledcheeseoftheday.com to function properly.  There are no third party tracking cookies on grilledcheeseoftheday.com.
    </blockquote></h3>
    <h1>Disclaimer</h1>
    <h2><blockquote>By using grilledcheeseoftheday.com you agree that you have read the following disclaimer:</blockquote></h2>
    <h3><blockquote>grilledcheeseoftheday.com and its components are offered for informational purposes only; grilledcheeseoftheday.com shall not be responsible or liable for the accuracy, usefulness or availability of any information transmitted or made available via grilledcheeseoftheday.com, and shall not be responsible or liable for any error or omissions in that information.</blockquote></h3>
    <h1>Intellectual Property</h1>
    <h2><blockquote>By using grilledcheeseoftheday.com you agree that you have read the following statement:</blockquote></h2>
    <h3><blockquote>grilledcheeseoftheday.com and its original content, features, and functionality are owned by REDACTED FOR PRIVACY and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</blockquote></h3>
    <h4>If you have any questions about this Agreement, please send them to admin@grilledcheeseoftheday.com</h4> 
    </div></noindex>
  );
  const footer = () => (
    <div>
      <Button type="button" label="Accept" icon="pi pi-check" onClick={handleOnClick} />
      {service.status == 'loading' && (
        <ProgressSpinner />
      )}
      {service.status == 'error' && (
        <div>
        {service.error.message}
        </div>
      )}
    </div>
  ); 
  return (
    <div>
      <Dialog key={'COOKIEFORM'} visible={cookieFormVisible} modal={false} 
          onHide={() => showCookieForm(false)} blockScroll footer={footer()}>
          {content()}
      </Dialog>    
    </div>
  );
};

export default Cookies;
