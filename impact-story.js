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

// aliases: list of key-value pairs. For example: [['pmid','12345'],['doi','10.1371/journal.pbio.1000056']]
// title: Title of collection
// callback: Callback to be called when the collection is done loading. function(data)
impactStory.createCollection = function(aliases, title, callback, error) {
  var postData = {
    'aliases' : aliases,
    'title': title,
  };
  
  $.ajax({
    url: "http://api.total-impact.org/collection",
    type: 'POST',
    dataType: 'json',
    contentType:"application/json; charset=utf-8",
    data: JSON.stringify(postData)
  }).done(function (returnedData) {
    callback(returnedData);
  }).error(function (error) {
    if (error) {
      callback(error);
    }
  });
}


// conf: {
//  includeItems: true,
//  retry: 10,
//  interval: 1000
//  partial: function(data)
//}
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
               url: "http://api.total-impact.org/collection"+collectionId+'?api_key='+test,
               type: "GET",
               dataType: "json",
               contentType: "application/json; charset=utf-8",
               statusCode: {
                   210: function(data){
                       console.log("still updating")
                       // run partial callback stuff

                       impactStory.getCollection(collection, callback, error, conf)
                   },
                   200: function(data) {
                       console.log("done with updating")

                       // run the success callback
                       successCallback(data)

                       return false;
                   }
               }
           });

}


// aliases: list of key-value pairs. For example: [['pmid','12345'],['doi','10.1371/journal.pbio.1000056']]
// title: Title of collection
// callback: successCallback to be called when the collection is done loading. function(data)
impactStory.createCollection = function(aliases, title, successCallback, error) {
    var postData = {
        'aliases' : aliases,
        'title': title,
    };

    $.ajax({
               url: "http://api.total-impact.org/collection",
               type: 'POST',
               dataType: 'json',
               contentType:"application/json; charset=utf-8",
               data: JSON.stringify(postData)
           }).done(function (returnedData) {
                       var collection = returnedData.collection._id
                       var callback = impactStory.getCollection
                       var conf = {}

                       impactStory.getCollection(collection, successCallback, error, conf);
                   })
            .error(function (error) {
                                if (error) {
                                    callback(error);
                                }
                            });
}
