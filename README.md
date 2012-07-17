Heroize
=======

A jQuery plugin making Heros and feature panes easy.

Features
-------- 
* Customizable
* Play/pause toggle
* Jump to pane buttons
* Keeps HTML clear for search engines
* Animated Timer
* Default panel display if Javascript is not enabled
* Slide Transitions

Setting Up
----------
The Heroize plugin relies on div tags with specific classnames to generate the feature panes.

[See the Original Documentation on joelpeterson.com/blog/2011/06/heroize-jquery-plugin/](http://www.joelpeterson.com/blog/2011/06/heroize-jquery-plugin/) or check out sampleusage.html for an example of basic usage


Customization
-------------
The Heroize plugin is highly customizable. You can override the default settings of the plugin by passing parameters

	jQuery('#hero').heroize({
		'heroTransitionSpeed': 700,   //transition time in miliseconds
	    'heroTimeDelay': 8000,		  //panel display length in miliseconds
	    'heroPlayImg': 'play.png',	  //path to custom play button
	    'heroPauseImg': 'pause.png',  //path to custom pause button
	    'heroNextChar': '&gt;'        //Character to use in "Next" button
	});

In addition the included CSS file has been clearly marked to easily configure the 
* height
* width
* fonts
* opacities
* colors
* text bar properties