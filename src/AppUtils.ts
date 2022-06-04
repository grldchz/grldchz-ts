/**
This is a part of the GRLDCHZ Social network

Copyright (C) 2008 grilledcheeseoftheday.com
**/
const AppUtils: any = () => {
    const getUnescapedText = (escapedText: string) => {
        const str = escapedText;
        return (str + '')
            .replace(/\\(.?)/g, function (s, n1) {
                switch (n1) {
                    case '\\':
                        return '\\'
                    case '0':
                        return '\u0000'
                    case '':
                        return ''
                    default:
                        return n1
                }
            })
    };
    const capitalizeFirstLetter = function(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };
     const getQueryParamByName = (name: string) => {
        name = name.replace(/[[]/, "[").replace(/[\]]/, "]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(window.location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
     };
    const getParameterByName = (name: string) => {
		const path = window.location.pathname;
		if(!path){
			return "";
		}
		const pathArr = path.split("/");
		let pos = 1;
		if(pathArr[1] == process.env.REACT_APP_ROOT){
			pos = pos+1;
		}
        if (name == "contentid" && pathArr[pos] == "content") {	
				return pathArr[pos+1]?pathArr[pos+1]:"";
		}
		else if(name == "mediaid" && pathArr[pos] == "content"){
			if(pathArr[pos+2] && parseInt(pathArr[pos+2])){
				return pathArr[pos+2];
			}
			return "";
		}
		else if(name == "start" && pathArr[pos] == "start"){
			return pathArr[pos+1]?pathArr[pos+1]:"";
		}
		else{
			return "";
		}
    };
	const getContextRoot = () => {
		return window.location.protocol+"//"+window.location.hostname+(window.location.port?(":"+window.location.port):"") 
			+ (process.env.REACT_APP_ROOT ? ("/" + process.env.REACT_APP_ROOT) : "");
	};
    // public interface
    return {
        getUnescapedText,
        capitalizeFirstLetter,
        getParameterByName,
		getContextRoot,
		getQueryParamByName
    };
}
export default AppUtils;