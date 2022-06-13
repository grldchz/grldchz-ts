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
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
export interface Props{
    key: string;
    textToCopy: string;
    visible?: boolean;
    onHide(): void;
    asDialog: boolean;
}
const CopyToClipboardDialog: React.FC<Props> = ({ key, textToCopy, visible, onHide, asDialog }) => {
    const [data, setData] = React.useState<any>(textToCopy);
    const handleChange = (event: any) => {
        event.persist();
        setData((prevData: any) => ({
          ...prevData,
          [event.target.name]: event.target.value
        }));
    };
    const onCopy = () => {
        navigator.clipboard.writeText(data);
    };
    const renderFooter = () => {
        return (
            <div>
                <Button label="Copy Link" icon="pi pi-copy" onClick={() => onCopy()} style={{margin: '3px'}} />
            </div>
        );
    };
    const renderInput = () => {
        return (
            <div>
                <InputTextarea rows={2} cols={30} hidden={true}
                    value={textToCopy} onChange={handleChange}/>
                <div className="pre-display"><a href={data} target="_blank">{data}</a></div>
            </div>
        )
    }
    const renderDialog = () => {
        return (
            <Dialog key={'copyToClipboard'+key} visible={visible} onHide={onHide} blockScroll
                footer={renderFooter()}>
                {renderInput()}
            </Dialog>
        )
    }
    const renderNoDialog = () => {
        return (
            <div><div style={{float:"left"}}>{renderInput()}</div><div style={{float:"right"}}>{renderFooter()}</div></div>
        )
    };
    if(asDialog){
        return renderDialog();
    }
    else{
        return renderNoDialog();
    }
};
export default CopyToClipboardDialog;