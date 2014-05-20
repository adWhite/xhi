/*
query example: 'select * from html where url="http://jolv.me" and compat="html5" and xpath="/html"'

## Links related to YQL and AJAX requests to it

http://papermashup.com/parse-xml-with-jquery/
http://myjson.com/1q00
http://code.tutsplus.com/tutorials/quick-tip-cross-domain-ajax-request-with-yql-and-jquery--net-10225
http://stackoverflow.com/questions/680562/can-javascript-read-the-source-of-any-web-page
http://davidwalsh.name/write-javascript-promises
*/

;(function(root) {

    // This method return the *HTML* code of an URL in *xml* format
    var yqlRequest = function(url, xpath) {
        var baseUrl = "http://query.yahooapis.com/v1/public/yql?",

            query = function(url) {
                return "select * from html where url='" + url + "' and compat='html5' and xpath='" + xpath + "'";
            },

            opts = {
                url:  baseUrl,
                dataType: "xml",
                data: { q: query(url), format: "xml" }
            };
        
        return $.ajax(opts);
    };   

    root.yqlRequest = yqlRequest;
})(this);
