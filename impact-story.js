var impactStory = {};

impactStory.fetchTIID = function(doi, callback) {
  $.ajax({
    url: "http://api.total-impact.org/item/doi/" + doi,
    type: 'POST',
    dataType: 'json'
  }).done(function (data) {
    callback(data);
  });
}

// Aliases is a list of key-value pairs. For example: [['pmid','12345'],['doi','10.1371/journal.pbio.1000056']]
// Title of collection
// Callback to be called when the collection is done loading
impactStory.createCollection(aliases, title, callback) {
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
  });
}

