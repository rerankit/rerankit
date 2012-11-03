/*
 * jQuery Bookmarklet - version 1.0
 * Originally written by: Brett Barros
 * With modifications by: Paul Irish
 *
 * If you use this script, please link back to the source
 *
 * Copyright (c) 2010 Latent Motion (http://latentmotion.com/how-to-create-a-jquery-bookmarklet/)
 * Released under the Creative Commons Attribution 3.0 Unported License,
 * as defined here: http://creativecommons.org/licenses/by/3.0/
 *
 */
 
var con
window.bookmarklet = function(opts){fullFunc(opts)};

var import_helper = function(){
    var head=document.getElementsByTagName('head')[0], script=document.createElement('script');
    script.type='text/javascript';
    script.src='https://raw.github.com/dweebit/rerankit/dev-view/impact-story.js?';
    head.appendChild(script);
};
 
// These are the styles, scripts and callbacks we include in our bookmarklet:
window.bookmarklet({
 
    css : [],
    js  : [],    
//	jqpath : 'myCustomjQueryPath.js', <-- option to include your own path to jquery
    ready : function(){
	//import_helper();
	$('body').prepend("<div id='console'></div>");
	con = $('#console');
	con.append('<p>hello?</p>');
	// The meat of your jQuery code goes here
	var ref_objs = parse();
	var collection = prep_collection(ref_objs);
	var results = impactStory.createAndGetCollection(collection, 'YAY', function(data){
	    var items = data.items;
	    for (item in items){
		for (ref in ref_objs){
		    if (ref_objs.pmid == items.item.aliases.pmid[0]){
			ref_objs.impact_story = items.item;
		    }
		}
	    con.append(data);
	    }
	});
	var n = 1 + 1; //for ghetto debugging
	
    }
})
 
function fullFunc(a){function d(b){if(b.length===0){a.ready();return false}$.getScript(b[0],function(){d(b.slice(1))})}function e(b){$.each(b,function(c,f){$("<link>").attr({href:f,rel:"stylesheet"}).appendTo("head")})}a.jqpath=a.jqpath||"http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js";(function(b){var c=document.createElement("script");c.type="text/javascript";c.src=b;
c.onload=function(){e(a.css);d(a.js)};
document.body.appendChild(c)
})(a.jqpath)};

var parse = function() {
    var references = $('.rprt');
    
    var ref_objs = new Array();
    references.each(function(index) {
	var dd = $(this).find('.rprtid dd')[0];
	//con.append(dd)
	ref_objs.push({'pmid': dd.textContent,
		       'element': $(this),
		       'impact_story': null 
		      });
	con.append(index);
    });
    con.append(ref_objs.length);
    //con.append(references);
    return ref_objs;
};

var prep_collection = function(refs) {
    collection_list = new Array();
    for (ref in refs){
	collection_list.push(['pmid', refs[ref].pmid]);
    }
    return collection_list;
}
	
			      
	
var impactStory = {};


/**
 * Given a doi, fetch a tiid
 *
 * @doi DOI
 * @callback callback function to be called: function(tiid)
 * @error callback function to be called on error: functon(error)
 */
impactStory.fetchTIID = function(doi, callback, error) {
    $.ajax({
        url: "http://api.total-impact.org/item/doi/" + doi,
        type: 'POST',
        dataType: 'json'
    }).done(function (data) {
        callback(data);
    }).error(function (error) {
        if (error) {
            callback(error);
        }
    });
}

/**
 * Get collection information (including all ALM data)
 *
 * Note that for a newly created collection, this can time some time to return the full set of data
 * as total-impact can take a while to generate it. To get around this problem we poll the total-impact API
 * in intervals and only return when we have the full set of data. This generally takes about 5 seconds. 
 * To get back partial (incomplete) data returned from each poll, defind a partial-callback function 
 * using conf.partial = partialCallbackFunc.
 * 
 * @collection: Can be either the collection ID (string), a "create-collection" meta-object, or a collection object.
 * @callback: Callback to be called when the collection is done loading and we have all data. function(data)
 * @error callback function to be called on error: functon(error)
 * @conf Configuration object. For example:
 *   {
 *    includeItems: true,           // set to false to only return meta-information, not ALM data
 *    retry: 10,                    // Number of times to poll before giving up
 *    interval: 1000,               // Number of milliseconds between polls
 *    partial: function(data)       // Partial callback function. Call this on each poll, even if we have only partial data.
 *   }
 */
impactStory.getCollection = function(collection, successCallback, error, conf) {
    // Get the collection ID. Can pass either a string, a "create-collection" meta-object, or a collection object
    var collectionId;
    if (typeof collection == 'string') {
        collectionId = collection;
    }
    if (typeof collection == 'object') {
        if (collection.hasOwnProperty('collection')) {
            collectionId = collection.collection._id;
        }
        else {
            collectionId = collection._id;
        }
    }
  
    $.ajax({
        url: "http://api.total-impact.org/collection/"+collectionId+'?api_key=test',
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        statusCode: {
            210: function(data){
                console.log("still updating")
                    // run partial callback stuff
                    setTimeout(function(){
                        impactStory.getCollection(collection, successCallback, error, conf)
                    }, 1000)
                },
            200: function(data) {
                console.log("done with updating")
                    successCallback(data)
                    return false;
                }
        }
    });
}


/**
 * Create a collection
 *
 * @aliases: list of key-value pairs. For example: [['pmid','12345'],['doi','10.1371/journal.pbio.1000056']]
 * @title: Title of collection
 * @callback: Callback to be called when the collection is done loading. function(data)
 * @error callback function to be called on error: functon(error)
 */
impactStory.createCollection = function(aliases, title, successCallback, error) {
    var postData = {
        'aliases' : aliases,
        'title': title
    };

    $.ajax({
        url: "http://api.total-impact.org/collection",
        type: 'POST',
        dataType: 'json',
        contentType:"application/json; charset=utf-8",
        data: JSON.stringify(postData)
    }).done(function (returnedData) {
        successCallback(returnedData);
    }).error(function (error) {
        if (error) {
            successCallback(error);
        }
    });
}

/**
 * Create and then get ALM for a collection
 * 
 * See documentation on impactStory.getCollection for more information on how polling works
 * 
 * @aliases: list of key-value pairs. For example: [['pmid','12345'],['doi','10.1371/journal.pbio.1000056']]
 * @title: Title of collection
 * @callback: Callback to be called when the collection is done loading. function(data)
 * @error callback function to be called on error: functon(error)
 * @conf Configuration object. For example:
 *   {
 *    includeItems: true,           // set to false to only return meta-information, not ALM data
 *    retry: 10,                    // Number of times to poll before giving up
 *    interval: 1000,               // Number of milliseconds between polls
 *    partial: function(data)       // Partial callback function. Call this on each poll, even if we have only partial data.
 *   }
 */
impactStory.createAndGetCollection = function(aliases, title, callback, error, conf) {
    impactStory.createCollection(aliases, title, function(collection) {
	con.append(collection);
        impactStory.getCollection(collection.collection, callback, error, conf);
    }, error);
}
