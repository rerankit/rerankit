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

var import = function(){
    var head=document.getElementsByTagName('head')[0],script=document.createElement('script');script.type='text/javascript';script.src='https://raw.github.com/dweebit/rerankit/dev-view/impact-story.js?';head.appendChild(script);})();
 
// These are the styles, scripts and callbacks we include in our bookmarklet:
window.bookmarklet({
 
    css : [],
    js  : [],    
//	jqpath : 'myCustomjQueryPath.js', <-- option to include your own path to jquery
    ready : function(){
	import();
	$('body').prepend("<div id='console'></div>");
	con = $('#console');
	con.append('<p>hello?</p>');
	// The meat of your jQuery code goes here
	var ref_objs = parse();
	var collection = prep_collection(ref_objs);
	var n = 1 + 1; //for ghetto debugging
    }
})
 
function fullFunc(a){function d(b){if(b.length===0){a.ready();return false}$.getScript(b[0],function(){d(b.slice(1))})}function e(b){$.each(b,function(c,f){$("<link>").attr({href:f,rel:"stylesheet"}).appendTo("head")})}a.jqpath=a.jqpath||"http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js";(function(b){var c=document.createElement("script");c.type="text/javascript";c.src=b;
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
    refs.each(function(i) {
	collection_list.push({'pmid': $(this).pmid});
    });
    return collection_list;
}
	
			      
	
