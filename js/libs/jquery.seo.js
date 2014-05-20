/// SimpleStr.js 0.0.1
// http://thinkxl.github.io/simplestr.js
// (c) 2014 Juan Olvera
// SimpleStr may be freely distributed under the MIT license.

(function(root) {
    var simpleStr = { 

        // ## HTML

        // sanitize potentially risky HTML to safe HTML
        // pulled from https://github.com/jamiesonbecker/safify.js
        escapeHTML: function(str) {
            str = str || "";

            return str 
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;')
                .replace(/\//g, '&#x2F;')
                .replace(/\n/g, ' <br> ');
        },

        // Remove all the `HTML` tags from a string and return it clean
        stripHTML: function(html) {
            html = html || "";

            /* return html.replace(/(<[^>]+)>/ig, ''); */
            return html.replace(/<\/?[^>]+>/g, '');
        },

        // Add the `<strong>` tag to the `keywords` found in a `string`
        makeKeywordsBold: function(str, keyword) {
            str = str || "";
            var keywordBolded = str.replace(keyword, '<strong>' + keyword + '</strong>');

            return keywordBolded;
        },

        // Check if headers `h1`, `h2`, `h3`, `h4`, `h5` and `h6` exists
        subHeadings: function(str, keyword) {
            str = str || "";
            var keywordOnHeadlines = new RegExp('<h[1-6]>.*' + keyword + '.*<\/h[1-6]>', 'gi') || '',
                matches = str.match(keywordOnHeadlines);

            // `exist` method return `true` if exist at least one keyword in some headline
            function exist() {
                if (matches) {
                    return true;
                } else {
                    return false;
                }
            }

            // `keywords` method return how many keywords found on the headlines
            function keywords() {
                if (matches) {
                    return matches.length;
                } else {
                    return 0;
                }
            }

            return {
                exist: exist,
                keywords: keywords
            };
        },

        // Return total of `img` tags found in the `string`
        getImagesLength: function(str) {
            str = str || "";
            var img = new RegExp("<img ", "gi"),
                matches = str.match(img) || "";

            return matches.length;
        },

        // Return an object with the total of `img` tags with no `alt` attr and an array with the matches
        // regexp reference: http://bit.ly/1kbKagy
        getImagesWithNoAltTag: function(str) {
            str = str || "";
            var imgNoAlt = /<img(\s*(?!alt)([\w\-])+=([\"\'])[^\"\']+\3)*\s*\/?>/g,
                matches = str.match(imgNoAlt) || "",
                result = {};

            result.numOfMatches = matches.length, 
            result.matches = matches

            return result;
        },

        // ## String Manipulation
        
        // The **Flesch Reading Ease** measures textual difficulty, with indicates how easy a text is to read.
        // This method return the score between 0 and 100
        // [more about it](http://bit.ly/1gQT8eE)
        getFleschReadingEase: function(totalWords, totalSentences, totalSyllables) {
            var score = 206.835 - (1.015*totalWords)/totalSentences - (84.6*totalSyllables)/totalWords;

            return score.toFixed(2);
        },

        // Get the [keyword density](http://bit.ly/1gQTphI) of a string
        getKeywordDensity: function(str, keyword) {
            // `tkn`: how many times you repeated a specific keyword
            var tkn = str.toLowerCase().replace(/\s\./g, '.').replace(/\s\,/g, '.').split(' ').length,
                // `nkr`: total words in the analyzed text
                nkr = this.getKeywordsOnString(str, keyword);

            return ((nkr/tkn)*100).toFixed(2);
        },

        // Return a `string` shortened at certain `limit` of chars with "..." at the end
        cutString: function(limit, str) {
            str = str || "";
            var shortString = ""; 

            if (str.length > limit) {
                shortString = str.substr(0, limit-3) + "...";
            }

            return shortString;
        },

        // Get how may *syllables* has a string
        getSyllables: function(str) {
            str = str || "";

            if (str.length <= 3) {
                return 1;
            } else {
                return text.replace(/^y/, '').match(/[aeiou]{1,2}/g).length*0.92;
            }
        },

        // Get how many *keywords* has a string
        getKeywordsOnString: function(str, keyword) {
            str = str || "";
            keyword = new RegExp(keyword, 'gi');
            var matches = str.match(keyword) || '';

            return matches.length;
        },

        // Get how many *words* has a string
        getTotalWords: function(str) {
            str = str || '';
            // var totalWords = str.replace(/\s\./g, '.').replace(/\s\,/g, ',').split(' ').length;
            // var totalWords = str.match(/\w+/g).length;
            var totalWords = str.match(/\S+/g).length;

            console.log(totalWords);

            return totalWords;
        },

        // Get end of paragraph of a `html` document
        getEndOfParagraph: function(str) {
            str = str || "";
            var endOfParagraph = str.split('^nbsp;') || '';

            return endOfParagraph.length;
        },

        // Get the first paragraph of a `html` document
        getFirstParagraph: function(str) {
            str = str || "";
            var firstParagraph = str.match(/<p>.*<\/p>/gi)[0] || '';

            return firstParagraph;
        },

        // Get number of total sentences of a string
        getTotalSentences: function(text) {
            text = text || '';

            if (text.split('.').length > 1) {
                return text.match(/\.\s/g).length + 1;
            } else {
                return 1;
            }
        },

        // Convert `something like this` into `Something Like This`
        capitalize: function(str) {
            str = str || "";

            return str.replace(/^(.)|\s(.)/g, function($1) { return $1.toUpperCase() });
        },

        // Convert `Something Like This` into `something-like-this`
        slugify: function(str) {
            str = str || "";
            var slugified = text.toLowerCase().replace(/\s/g, '-');

            // check if the last char is '-' and delete it 
            if (slugified.substr(-1) === '-') {
                slugified = slugified.substr(0, slugified.length -1);
            }

            return slugified;
        }
    };

    root.simpleStr = simpleStr;
})(this);
