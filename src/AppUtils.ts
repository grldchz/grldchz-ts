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
    const getParameterByName = (name: string) => {
        name = name.replace(/[[]/, "[").replace(/[\]]/, "]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(window.location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
      };
        // public interface
    return {
        getUnescapedText,
        capitalizeFirstLetter,
        getParameterByName
    };
}
export default AppUtils;