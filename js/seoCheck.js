var app = app || {};

;(function(app) {

    // ## Utils
    function createHTMLlist(arr, className, isMarkup) {
        var result = [];
        result.push("<ul class='" + className + "'>");
        for (var i in arr) {
            if (isMarkup) {
                result.push("<li><code>" + _.escape(arr[i]) + "</code></li>");
            } else {
                result.push("<li>" + arr[i] + "</li>");
            }
        }
        result.push("</ul>");
        return result.join("");
    }

    // ## Header
    
    function checkTitle(title, keyword) {
        var result = {
            state: "",
            msg: "",
            recommendation: "",
            icon: ""
        };

        // 1. check if title tag exists
        if (title) {
            result.state = "Title length: " + title.length;

            //  1.1 check if title length is less than 70 chars and more than 40
            var titleLength = title.length;

            if (titleLength > 40 && titleLength < 70) {
                result = {
                    msg : "Title length is less than 70 and more than 40",
                    icon: "icon-good"
                }
            } 

            if (titleLength > 70) {
                result = {
                    msg: "Title is to long",
                    icon: "icon-normal",
                    recommendation: "It will look cuted on the google results"
                }
            }

            if (titleLength < 40) {
                result = {
                    msg: "Title is to short",
                    icon: "icon-bad",
                    recommendation: "need to add some more words, but less than 70 chars"
                }
            }
        } else {
            result = {
                state: "",
                msg: "Title tag not found",
                recommendation: "Ensure that you have a `title` tag",
                icon: "icon-bad"
            }
        }

        //  1.2 check if `keyword` is in the title
        //  **NOTE**: maybe this need to be in the keyword section
        // if ($title.indexOf(keyword)) {
        //     
        // } 
        
        return result;
    };

    function checkMetaDescription(metaDescription) {
        var result = {};

        // 2. check if meta description tag exists
        if (metaDescription) {
            var md = metaDescription;

            //  2.1 check if meta description is less than 156 chars
            //  **TODO** check if there is some minium chars required
            if (md.length < 156) {
                result = {
                    icon : "icon-good",
                    state : "Meta description length is " + md.length + " chars",
                    msg : "this is less than the 156 maxium required",
                    recommendation : "Everything good here"
                }
            } else {
                result.icon = "icon-bad"
                result.state = "Meta description length is " + md.length + " chars";        
                result.msg = "this is more than the 156 maxium required";
                result.recommendation = "reduce the text just to the escential";
            }

        } else {
            result.icon = "icon-bad";
            result.state = "Error";
            result.msg = "There is not meta description";
            result.recommendation = "We highly recommend that you add a meta description";
        }

        result.markup = "";

        return result;
    };
    
    function checkRichSnippets(doc) {
        // We get the DOM object as `doc` paramter form the url on app.jsx.js
        // and we save it on the `$dom` variable
        $dom = doc || {};

        // `Object` result to send to the component
        var result = {},
                
        // `Object` containing all the possible matches for rich snippets
        // and its kind, microdata, microformats or RDFa
            richSnippets = {
                "itemscope" : "microdata",
                "itemprop" : "microdata",
                "itemtype" : "microdata",
                "hreview" : "microformats",
                "vCard" : "microformats",
                "hCard" : "microformats",
                "dtstart" : "microformats",
                "xmls" : "RDFa",
                "rel='author'" : "Authorship",
                'rel="author"' : "Authorship",
                "rel='publisher'" : "Publisher",
                'rel="publisher"' : "Publisher",
                "og:" : "Facebook Open Graph",
                "twitter:" : "Twitter Cards"
            },
            // Array to store the kind of rich snippets found
            snippetsFound = [],
            kindOfRichSnippets = [],
            richSnippetsMissing = [];
        
        //  ### 3. check if rich snippets exists
        
        // Map the richSnippets `Object` and see if we can find matches
        // on the `DOM Object`, if is not repited then push into the `snippetsFound` array

        var pageMarkup = $dom.find('html').html() || "";
        $.each(richSnippets, function(key, val) {
            // Save kind of rich snippets to an array for future use
            kindOfRichSnippets.push(val);

            // If matches found are more than 0 then proceed to save the results
            if (pageMarkup.length > 1) {
                if (pageMarkup.indexOf(key) > -1) {
                    snippetsFound.push(val);
                }
            }
             
        });

        // Strip repeated elements
        snippetsFound = _.uniq(snippetsFound);
        console.log("snippets found: " + snippetsFound);

        // If we found some rich nippets then
        if (snippetsFound.length > 0) {
            result.icon = "icon-good";
            result.state = "Rich snippets found: " + snippetsFound.join(", ");
            result.msg = "";

            // Get which rich snippets need to be added
            richSnippetsMissing = _.difference(_.uniq(kindOfRichSnippets), snippetsFound);

            // If there is some rich snippets missing, then add this recommendation
            if (richSnippetsMissing.length > 0) {

                console.log(richSnippetsMissing);

                var hasPublisher = _.contains(richSnippetsMissing, "Publisher"),
                    hasAuthorship = _.contains(richSnippetsMissing, "Authorship"),
                    hasMicrodata = _.contains(richSnippetsMissing, "microdata"),
                    hasMicroformats = _.contains(richSnippetsMissing, "microformats"),
                    hasRDFa = _.contains(richSnippetsMissing, "RDFa");

                // If website doesn't have both Publisher and Authorship then recommend one or another
                // Otherwise check if exist one of the two and don't recommend anything
                if (hasPublisher && hasAuthorship) {
                    richSnippetsMissing.push("Authorship or Publisher");
                    _.pull(richSnippetsMissing, "Authorship", "Publisher");
                } 

                // If is using only one, pull both
                if (hasPublisher || hasAuthorship) {
                    _.pull(richSnippetsMissing, "Authorship", "Publisher");
                }

                // **TODO**: If is not using any rich snippet recommend to choose one of the three
                // Otherwise don't recommend anything
                if (hasMicrodata && hasMicroformats && hasRDFa) {
                    richSnippetsMissing.push("Microdata, Microformats or RDFa");
                    _.pull(richSnippetsMissing, "microdata", "microformats", "RDFa");
                }

                if (hasMicrodata || hasMicroformats || hasRDFa) {
                    _.pull(richSnippetsMissing, "microdata", "microformats", "RDFa");
                }

                result.recommendation = "you can add some of these (depending of your needs) to improve your seo: ";
                result.markup = createHTMLlist(richSnippetsMissing, "rich-snippets-results", false);

            // If not, everything is good here
            } else {
                result.recommendation = "Everything good here";
            }
        // If we didn't found any rich snippets then say bad things
        } else {
            result.icon = "icon-bad";
            result.state = "No rich snippets meta tags found";
            result.msg = "rich snippets help google to crawl better the site";
            result.recommendation = "We highly recommend to add some";
        }

        return result;
    };

    // ## Body

    //  3. check if there is any image in the page
    //  3.1 check if the images has `alt` attr
    //  3.2 outputs what images are with no `alt` attr
    function checkImages(html) {
        html = html || "";

        var hasImages = $(html).find('img'),
            images = simpleStr.getImagesWithNoAltTag(html),
            result = {},
            imagesLength = images.numOfMatches || 0;

        console.log(images.matches);

        // If we found images without alt attribute
        // we say bad things and ouputs a list of 
        // img tags that are with no alt tag 
        if (imagesLength) {
            result.icon = "icon-bad";
            result.state = imagesLength + " images without alt attribute found";
            result.msg = "you need to add an alt attribute that includes the primary keyword";
            result.recommendation = "Images withouth alt attr found that you need to fix: "; 
            // result.markup = "<code class='hljs xml'>" + _.escape(images.matches) + "</code>";
            result.markup = createHTMLlist(images.matches, "no-alt-results", true);

        // If we can't find any image without alt attributes then
        // **note**: this doesn't mean that everything is gook, we
        // still need to check if there is any image in here
        } else {

            // If we have at least one image
            if (hasImages) {

                // We set this values normally without checking if there is any keywords 
                // in the alt attribute
                result.icon = "icon-normal";
                result.state = "All images found have alt attribute";
                result.msg = "very good, google likes images with alt attributes descriptive";
                result.recommendation = "A good idea is that include the primary keyword on those alt attributes";
                result.markup = "";

                /*
                // ----
                // **NOTE**: this need to be done only if we have a keyword to check
                // ----
                //
                // New var to be more semantic about what are we looking
                var images = hasImages;

                // We want to go through the images object to find if there is
                // a keyword in their alt attributes
                $.each(images, function(key, val) {
                    // If the current image has alt attribute
                    if (images.eq(key).attr('alt')) {

                        // If the keyword is in the alt attr then we stop the loop,
                        // we need to found only at least one keyword
                        if (images.eq(key).attr('alt').indexOf('a') > -1) {
                            result.icon = "icon-good";
                            result.state = "All the images found have alt atttribute and at least in one contains a keyword in it";
                            result.msg = "Excelent, Google loves see keywords on the alt attributes, just don't abuse";
                            result.recommendation = "You are doing an excelent job!";
                            result.markup = "";

                            return false;
                        }
                    }
                });
                */

            // If the page doesn't contain images then
            } else {
                result.icon = "icon-bad";
                result.state = "No images found on your page";
                result.msg = "People like to see images in the websites and google like to see image tags with alt attributes on it";
                result.recommendation = "Add some images to keep users and google happy";
                result.markup = "";
            }
        }

        return result;
    }

    // 2. check if there is google analytics
    function checkGoogleAnalytics(html) {
        html = html || "";

        var result = {};


        if (html.match(/UA-[0-9]{5,}-[0-9]{1,}/g)) {
            result.icon = "icon-good";
            result.state = "Google Analytics code found";
            result.msg = "everything good here";
            result.recommendation = "I don't know where you have your google anayltics code, but the best place is the header";
        } else {
            result.icon = "icon-bad";
            result.state = "Google Analytics code not found :(";
            result. msg = "We couldn't found GA code";
            result.recommendation = "Google Analtics help you blablabla";
        }

        result.markup = "";
        return result;
    }

    // ## keyword
    // 1. check if `keyword` is in the title tag
    // 2. check if `keyword` is in the meta description
    // 3. check if the `keyword` appear in at least one headline
    // 4. check if the `keyword` is included in the images `alt` attr
    // 5. check `keyword` density, outputs the % and how many times was found the `keyword`
    // 6. check if the `keyword` is in the first paragraph of the body copy

    app.checkGoogleAnalytics = checkGoogleAnalytics;
    app.checkImages = checkImages;
    app.checkRichSnippets = checkRichSnippets;
    app.checkMetaDescription = checkMetaDescription;
    app.checkTitle = checkTitle;
})(app);
