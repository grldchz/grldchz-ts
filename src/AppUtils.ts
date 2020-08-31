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
    // public interface
    return {
        getUnescapedText,
        capitalizeFirstLetter
    };
}
export default AppUtils;