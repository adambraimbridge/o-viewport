/* jshint devel: true */

'use strict';
var debug;

function broadcast(eventType, data, target) {
	target = target || document.body;

	if (debug) {
		console.log('o-viewport', eventType, data);
	}

	target.dispatchEvent(new CustomEvent('oViewport.' + eventType, {
		detail: data,
		bubbles: true
	}));
}

function getHeight() {
	return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
}

function getWidth() {
	return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
}

function getSize() {
	return {
		height: getHeight(),
		width: getWidth()
	};
}

function getScrollPosition() {
	var de = document.documentElement;
	var db = document.body;

	// adapted from https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY
	var isCSS1Compat = ((document.compatMode || '') === 'CSS1Compat');

	var ieX = isCSS1Compat ? de.scrollLeft : db.scrollLeft;
	var ieY = isCSS1Compat ? de.scrollTop : db.scrollTop;
	return {
		height: db.scrollHeight,
		width: db.scrollWidth,
		left: window.pageXOffset || window.scrollX || ieX,
		top: window.pageYOffset || window.scrollY || ieY
	};
}

function getOrientation() {
	var orientation = window.screen.orientation || window.screen.mozOrientation || window.screen.msOrientation || undefined;
	if (orientation) {
		return typeof orientation === 'string' ?
			orientation.split('-')[0] :
			orientation.type.split('-')[0];
	} else if (window.matchMedia) {
		return window.matchMedia('(orientation: portrait)').matches ? 'portrait' : 'landscape';
	} else {
		return getHeight() >= getWidth() ? 'portrait' : 'landscape';
	}
}

function detectVisiblityAPI() {
	var hiddenName;
	var eventType;
	if (typeof document.hidden !== 'undefined') {
		hiddenName = 'hidden';
		eventType = 'visibilitychange';
	} else if (typeof document.mozHidden !== 'undefined') {
		hiddenName = 'mozHidden';
		eventType = 'mozvisibilitychange';
	} else if (typeof document.msHidden !== 'undefined') {
		hiddenName = 'msHidden';
		eventType = 'msvisibilitychange';
	} else if (typeof document.webkitHidden !== 'undefined') {
		hiddenName = 'webkitHidden';
		eventType = 'webkitvisibilitychange';
	}

	return {
		hiddenName: hiddenName,
		eventType: eventType
	};
}

function getVisibility() {
	var hiddenName = detectVisiblityAPI().hiddenName;
	return document[hiddenName];
}

module.exports = {
	debug: function() {
		debug = true;
	},
	broadcast: broadcast,
	getSize: getSize,
	getScrollPosition: getScrollPosition,
	getVisibility: getVisibility,
	getOrientation: getOrientation,
	detectVisiblityAPI: detectVisiblityAPI
};
