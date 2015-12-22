(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var jQuery=require("jquery"),$=require("jquery"),amountScrolled=350;$(window).scroll(function(){$(window).scrollTop()>amountScrolled?$("button.back-to-top").fadeIn(500):$("button.back-to-top").hide()}),$(".port-hover").on("touchstart",function(o){"use strict";var t=$(this);return t.hasClass("touch-hover")?!0:(t.addClass("touch-hover"),$("port-hover").not(this).removeClass("touch-hover"),o.preventDefault(),!1)}),$(".logo-hover").on("touchstart",function(o){"use strict";var t=$(this);return t.hasClass("touch-hover")?!0:(t.addClass("touch-hover"),$("logo-hover").not(this).removeClass("touch-hover"),o.preventDefault(),!1)});

},{"jquery":"jquery"}]},{},[1])


//# sourceMappingURL=app.js.map
