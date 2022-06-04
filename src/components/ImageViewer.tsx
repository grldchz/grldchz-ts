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
import { Media } from '../types/Media';
import { ProgressSpinner } from 'primereact/progressspinner';
export type MediaImage = Pick<Media, 'full' | 'title'>;
export interface Props{
    media: MediaImage;
}
const ImageViewer: React.FC<Props> = ({ media }) => {
    const [loading, setLoading] = React.useState(true);
    const [scale, setScale] = React.useState(.5);
    const [translate, setTranslate] = React.useState(50);
    const [zoomIn, setZoomIn] = React.useState(true);
    const handleDoubleCLick = () => {
        setZoomIn(!zoomIn);
        if (zoomIn){                        
            setScale(scale+.5);
            setTranslate(translate-50);
        }
        else {
            setScale(scale-.5);
            setTranslate(translate+50);
        }
    }
    return (
        <div>
        <div style={{display: loading ? "block" : "none"}}>
            <ProgressSpinner/>
        </div>
        <div style={{display: loading ? "none" : "block"}}>
            <img src={media.full} alt={media.title} title={media.title}
                style={{transform: 'scale('+scale+') translate(-'+translate+'%, -'+translate+'%)'}} 
                onLoad={() => setLoading(false)} onDoubleClick={handleDoubleCLick} />
        </div>
        </div>
    );
};
export default ImageViewer;
