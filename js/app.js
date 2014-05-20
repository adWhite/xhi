/** @jsx React.DOM */

var app = app || {};

;(function(app){

    // get this data from yqlRequest and save it into an array
    var data = [
            {icon: "icon-bad", state: "statee", msg: "message", recommendation: "rec" },
            {icon: "icon-good", state: "statesde", msg: "mdhessage", recommendation: "rec1" } 
        ];

    var AppUI = React.createClass({displayName: 'AppUI',
        getInitialState: function() {
            return { data: data };    
        },

        getResultsFromServer: function() {
            var that = this;

            //yqlRequest("http://jhues.com/hair-salon-in-the-woodlands-tx/", '/html')
             yqlRequest("http://adWhite.com", '/html')
            .done(function(xml) {
                // Not trying to use RegExp to parse HTML anymore because
                // http://stackoverflow.com/questions/1732348/regex-match-open-tags-except-xhtml-self-contained-tags
                //
                // **Better Solution: **
                // Convert a String of XML to a DOM Object with jQuery
                // http://outwestmedia.com/jquery-plugins/xmldom/
                var $dom = $.xmlDOM($(xml).find("results").html());

                // # SEO Check Logic
                
                // Store results in an Object
                var results = [];

                // Check if `keyword` was inserted
                // var keyword = function() {
                //     return form.querySelector('#keyword').value.length > 0;
                // };

                // ## URL
                // 1. check if keyword is in the URL

                // ## Header
                // 1. Check `title` tag
                var title = $dom.find('title').html() || null;
                console.log("title tag: " + title);
                results.push(app.checkTitle(title));

                // 2. Check `meta` description tag
                
                var metaDescription = $dom.find('meta[name="description"]').attr("content") || null;
                console.log("meta description " + metaDescription);
                results.push(app.checkMetaDescription(metaDescription));

                // 3. Check Rich Snippets meta tags
                results.push(app.checkRichSnippets($dom));

                // 4. How many images are in the page
                //    and how many has no alt attr
                var $body = $dom.find('body').html();
                results.push(app.checkImages($body));
                
                // 5. Check GA
                results.push(app.checkGoogleAnalytics($dom.find("html").html()));

                that.setState({ data: results });
            })
            .fail(function(xhr, status, err) {
                console.error(xhr, status, err);
            });  

            return false;
        },

        render: function() {
            return (
                React.DOM.main( {className:"app-container"}, 
                    React.DOM.h1(null, "APP Title."),
                    Form( {onFormSubmit:this.getResultsFromServer} ),
                    React.DOM.hr(null ),
                    Results( {data:this.state.data} )
                )
            )
        }  
    });

    var Results = React.createClass({displayName: 'Results',
        render: function() {
            var results = this.props.data.map(function(result) {
                return Result( {data:result} ) 
            });

            return React.DOM.ul( {className:"app-results"}, results)
        }
    });

    var Result = React.createClass({displayName: 'Result',
        render: function() {
            var data = this.props.data;

            return React.DOM.li(null, React.DOM.i( {class:data.icon}), " ", data.state,", ", data.msg,", ", data.recommendation, " ", React.DOM.span( {dangerouslySetInnerHTML:{__html: data.markup}} ), " " )
        }
    });

    var Form = React.createClass({displayName: 'Form',
        handleSubmit: function() {
            var url = this.refs.url.getDOMNode().value.trim();
            console.log(url);

            this.props.onFormSubmit({url: url});

            return false;
        },

        render: function() {
            return (
                React.DOM.form( {className:"app-form", onSubmit:this.handleSubmit}, 
                    React.DOM.label(null, "Keyword (optional)"),
                    React.DOM.input( {type:"text", ref:"keyword"} ),
                    React.DOM.label(null, "URL"),
                    React.DOM.input( {type:"text", ref:"url", placeholder:this.props.url} ),
                    React.DOM.input( {type:"submit", id:"check-button", value:"Check Website"} )     
                )
            );
        }
    });

    React.renderComponent(
        AppUI(null ), 
        document.getElementById('app')
    );

    /*
    // just for dev purposes
    $url.focus();

    $form.on('submit', function(e) {
        e.preventDefault();

        yqlRequest($url.val(), "/html")
            .done(function(xml) {

                // Not trying to use RegExp to parse HTML anymore because
                // http://stackoverflow.com/questions/1732348/regex-match-open-tags-except-xhtml-self-contained-tags
                //
                // **Better Solution: **
                // Convert a String of XML to a DOM Object with jQuery
                // http://outwestmedia.com/jquery-plugins/xmldom/
                var $dom = $.xmlDOM($(xml).find("results").html());

                // # SEO Check Logic
                
                // Store results in an Object
                var results = [];

                // Clean results from past submissions
                $form.find('#results').html('');

                // Check if `keyword` was inserted
                var keyword = function() {
                    return form.querySelector('#keyword').value.length > 0;
                };

                // ## URL
                // 1. check if keyword is in the URL

                // Check all title stuff related
                var title = $dom.find('title').html() || null;

                results.push(app.checkTitle(title));

                // ## body
                // 1. check if there is at least 300 words in the body copy
                // 1.2 outputs how many words are
                //
                //  3. check if there is any image in the page
                //  3.1 check if the images has `alt` attr
                //  3.2 outputs what images are with no `alt` attr
                //
                // 5. check the Flesch Reading Ease test, and outputs the score
                //
                // 2. check if there is google analytics
                //

                // ## keyword
                // 1. check if `keyword` is in the title tag
                // 2. check if `keyword` is in the meta description
                // 3. check if the `keyword` appear in at least one headline
                // 4. check if the `keyword` is included in the images `alt` attr
                // 5. check `keyword` density, outputs the % and how many times was found the `keyword`
                // 6. check if the `keyword` is in the first paragraph of the body copy

                //
                // console.log(seo.getImagesWithNoAltTag(result));
                // console.log(seo.getImagesLength(result));
                
                console.log(results);

                $.each(results, function(key, val) {
                    var el = "<li>"+ val.icon + " " + val.state + ", " + val.msg + ", " + val.recommendation + "</li>";

                    $('#form').find('#results').append(el);
                });

            });
    });
    */
})(app);
