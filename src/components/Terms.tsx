import React from 'react';
import useTermsService from '../services/useTermsService';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';

export interface Props {
  setProfile(profile: any): void;
}

const Terms: React.FC<Props> = ({ setProfile }) => {
  const { service, acceptTerms } = useTermsService();

  const handleOnClick = () => {
    acceptTerms().then((response) => {
      setProfile(response);
    });
  };

  return (
    <div><h1>Terms and Conditions</h1>
<h2><blockquote>By registering for, accessing, and using Grilled Cheese of the Day you agree to the following terms:</blockquote></h2>
<h3>
<ul>
<li>
You have provided your real first name, real last name, and real email address.
</li>
<li>
You shall upload only content (photos and videos) that were produced by you.
</li>
<li>  
You shall not upload copyrighted material that was copyrighted by someone other than you.
</li>
<li>
You shall not upload content (photos or videos) that: is hateful, threatening, or 
pornographic; incites violence; or contains nudity or graphic or gratuitous violence.
</li>
<li>
You will not upload viruses or other malicious code.
</li>
<li>
You will not post unauthorized commercial communications (such as spam) on 
Grilled Cheese of the Day.
</li>
<li>
You will not collect users' content or information, or otherwise access 
Grilled Cheese of the Day, using automated means (such as harvesting bots, robots, 
spiders, or scrapers) without permission.
</li>
<li>
You will not engage in unlawful multi-level marketing, such as a pyramid scheme, on 
Grilled Cheese of the Day.
</li>
<li>
You will not solicit login information or access an account belonging to someone else.
</li>
<li>
You will not bully, intimidate, or harass any user.
</li>
<li>
You will not publicize or offer any contest, giveaway, or sweepstakes (“promotion”) on 
Grilled Cheese of the Day.
</li>
<li>
You will not use Grilled Cheese of the Day to do anything unlawful, misleading, malicious, 
or discriminatory.
</li>
<li>
You will not do anything that could disable, overburden, or impair the proper working of 
Grilled Cheese of the Day, such as a denial of service attack.
</li>
<li>
You will not facilitate or encourage any violations of these terms.
</li><li>
You will not provide any false personal information on Grilled Cheese of the Day, or create an 
account for anyone other than yourself without permission.
</li><li>
You will not create more than one personal profile.
</li><li>
If we disable your account, you will not create another one without permission.
</li><li>
You will not use your personal profile for your own commercial gain (such as selling your 
status update to an advertiser).
</li><li>
You will not use Grilled Cheese of the Day if you are under 13.
</li><li>
You will not use Grilled Cheese of the Day if you are a convicted sex offender.
</li><li>
You will keep your contact information accurate and up-to-date.
</li><li>
You will not share your password, let anyone else access your account, or do anything 
else that might jeopardize the security of your account.
</li><li>
You will not post content or take any action on Grilled Cheese of the Day that infringes 
or violates someone else's rights or otherwise violates the law.
</li><li>
We can remove any content or information you post on Grilled Cheese of the Day if we believe 
that it violates this Statement.
</li><li>
If we remove your content for infringing someone else's copyright, and you believe we removed 
it by mistake, we will provide you with an opportunity to appeal.
</li><li>
If you repeatedly infringe other people's intellectual property rights, we will disable your 
account when appropriate.
</li><li>
If you collect information from users, you will: obtain their consent, make it clear you (and 
not Grilled Cheese of the Day) are the one collecting their information, and post a privacy 
policy explaining what information you collect and how you will use it.
</li><li>
You will not post anyone's identification documents or sensitive financial information on 
Grilled Cheese of the Day.
</li>
</ul>
</h3>
<h1>Privacy Notice</h1>
<h2><blockquote>By registering for, accessing, and using Grilled Cheese of the Day you agree that you have read the following notice:</blockquote></h2>
<h3><blockquote>Grilled Cheese of the Day collects your first name, last name, email directly from you when you voluntarily provide it to us.  Additionally, Grilled Cheese of the Day collects information such as your IP address, the date you register, and whether or not you've accepted these terms.  Grilled Cheese of the Day does not share any information about you to anyone, ever.  Your account information and all content (posts containing text, photos, and videos) is completely private unless you accept somebody's friend request or somebody else accepts yours thereby allowing them to see your posts and you their's.  There are no third party applications, no advertisements, no news feeds, and definitely no algorithms to predict your activity on Grilled Cheese of the Day.</blockquote></h3>
<h1>Disclaimer</h1>
<h2><blockquote>By registering for, accessing, and using Grilled Cheese of the Day you agree that you have read the following disclaimer:</blockquote></h2>
<h3><blockquote>Grilled Cheese of the Day and its components are offered for informational purposes only; Grilled Cheese of the Day shall not be responsible or liable for the accuracy, usefulness or availability of any information transmitted or made available via the site, and shall not be responsible or liable for any error or omissions in that information.</blockquote></h3>
<h1>Intellectual Property</h1>
<h2><blockquote>By registering for, accessing, and using Grilled Cheese of the Day you agree that you have read the following statement:</blockquote></h2>
<h3><blockquote>Grilled Cheese of the Day and its original content, features, and functionality are owned by REDACTED FOR PRIVACY and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</blockquote></h3>
<h4><blockquote>If you have any questions about this Agreement, please feel free to contact us at admin@grilledcheeseoftheday.com</blockquote></h4>
      <Button type="button" label="Accept" icon="pi pi-check" onClick={handleOnClick} />

      {service.status == 'loading' && (
        <ProgressSpinner />
      )}
      {service.status == 'loaded' && (
        <div>Accepted</div>
      )}
      {service.status == 'error' && (
        <div>
         {service.error.message}
        </div>
      )}
    </div>
  );
};

export default Terms;
