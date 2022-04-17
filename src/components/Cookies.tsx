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
    <h2><blockquote>By using Grilled Cheese of the Day you agree to the following cookie policy:</blockquote></h2>
    <h3><blockquote>
    You agree Grilled Cheese of the Day can store a cookie on your device.  This first party cookie is strictly necessary for Grilled Cheese of the Day to function properly.  There are no third party tracking cookies on Grilled Cheese of the Day.
    </blockquote></h3>
    <h1>Disclaimer</h1>
    <h2><blockquote>By using Grilled Cheese of the Day you agree that you have read the following disclaimer:</blockquote></h2>
    <h3><blockquote>Grilled Cheese of the Day and its components are offered for informational purposes only; Grilled Cheese of the Day shall not be responsible or liable for the accuracy, usefulness or availability of any information transmitted or made available via Grilled Cheese of the Day, and shall not be responsible or liable for any error or omissions in that information.</blockquote></h3>
    <h1>Intellectual Property</h1>
    <h2><blockquote>By using Grilled Cheese of the Day you agree that you have read the following statement:</blockquote></h2>
    <h3><blockquote>Grilled Cheese of the Day and its original content, features, and functionality are owned by REDACTED FOR PRIVACY and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</blockquote></h3>
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
