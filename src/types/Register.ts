export interface RegisterForm {
    register: string; 
    firstname : string; 
    lastname : string; 
    email: string;
    "g-recaptcha-response": string;
    info?: string;
    error?: string;				
}