import React from 'react';
import { Media } from '../types/Media';
import { ProgressSpinner } from 'primereact/progressspinner';
export interface Props{
    media: Media;
}
const ImageViewer: React.FC<Props> = ({ media }) => {
    const [loading, setLoading] = React.useState(true);
    const [scale, setScale] = React.useState(.5);
    const [translate, setTranslate] = React.useState(50);
    const [zoomIn, setZoomIn] = React.useState(true);
    const handleDoubleCLick = () => {
        if(scale > .89){
            setZoomIn(false);
        }
        if(scale < .5){
            setZoomIn(true);
        }
        if (zoomIn){                        
            setScale(scale+.1);
            setTranslate(translate-10);
        }
        else {
            setScale(scale-.1);
            setTranslate(translate+10);
        }
    }
    // const handlePinch = () => {
    //     setScale(scale+.1);
    // }
    // const handleMouseScroll = () => {
    //     setScale(scale+.1);
    // }
    return (
        <div>
        <div style={{display: loading ? "block" : "none"}}>
            <ProgressSpinner/>
        </div>
        <div style={{display: loading ? "none" : "block"}}>
            <img src={media.full} alt={media.title}
                style={{transform: 'scale('+scale+') translate(-'+translate+'%, -'+translate+'%)'}} 
                onLoad={() => setLoading(false)} onDoubleClick={handleDoubleCLick} />
        </div>
        </div>
    );
};
export default ImageViewer;
