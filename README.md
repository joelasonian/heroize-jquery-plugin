Welcome to the Heroize Repository

1. Setting up - See sampleusage.html for an example of basic usage
2. How to Customize

The Heroize plugin is highly customizable.

You can override the default settings of the plugin by passing parameters

jQuery('#hero').heroize({
	'heroTransitionSpeed': 700,   //transition time in miliseconds
	
    'heroTimeDelay': 8000,		  //panel display length in miliseconds
    
    'heroPlayImg': 'play.png',	  //path to custom play button
    
    'heroPauseImg': 'pause.png',  //path to custom pause button
    
    'heroNextChar': '&gt;'        //Character to use in "Next" button
    
});

In addition the included CSS file has been clearly marked to easily configure the 

height, width, fonts, opacities, colors, text bar properties