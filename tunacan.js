//set main namespace
goog.provide('tunacan');

// entry point
tunacan.start = function() {
	common.init();	
};

//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('tunacan.start', tunacan.start);