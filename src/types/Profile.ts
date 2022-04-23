/**
This is a part of the GRLDCHZ Social network

Copyright (C) 2008 grilledcheeseoftheday.com
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