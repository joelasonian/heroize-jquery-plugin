/***           
*    _                                   _                    _         
*   (_)                                 | |                  (_)        
*    _  __ _ _   _  ___ _ __ _   _      | |__   ___ _ __ ___  _ _______ 
*   | |/ _` | | | |/ _ \ '__| | | |     | '_ \ / _ \ '__/ _ \| |_  / _ \
*   | | (_| | |_| |  __/ |  | |_| |  _  | | | |  __/ | | (_) | |/ /  __/
*   | |\__, |\__,_|\___|_|   \__, | (_) |_| |_|\___|_|  \___/|_/___\___|
*  _/ |   | |                 __/ |                                     
* |__/    |_|                |___/                                      
* 
*  jQuery Plugin - Heroize
*  Animated Hero/Feature Panel with play/pause, timer, buttons and sliding animation
*  version 0.1  |  2011.06.24
*  author: Joel Peterson | @joelasonian
*  Jump started with Stefan Gabos' jQuery Plugin Boilerplate http://stefangabos.ro
*
***/



(function($) {
    $.fn.heroize = function(method) {
		
        var defaults = {
			 //SETTINGS
			 heroPlayImg: 'play.png',
			 heroPauseImg: 'pause.png',
			 heroTimeDelay: 5000,
			 heroTransistionSpeed: 300,
			 heroNextChar: '&gt;',
			 
			 //VARIABLE INITS
			 heroWidth: 0,	
			 heroHeight: 0,
			 heroTotal: 0,
			 heroPrev: 0,
			 heroTracker: 1,
			 heroCurrent: 1,
			 heroPlaying: true,
			 heroTimerID: 0,
			 heroNumbersPaneOpen: false,
			 heroTextStr: ""
        }

        var settings = {}

        var methods = {
            init : function(options) {
                settings = $.extend({}, defaults, options)
                return this.each(function() {
                    var $element = $(this);
					helpers.remove_default($element);
					helpers.determine_settings($element);
					helpers.position_panes($element);
					helpers.apply_styles($element);
					helpers.init_hero($element);
                });
            }
        }

        var helpers = {
			// function apply_styles
			// @param parent: jQuery reference of DOM object
			// @description Sets up the HTML with Correct DOM elements
			apply_styles: function(parent) {
				
				//PARSE HTML 
				parent.find('[class^="heropane"]').each(function(){
					//ADD ID TO EACH HERO PANE
					$(this).attr('id','hero' + settings.heroTracker);
					//IS THE NEXT ITEM FEATURE TEXT?
					if ($(this).next().hasClass('herotext')){
						//ADD THE TEXT TO STRING AND REMOVE ORIGINAL FROM DOM
						settings.heroTextStr += '<div class="herotext">' + $(this).next().remove().html() + '</div>';
					} else {
						//ACCOUNT FOR EMPTY HERO TEXT
						settings.heroTextStr += '<div class="herotext"></div>';
					}
					settings.heroTracker ++;
				});
				settings.heroTracker = 1;
				//ADD TEXT BAR / HERO TEXT AS PARSED ABOVE
				parent.append('<div class="featblackbar">'+settings.heroTextStr+'</div>');
				
				parent.find('[class^="herotext"]').each(function(){
					//ADD ID TO EACH TEXT ELEMENT
					$(this).attr('id','heroText' + settings.heroTracker)
					settings.heroTracker ++;
				});
				
				//ADD THE BLACK BAR BACKGROUND
				parent.find('[class="featblackbar"]').each(function(){
					$(this).append('<div id="herocontrols" class="featcontrols"></div>');
					$(this).append('<div class="featbarbg transparent"></div>');
				})
				//ADD LOADER/ PLAYPAUSE BUTTON / NEXT & ITEM BUTTON CONTAINER
				parent.find('#herocontrols').each(function(){
					$(this).append('<div id="featloader"><div id="loader"></div></div>');
					$(this).append('<div id="playpause"><img src="'+settings.heroPauseImg+'" width="6" height="7" /></div><div class="featnext">'+settings.heroNextChar+'</div><div id="heroitemwrap"></div>');
				});	
				//ADD FEAT ITEM BUTTONS
				for(var i=1; i<=settings.heroTotal; i++){
					parent.find('#heroitemwrap').append('<div class="featitem" id="featitem'+i+'">'+i+'</div>');
				}	
            },
			
			// function init_hero
			// @param parent: jQuery reference of DOM object
			// @description Sets up actions and to events
			init_hero: function(parent) {
				parent.find('#feature' + settings.heroCurrent).css('left','0');
				//APPLY CLASSES AND HOVER ACTIONS TO HERO ITEM AND NEXT BUTTONS
				parent.find('.featnext, .featitem').each(function(){
					$(this).addClass('transparent');
					$(this).hover(function(){
						helpers.open_numbers_pane(parent);
						$(this).removeClass('transparent');
					},
					function(){
						helpers.close_numbers_pane(parent);
						if ($(this).attr('id') != parent.find('#featitem'+settings.heroCurrent).attr('id')){
							$(this).addClass('transparent');
						}
					});
				});
				//PLAY/PAUSE TOGGLE ACTIONS
				parent.find('#playpause').click(function() {
					if (settings.heroPlaying) {
						parent.find('#playpause img').attr("src",settings.heroPlayImg);
						settings.heroPlaying = false;
						parent.find('#loader').stop();
					} else {
						parent.find('#playpause img').attr("src",settings.heroPauseImg);
						settings.heroPlaying = true;
						helpers.loader_it_up(parent);
					}
				});
				//NEXT BUTTON ACTIONS
				parent.find('.featnext').click(function(){
						if (settings.heroPlaying) {
							parent.find('#loader').stop();
							helpers.next_feat(parent);
							helpers.loader_it_up(parent);
						} else {
							helpers.next_feat(parent);
						}	
				});	
				//HERO ITEM BUTTON ACTIONS
				for(var i=1;i<=settings.heroTotal;i++){
					helpers.go_to_feat(parent, i);
				}
				//INITIALIZE
				helpers.apply_current_feature(parent, settings.heroCurrent);
				helpers.animate_panels(parent, 0);
				helpers.loader_it_up(parent);
			},
			
			// function open_numbers_pane
			// @param parent: jQuery reference of DOM object
			// @description Function that opens the panel that contains the hero item buttons
			open_numbers_pane: function(parent){
				clearTimeout ( settings.heroTimerID );
				if (!settings.heroNumbersPaneOpen){
					settings.heroNumbersPaneOpen = true;
					parent.find('#heroitemwrap').slideDown('fast');
				}
			},
			
			// function close_numbers_pane
			// @param parent: jQuery reference of DOM object
			// @description Function that calls the close panel after 800ms
			close_numbers_pane: function(parent){
				if (settings.heroNumbersPaneOpen){
					settings.heroTimerID = setTimeout(function(){helpers.do_close(parent);}, 800);
				}
			},
			
			// function do_close
			// @param parent: jQuery reference of DOM object
			// @description Function that closes the panel that contains the hero item buttons
			do_close: function(parent) {
				settings.heroNumbersPaneOpen = false;
				parent.find('#heroitemwrap').slideUp('fast');
			},
			
			// function loader_it_up
			// @param parent: jQuery reference of DOM object
			// @description recursive function that animates the loading line, and calls next hero at completion
			loader_it_up: function(parent){
				parent.find('#loader').css('width','0%');
				parent.find('#loader').animate({width: '100%'}, settings.heroTimeDelay, "linear", function(){ 
					  helpers.next_feat(parent);
					  helpers.loader_it_up(parent);
				})
			},
			
			// function apply_current_feature
			// @param parent: jQuery reference of DOM object
			// @param newfeature: integer identifying the hero item button to activate
			// @description resets all hero item buttons to rest state, then applies active state to current
			apply_current_feature: function(parent, newfeature){
				//RESET ALL FEATURE ITEMS
				parent.find('[id^="featitem"]').addClass('transparent');
				//APPLY BACK TO CURRENT
				parent.find('#featitem'+newfeature).removeClass('transparent');
			},
			
			// function animate_panels
			// @param parent: jQuery reference of DOM object
			// @param prevfeat: integer identifying the previous hero pane.  If 0 than initializing.
			// @description performs the animation of sliding the heros into their desired location
			animate_panels : function(parent, prevfeat){
				if (prevfeat != 0 ){
					parent.find('#hero' + prevfeat).animate({'left':'-='+settings.heroWidth},settings.heroTransistionSpeed,function(){
						parent.find('#hero' + prevfeat).css('left',settings.heroWidth);	
					});
					parent.find('#heroText'+prevfeat).hide();
				}
				parent.find('#hero' + settings.heroCurrent).animate({'left':'0px'},settings.heroTransistionSpeed);	
				parent.find('#heroText'+settings.heroCurrent).fadeIn();
			},
			
			// function determine_settings
			// @param parent: jQuery reference of DOM object
			// @description obtains and sets settings based on DOM and CSS properties.
			determine_settings: function(parent){
				settings.heroTotal = parent.find('[class^="heropane"]').size();
				settings.heroWidth = parent.css('width');
				settings.heroHeight = parent.css('height');	
			},
			
			// function position_panes
			// @param parent: jQuery reference of DOM object
			// @description on init moves all heros out of viewable area preparing them for animation.
			position_panes: function(parent){
				parent.find('.heropane').css('left',settings.heroWidth);
				parent.find('.heropane').css('display','block');
			},
			
			// function remove_default
			// @param parent: jQuery reference of DOM object
			// @description Removes the DOM element with the panel that is intended to appear when the plugin doesn't load.
			remove_default: function(parent){
				parent.find('#defaulthero').empty();
				parent.find('#defaulthero').remove();
			},
			
			// function remove_default
			// @param parent: jQuery reference of DOM object
			// @param targetHero: integer identifying the hero we want to go to
			// @description Attaches the actions to the hero item buttons required to activate the desired hero
			go_to_feat: function(parent, targetHero){
				parent.find('#featitem'+targetHero).click(function(){
					if(targetHero != settings.heroCurrent){
						settings.heroPrev = settings.heroCurrent;
						settings.heroCurrent = targetHero;
						helpers.apply_current_feature(parent, settings.heroCurrent);
						if (settings.heroPlaying) {
							parent.find('#loader').stop();
							helpers.animate_panels(parent, settings.heroPrev);
							helpers.loader_it_up(parent);
						} else {
							helpers.animate_panels(parent, settings.heroPrev);
						}	
					}
				});
			},
			
			// function next_feat
			// @param parent: jQuery reference of DOM object
			// @description performs the action of moving to the next hero. Loops back to 1 if on last hero.
			next_feat: function (parent){
				var prevfeat = settings.heroCurrent;
				settings.heroCurrent ++;
				if (settings.heroCurrent > settings.heroTotal){settings.heroCurrent = 1;}
				helpers.apply_current_feature(parent, settings.heroCurrent);
				helpers.animate_panels(parent, prevfeat);
			}
        }

        // if a method as the given argument exists
        if (methods[method]) {

            // call the respective method
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));

        // if an object is given as method OR nothing is given as argument
        } else if (typeof method === 'object' || !method) {

            // call the initialization method
            return methods.init.apply(this, arguments);

        // otherwise
        } else {

            // trigger an error
            $.error( 'Method "' +  method + '" does not exist in Heroize plugin!');
        }
    }

})(jQuery);