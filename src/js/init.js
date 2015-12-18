// TODO: put initialization logic here
var jQuery = require("jquery");
var $ = require("jquery");


var amountScrolled = 350;

$(window).scroll(function() {
	if ( $(window).scrollTop() > amountScrolled ) {
		$('button.back-to-top').fadeIn(500);
	} else {
		$('button.back-to-top').hide();
	}
});


$('ul li.has-children').on("touchstart", function (e) {
'use strict'; //satisfy code inspectors
var link = $(this); //preselect the link
if (link.hasClass('hover')) {
    return true;
 }
else {
   link.addClass('hover');
   $('ul > li').not(this).removeClass('hover');
   e.preventDefault();
   return false; //extra, and to make sure the function has consistent return points
  }
});

$('.port-hover').on("touchstart", function (e) {
'use strict'; //satisfy code inspectors
var link = $(this); //preselect the link
if (link.hasClass('touch-hover')) {
    return true;
 }
else {
   link.addClass('touch-hover');
   $('port-hover').not(this).removeClass('touch-hover');
   e.preventDefault();
   return false; //extra, and to make sure the function has consistent return points
  }
});
