var impactStory = {};

// Given a doi, fetch a tiid
// doi: DOI
// callback: callback function to be called. function(tiid)
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
impactStory.createCollection(aliases, title, callback, error) {
  var data = {
    'aliases' : aliases,
    'title': title,
  };
  
  $.ajax({
    url: "http://api.total-impact.org/collection",
    type: 'POST',
    dataType: 'json',
    data: $.encodeJSON(data)
  }).done(function (data) {
    callback(data);
  }).error(function (error) {
    if (error) {
      callback(error);
    }
  });
}

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
}