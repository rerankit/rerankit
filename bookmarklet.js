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
 
// These are the styles, scripts and callbacks we include in our bookmarklet:
window.bookmarklet({
 
    css : [],
    js  : [],    
//	jqpath : 'myCustomjQueryPath.js', <-- option to include your own path to jquery
    ready : function(){
	$('body').prepend("<div id='console'></div>");
	con = $('#console');
	con.append('<p>hello?</p>');
	// The meat of your jQuery code goes here
	parse();
 
    }
})
 
function fullFunc(a){function d(b){if(b.length===0){a.ready();return false}$.getScript(b[0],function(){d(b.slice(1))})}function e(b){$.each(b,function(c,f){$("<link>").attr({href:f,rel:"stylesheet"}).appendTo("head")})}a.jqpath=a.jqpath||"http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js";(function(b){var c=document.createElement("script");c.type="text/javascript";c.src=b;
c.onload=function(){e(a.css);d(a.js)};
document.body.appendChild(c)
})(a.jqpath)};

var ref_objs = {}

var parse = function() {
    var references = $('.rprt');
    references.each(function(index) {
	con.append($(this).find('.rprtid dd').text())
    });
    //con.append(references);
    
};
