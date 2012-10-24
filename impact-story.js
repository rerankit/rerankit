$.ajax({
  url: "http://api.total-impact.org/item/doi/10.1371/journal.pcbi.1000361",
  type: 'POST',
  dataType: 'json'
}).done(function (data) {
  alert(data);
});
