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
 * @callback:   Callback to be called when the collection is done loading and we have all data. function(data)
 * @error:      Callback function to be called on error: functon(error)
 * @conf Configuration object. For example:
 *   {
 *    includeItems: true,           // set to false to only return meta-information, not ALM data
 *    retry: 10,                    // Number of times to poll before giving up
 *    interval: 1000,               // Number of milliseconds between polls
 *    partial: function(data)       // Partial callback function. Call this on each poll, even if we have only partial data.
 *   }
 */
impactStory.getCollection = function(collection, callback, error, conf) {
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
                    //@@TODO: run partial callback stuff and deal with errors
                    //@@TODO: Respect conf.retry and conf.interval
                    setTimeout(function(){
                        impactStory.getCollection(collection, callback, error, conf)
                    }, 1000)
                },
            200: function(data) {
                    callback(data)
                }
        }
    });
}


/**
 * Create a collection
 *
 * @aliases: list of key-value pairs. For example: [['pmid','12345'],['doi','10.1371/journal.pbio.1000056']]
 * @title:    Title of collection
 * @callback: Callback to be called when the collection is done loading. function(data)
 * @error:    callback function to be called on error: functon(error)
 */
impactStory.createCollection = function(aliases, title, callback, error) {
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
        callback(returnedData);
    }).error(function (err) {
        if (error) {
            error(err);
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
        impactStory.getCollection(collection, callback, error, conf);
    }, error);
}
