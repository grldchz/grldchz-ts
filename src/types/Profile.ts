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
export interface Profile {
    id: number;
    name: string;
    password: string;
    email: string;
    ip: string;
    create_date_time: string;
    relationship?: string;
    img_file?: string;
    img_caption?: string;
    description?: string;
    first_name: string;
    last_name: string;
    terms_accepted: number;
    banner_img?: string;
    banner_margin_top?: string;
    last_login: Date;
    img_width?: string;
    img_height?: string;
    img_margin_left?: string;
    img_margin_top?: string;
    img_json?: string;
    banner_json?: string;
    user_name: string;
    cookie_policy: boolean;    
}
export interface PostProfile {
    firstname: string;
    lastname: string;
    email: string;
    userdesc?: string;
}

export interface PostChangePassword {
    changepass: string;
    oldpassword: string;
    newpassword: string;
    newpassword2: string;
}