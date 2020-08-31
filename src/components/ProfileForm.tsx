import React from 'react';
import useSubmitProfileService from '../services/useSubmitProfileService';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Profile, PostProfile } from '../types/Profile';
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
  const { service, submitProfile } = useSubmitProfileService();
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
  return (
    <div>
      <form onSubmit={handleFormSubmit}>
          <div className="p-grid p-fluid">
            <div className="p-col-12 p-md-6">
          <label>First Name</label>
          </div>
            <div className="p-col-12 p-md-6">
          <InputText
            type="text"
            name="firstname"
            value={postProfile.firstname}
            onChange={handleChange}
          />
          </div>
            <div className="p-col-12 p-md-6">
          <label>Last Name</label>
          </div>
            <div className="p-col-12 p-md-6">
          <InputText
            type="text"
            name="lastname"
            value={postProfile.lastname}
            onChange={handleChange}
          />
          </div>
            <div className="p-col-12 p-md-6">
          <label>Email</label>
          </div>
            <div className="p-col-12 p-md-6">
          <InputText
            type="text"
            name="email"
            value={postProfile.email}
            onChange={handleChange}
          />
          </div>
            <div className="p-col-12 p-md-6">
          <label>Description</label>
          </div>
            <div className="p-col-12 p-md-6">
          <InputTextarea rows={5} cols={30} 
            name="userdesc"
            value={postProfile.userdesc} onChange={handleChange} 
            autoResize={true} />
        </div>
        <div>
          <Button type="submit" label="Send"/>
        </div>
        </div>
      </form>
  
      {service.status === 'loading' && (
          <ProgressSpinner />
      )}
      {service.status === 'loaded' && (
        <div>Response: {service.payload}</div>
      )}
      {service.status === 'error' && (
        <div>
          {service.error.message}
        </div>
      )}
    </div>
  );
};

export default ProfileForm;
