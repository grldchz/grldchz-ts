import React, { useState } from 'react';
import useSubmitProfileService from '../services/useSubmitProfileService';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Profile, PostProfile, PostChangePassword } from '../types/Profile';
export interface Props{
  profile: Profile;
  onSubmit(profile: any): void;
}
const ProfileForm: React.FC<Props> = ({ profile, onSubmit }) => {
  const initialPostProfileState: PostProfile = {
    firstname: profile.first_name,
    lastname: profile.last_name,
    email: profile.email,
    userdesc: profile.description 
  };
  const [postProfile, setPostProfile] = React.useState<PostProfile>(
    initialPostProfileState
  );
  const { service, submitProfile, changePassword } = useSubmitProfileService();
  const handleChange = (event: any) => {
    event.persist();
    setPostProfile(prevProfile => ({
      ...prevProfile,
      [event.target.name]: event.target.value
    }));
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitProfile(postProfile).then(() => {
      onSubmit((profile: any) => ({
        ...profile,
        "first_name": postProfile.firstname,
        "last_name": postProfile.lastname,
        "description": postProfile.userdesc,
        "email": postProfile.email
        }));
      });
  };
  const [ changePasswordFormVisible, showChangePasswordForm ] = useState(false);
  const rootEl = document.getElementById('root');
  const [postChangePassword, setChangePassword] = React.useState<PostChangePassword>({
    changepass: 'ChangePass',
    oldpassword: "",
    newpassword: "",
    newpassword2: ""
  });
  const handleChangePassword = (event: any) => {
    event.persist();
    setChangePassword((prevSearch: any) => ({
      ...prevSearch,
      [event.target.name]: event.target.value
    }));
  };
  const handleChangePasswordFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    showChangePasswordForm(false);
    changePassword(postChangePassword);
  };
  return (
    <div>
      <form onSubmit={handleFormSubmit}>
          <div className="p-grid p-fluid">
            <div className="p-col-12 p-md-4">
              <label>First Name</label>
            </div>
            <div className="p-col-12 p-md-8">
              <InputText
                type="text"
                name="firstname"
                value={postProfile.firstname}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="p-grid p-fluid">
            <div className="p-col-12 p-md-4">
              <label>Last Name</label>
            </div>
            <div className="p-col-12 p-md-8">
              <InputText
                type="text"
                name="lastname"
                value={postProfile.lastname}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="p-grid p-fluid">
            <div className="p-col-12 p-md-4">
              <label>Email</label>
            </div>
            <div className="p-col-12 p-md-8">
              <InputText
                type="text"
                name="email"
                value={postProfile.email}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="p-grid p-fluid">
            <div className="p-col-12 p-md-12">
              <label>Description</label>
            </div>
          </div>
          <div className="p-grid p-fluid">
            <div className="p-col-12 p-md-12">
              <InputTextarea rows={5} cols={30} 
                name="userdesc"
                value={postProfile.userdesc} onChange={handleChange} />
            </div>
          </div>
          <Button icon="pi pi-check" type="submit" label="Send" style={{margin: '3px'}}/>
          <Button icon="pi pi-lock" type="button" label="Change Password" onClick={() => showChangePasswordForm(true)} style={{margin: '3px'}} />
      </form>
      {rootEl && (
        <Dialog key={'CHANGEPASSWORD'+profile.id} visible={changePasswordFormVisible} appendTo={rootEl} 
          onHide={() => showChangePasswordForm(false)} blockScroll>
      <form onSubmit={handleChangePasswordFormSubmit}>
          <div className="p-grid p-fluid">
            <div className="p-col-12">
              <Password placeholder="Old Password"
                name="oldpassword" feedback={false}
                value={postChangePassword.oldpassword}
                onChange={handleChangePassword} />
            </div>
            </div>
            <div className="p-grid p-fluid">
            <div className="p-col-12">
            <Password placeholder="New Password"
                name="newpassword" feedback={true}
                value={postChangePassword.newpassword}
                onChange={handleChangePassword} />
            </div>
            </div>
            <div className="p-grid p-fluid">
            <div className="p-col-12">
            <Password placeholder="Confirm Password"
                name="newpassword2" feedback={false}
                value={postChangePassword.newpassword2}
                onChange={handleChangePassword} />
            </div>
            </div>
          <div>
          <Button icon="pi pi-check" type="submit" label="Send" style={{margin: '3px'}}/>
        </div>
      </form>
        </Dialog>
      )}
      {service.status == 'loading' && (
          <ProgressSpinner />
      )}
      {service.status == 'loaded' && (
        <div>Response: {service.payload}</div>
      )}
      {service.status == 'error' && (
        <div>
          {service.error.message}
        </div>
      )}
    </div>
  );
};

export default ProfileForm;
