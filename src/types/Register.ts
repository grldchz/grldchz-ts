/**
This is a part of the GRLDCHZ Social network

Copyright (C) 2008 grilledcheeseoftheday.com
**/
export interface RegisterForm {
    register: string; 
    firstname : string; 
    lastname : string; 
    email: string;
    "g-recaptcha-response": string;
    info?: string;
    error?: string;				
}