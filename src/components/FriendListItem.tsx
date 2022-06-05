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
import { Friend } from '../types/Friend';
import ProfileImage from './ProfileImage';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import useFriendService from '../services/useFriendService';
import { ProgressSpinner } from 'primereact/progressspinner';
export interface Props{
  friend: Friend;
  loadFriends(): void;
}
const ListItem: React.FC<Props> = ({ friend, loadFriends }) => {
  const rootEl = document.getElementById('root');
  let accepted = false, hidden = true;
  if(friend.outgoing_request != null){
    accepted = friend.outgoing_request[0]==0?true:false;
    hidden = friend.outgoing_request[1]==0?false:true;
  }
  else if(friend.incoming_request != null){
    accepted = friend.incoming_request[0]==0?true:false;
    hidden = friend.incoming_request[1]==0?false:true;
  }
  const [ requestFormVisible, showRequestForm ] = React.useState(false);
  const [ removeFormVisible, showRemoveForm ] = React.useState(false);
  const [ acceptFormVisible, showAcceptForm ] = React.useState(false);
  const [ rejectFormVisible, showRejectForm ] = React.useState(false);
  const [ hideFormVisible, showHideForm ] = React.useState(false);
  const [ unHideFormVisible, showUnHideForm ] = React.useState(false);
  const { friendService, submitFriendRequest } = useFriendService();
  const onFriendRequest = () => {
    showRequestForm(false);
    submitFriendRequest({requestUser:friend.id}).then((response) => {
      loadFriends();
    });
  };
  const onRemove = () => {
    showRemoveForm(false);
    submitFriendRequest({removeUser:friend.id}).then((response) => {
      loadFriends();
    });
  };
  const onAccept = () => {
    showAcceptForm(false);
    submitFriendRequest({acceptUser:friend.id}).then((response) => {
      loadFriends();
    });
  };
  const onReject = () => {
    showRejectForm(false);
    submitFriendRequest({removeUser:friend.id}).then((response) => {
      loadFriends();
    });
  };
  const onHideUnHide = () => {
    showHideForm(false);
    showUnHideForm(false);
    submitFriendRequest({hideUnhideUser:friend.id}).then((response) => {
      loadFriends();
    });
  };
  const renderRequestFooter = () => {
      return (
          <div>
              <Button label="Yes" icon="pi pi-check" onClick={() => onFriendRequest()} />
              <Button label="No" icon="pi pi-times" onClick={() => showRequestForm(false)} className="p-button-secondary"/>
          </div>
      );
  };
  const renderRemoveFooter = () => {
      return (
          <div>
              <Button label="Yes" icon="pi pi-check" onClick={() => onRemove()} />
              <Button label="No" icon="pi pi-times" onClick={() => showRemoveForm(false)} className="p-button-secondary"/>
          </div>
      );
  };
  const renderAcceptFooter = () => {
      return (
          <div>
              <Button label="Yes" icon="pi pi-check" onClick={() => onAccept()} />
              <Button label="No" icon="pi pi-times" onClick={() => showAcceptForm(false)} className="p-button-secondary"/>
          </div>
      );
  };
  const renderRejectFooter = () => {
      return (
          <div>
              <Button label="Yes" icon="pi pi-check" onClick={() => onReject()} />
              <Button label="No" icon="pi pi-times" onClick={() => showRejectForm(false)} className="p-button-secondary"/>
          </div>
      );
  };
  const renderHideFooter = () => {
      return (
          <div>
              <Button label="Yes" icon="pi pi-check" onClick={() => onHideUnHide()} />
              <Button label="No" icon="pi pi-times" onClick={() => showHideForm(false)} className="p-button-secondary"/>
          </div>
      );
  };
  const renderUnHideFooter = () => {
      return (
          <div>
              <Button label="Yes" icon="pi pi-check" onClick={() => onHideUnHide()} />
              <Button label="No" icon="pi pi-times" onClick={() => showUnHideForm(false)} className="p-button-secondary"/>
          </div>
      );
  };
        
  return (
    <div className="commentDisplay">
      <div className="p-grid">
        <div className="p-col-3">
        <ProfileImage profile={friend} /></div>
        <div className="p-col-6">
          <div><b>{friend.first_name}</b></div>
          <div>Member since {friend.user_date_time}</div>
        </div>
        <div className="p-col-3">
          {accepted && !hidden &&
            <div><Button icon="pi pi-eye-slash" style={{margin: '3px'}} onClick={() => showHideForm(true)}/>
            <Button icon="pi pi-user-minus" style={{margin: '3px'}} onClick={() => showRemoveForm(true)}/></div>
          }
          {accepted && hidden &&
            <div><Button icon="pi pi-eye" style={{margin: '3px'}} onClick={() => showUnHideForm(true)}/>
            <Button icon="pi pi-user-minus" style={{margin: '3px'}} onClick={() => showRemoveForm(true)}/></div>
          }
          {friend.outgoing_request && !accepted &&
            <div><Button icon="pi pi-user-minus" style={{margin: '3px'}} onClick={() => showRemoveForm(true)}/></div>
          }
          {friend.incoming_request && !accepted &&
            <div><Button icon="pi pi-thumbs-up" style={{margin: '3px'}} onClick={() => showAcceptForm(true)}/>
            <Button icon="pi pi-thumbs-down" style={{margin: '3px'}} onClick={() => showRejectForm(true)}/></div>
          }
          {!friend.outgoing_request && !friend.incoming_request && !accepted &&
            <div><Button icon="pi pi-user-plus" style={{margin: '3px'}} onClick={() => showRequestForm(true)}/></div>
          }
        </div>
      </div>
      {rootEl && (
      <div>
        <Dialog key={'REQUEST'+friend.id} visible={requestFormVisible} appendTo={rootEl} 
          onHide={() => showRequestForm(false)} blockScroll footer={renderRequestFooter()}>
            Are you sure you want to send a request to this user?
        </Dialog>
        <Dialog key={'REMOVE'+friend.id} visible={removeFormVisible} appendTo={rootEl} 
          onHide={() => showRemoveForm(false)} blockScroll footer={renderRemoveFooter()}>
            Are you sure you want to remove this user?  You will no longer see their posts and they will no longer see yours.
        </Dialog>
        <Dialog key={'ACCEPT'+friend.id} visible={acceptFormVisible} appendTo={rootEl} 
          onHide={() => showAcceptForm(false)} blockScroll footer={renderAcceptFooter()}>
            Are you sure you want to accept the request from this user?  You will see their posts and they will see yours.
        </Dialog>
        <Dialog key={'REJECT'+friend.id} visible={rejectFormVisible} appendTo={rootEl} 
          onHide={() => showRejectForm(false)} blockScroll footer={renderRejectFooter()}>
            Are you sure you want to reject the request from this user?  You will not see their posts and they will not see yours.
        </Dialog>
        <Dialog key={'HIDE'+friend.id} visible={hideFormVisible} appendTo={rootEl} 
          onHide={() => showHideForm(false)} blockScroll footer={renderHideFooter()}>
            Are you sure you want to hide this user?  You will not see their posts.
        </Dialog>
        <Dialog key={'UNHIDE'+friend.id} visible={unHideFormVisible} appendTo={rootEl} 
          onHide={() => showUnHideForm(false)} blockScroll footer={renderUnHideFooter()}>
            Are you sure you want to un-hide this user?  You will now see their posts.
        </Dialog>
        {friendService.status == 'loading' && (
          <ProgressSpinner />
        )}
        {friendService.status == 'loaded' && (
          <div>{friendService.payload}</div>
        )}
        {friendService.status == 'error' && (
          <div>{friendService.error.message}</div>
        )}
      </div>
      )}
    </div>
    );

};
export default ListItem;