/**
This is a part of the GRLDCHZ Social network

Copyright (C) 2008 grilledcheeseoftheday.com
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
                <a href={data} target="_blank">{data}</a>
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