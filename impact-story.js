var impactStory = {};

// Given a doi, fetch a tiid
// doi: DOI
// callback: callback function to be called. function(doi)
impactStory.fetchTIID = function(doi, callback) {
  $.ajax({
    url: "http://api.total-impact.org/item/doi/" + doi,
    type: 'POST',
    dataType: 'json'
  }).done(function (data) {
    callback(data);
  });
}

// aliases: list of key-value pairs. For example: [['pmid','12345'],['doi','10.1371/journal.pbio.1000056']]
// title: Title of collection
// callback: Callback to be called when the collection is done loading. function(data)
impactStory.createCollection = function(aliases, title, callback) {
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
  });
}

