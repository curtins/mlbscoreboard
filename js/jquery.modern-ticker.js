// Modern News Ticker
// Copyright (c) CreativeTier
// contact@CreativeTier.com
(function($) {
	
	// Default settings
	var defaultSettings = {
		effect: "scroll",
		linksEnabled: true,
		pauseOnHover: true,
		autoplay: true,
		feedType: "none",
		feedCount: 5,
		linkTarget: "_blank",
		refresh: "10:00"
	};
	
	// Default effect settings
	var effectSettings = {
		scroll: {
			scrollType: "continuous",
			scrollStart: "inside",
			scrollInterval: 20,
			transitionTime: 500
		},
		fade: {
			displayTime: 4000,
			transitionTime: 300
		},
		type: {
			typeInterval: 10,
			displayTime: 4000,
			transitionTime: 300
		},
		slide: {
			slideDistance: 100,
			displayTime: 4000,
			transitionTime: 350
		}
	};

	// Default feed settings
	var feedSettings = {
		"rss-atom": {
			feedUrl: "",
			loadType: "direct"
		},
		twitter: {
			twitterName: "",
			twitterLoadingFile: "modern-ticker/php/twitter.php"
		}
	};

	var methods = {
		
		// Initializes the ticker
		init: function(options) {
			
			// Create the settings.
			var settings = defaultSettings;
			$.extend(settings, {feedType: options.feedType});
			$.extend(settings, feedSettings[settings.feedType])
			$.extend(settings, {effect: options.effect});
			$.extend(settings, effectSettings[settings.effect]);
			$.extend(settings, options);

			return this.each(function() {
				
				// Declare vars
				var listWidth;
				var newsWidth;
				var playInterval;
				var playing = false;
				var paused = false;
				var transitioning = false;
				var mousingOver = false;
				var firstTime = true;
				var isReady = false;
				var refreshTimeout;
				
				// Get objects
				var ticker = $(this);
				var body = ticker.children(".mt-body");
				var label = body.children(".mt-label");
				var news = body.children(".mt-news");
				var list = news.children("ul");
				var originalNews = list.children("li");
				var controls = body.children(".mt-controls");
				var prevArrow = controls.children(".mt-prev");
				var nextArrow = controls.children(".mt-next");
				var playButton = controls.children(".mt-play");
				
				
				// Prepare layout for scroll
				if (settings.effect == "scroll") ticker.addClass("mt-scroll");
				
				// Position the news
				if (label.length) news.css("left", label.outerWidth(true));
				
				// Set news dimensions
				setNewsWidth();
				news.css("height", ticker.height() - 2 * parseInt(body.css("margin")));
				
				// Update news with when the window is resized
				$(window).resize(setNewsWidth);
				
				
				// Get the positions of the news items
				if (settings.scrollType == "discontinuous") {
					var newsPositions = [];
					
					var c = 0;
					list.children().each(function() {
						newsPositions.push(c);
						c += $(this).outerWidth();
					});
				}
				
				
				// Disable the news links if required
				if (!settings.linksEnabled) list.find("a").removeAttr("href target");
				
				
				// News pause on hover
				if (settings.pauseOnHover)
					news.hover(function() {
						if (isReady) {
							pausePlay();
							mousingOver = true;
						}
					}, function() {
						if (isReady) {
							mousingOver = false;
							resumePlay();
						}
					});
				
				
				if (controls.length) {
					// Arrows behaviour
					prevArrow.mousedown(preventDefault).bind("click", {type: "prev"}, arrowClick);
					nextArrow.mousedown(preventDefault).bind("click", {type: "next"}, arrowClick);
					
					// Play button behaviour
					playButton.mousedown(preventDefault).click(function() {
						if (isReady) {
							if (playing) {
								stopPlay();
								displayPlay();
							} else {
								startPlay();
								displayPause();
							}
						}
					});
				}
				
				
				// Get feed if necessary
				if (settings.feedType == "rss-atom" || settings.feedType == "twitter")
					loadFeed();
				else
					ready();


				function setNewsWidth() {
					var w = body.width();
					if (label.length) w -= label.outerWidth(true);
					if (controls.length) w -= controls.outerWidth(true);
					news.css("width", w);
					newsWidth = w;
				}
				
				function resizeList() {
					listWidth = 0;
					list.children().each(function() {
						listWidth += $(this).outerWidth(true) + 1;
					});
					list.css("width", listWidth);
				}
				
				// Loads and displays the feeds
				function loadFeed() {
					
					pausePlay();

					// Hide the list in case there are default news.
					list.addClass("mt-hide");

					// Show the preloader.
					news.addClass("mt-preloader");
					
					// Remove previous loaded news
					list.children().remove();

					// Reset the original news, if any.
					list.css("margin-left", 0);
					originalNews.css("opacity", "1").removeClass("mt-hide");
					list.append(originalNews);

					switch (settings.feedType) {
						case "rss-atom":
							
							var direct = {
								url: settings.feedUrl + "?" + Math.random(),
								type: "GET",
								dataType: "xml",
								success: function(data) {
									var entries = $(data).find("item");
									var n;
									
									if (settings.feedCount == 0 || entries.length <= settings.feedCount)
										n = entries.length;
									else
										n = settings.feedCount;
									
									for (var i = 0; i < n; i++) {
										var s;
										if (settings.linksEnabled)
											s = "<li><a href='" + $(entries[i]).find("link").text() + "' target='" + settings.linkTarget + "'>" + $(entries[i]).find("title").text() + "</a></li>";
										else
											s = "<li><a>" + $(entries[i]).find("title").text() + "</a></li>";
										
										list.append(s);
									}

									loadComplete();
								}
							};
							
							var n = settings.feedCount == 0 ? -1 : settings.feedCount;
							var process = {
								url: "https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=" + n + "&q=" + settings.feedUrl + "?" + Math.random(),
								type: "GET",
								dataType: "jsonp",
								success: function(data) {
									var entries = data.responseData.feed.entries;
									var n;
									
									if (settings.feedCount == 0 || entries.length <= settings.feedCount)
										n = entries.length;
									else
										n = settings.feedCount;
									
									for (var i = 0; i < n; i++) {
										var s;
										if (settings.linksEnabled)
											s = "<li><a href='" + entries[i].link + "' target='" + settings.linkTarget + "'>" + entries[i].title + "</a></li>";
										else
											s = "<li><a>" + entries[i].title + "</a></li>";
										
										list.append(s);
									}

									loadComplete();
								}
							};
							
							var load = settings.loadType == "process" ? process : direct;
							
							$.ajax(load);
							
							break;
						case "twitter":
							
							$.get(
								settings.twitterLoadingFile,
								{
									name: settings.twitterName,
									count: settings.feedCount
								},
								function(data) {
									data = $.parseJSON(data);

									for (var i = 0; i < data.length; i++) {
										var s;
										if (settings.linksEnabled)
											s = "<li><a href='http://twitter.com/#!/" + data[i].user.id_str + "/status/" + data[i].id_str + "' target='" + settings.linkTarget + "'>" + data[i].text + "</a></li>";
										else
											s ="<li><a>" + data[i].text + "</a></li>";
										
										list.append(s);
									}

									loadComplete();
								}
							);
							
							break;
					}
				}

				function loadComplete() {
					news.removeClass("mt-preloader");
					list.removeClass("mt-hide");

					ready();
				}

				function refresh() {
					if (settings.feedType == "rss-atom" || settings.feedType == "twitter") {
						clearTimeout(refreshTimeout);

						isReady = false;
						loadFeed();
					}
				}

				// The ticker is ready.
				function ready() {
					// Set list width
					resizeList();
					
					// Hide all of the next news if the effect is other than scroll.
					if (settings.effect != "scroll") list.children("li:not(:first)").addClass("mt-hide");

					// Start the autoplay, if enabled.
					if (firstTime) {
						firstTime = false;
						if (settings.autoplay) {
							startPlay();
							if (controls.length) displayPause();
						}
					} else resumePlay();

					show("first");

					if (settings.refresh) refreshTimeout = setTimeout(refresh, convertTime(settings.refresh));

					isReady = true;
				}

				function convertTime(time) {
					var n;

					if (typeof time == "number")
						n = time;
					else {
						var list = time.split(":");
						list.reverse();
						
						n = parseFloat(list[0]);
						if (list[1]) n += parseFloat(list[1]) * 60;
						if (list[2]) n += parseFloat(list[2]) * 3600;
					}

					return n * 1000;
				}

				// Arrows click behaviour
				function arrowClick(event) {
					if (isReady) show(event.data.type);
				}
				
				// Show prev/next news
				function show(type) {
					if (!transitioning) {
						transitioning = true;
						pausePlay();
						
						switch (type) {
							case "first":

								switch (settings.effect) {
									case "scroll":
										
										if (settings.scrollStart == "outside")
											list.css("margin-left", newsWidth);
										
										resumePlay();
										
										break;
									case "fade":
									
										list.children(":first").css({"opacity": 0}).animate({"opacity": 1}, settings.transitionTime, function() {
											resumePlay();
										});
										
										break;
									case "type":
										
										typeText(list.children(":first").css({"opacity": 0}).animate({"opacity": 1}, settings.transitionTime).children("a"));
										
										break;
									case "slide":
										
										list.children(":first").css({"opacity": 0, "margin-left": settings.slideDistance}).animate({"opacity": 1, "margin-left": 0}, settings.transitionTime, function() {
											resumePlay();
										});
										
										break;
								}

								transitioning = false;

								break;
							case "prev":

								switch (settings.effect) {
									case "scroll":
									
										if (settings.scrollType == "discontinuous") {
											
											var index = getNewsIndex();
											var last = newsPositions.length - 1;
											var target;
											
											if (index == -1 || index == 0) {
												list.animate({"margin-left": newsWidth}, settings.transitionTime, function() {
													list.css("margin-left", -listWidth);
													list.animate({"margin-left": -newsPositions[last]}, settings.transitionTime, function() {
														transitioning = false;
													});
												});
											} else {
												target = -newsPositions[index - 1];
												
												list.animate({"margin-left": target}, settings.transitionTime, function() {
													transitioning = false;
												});
											}
											
										} else {
											list.css({"margin-left": -($(list.children(":last")).outerWidth())}).children(":last").prependTo(list);
											list.animate({"margin-left": 0}, settings.transitionTime, function() {
												transitioning = false;
											});
										}
										
										if (controls.length)
											prevArrow.mouseleave(function() {
												resumePlay();
											});
										
										break;
									case "fade":
										
										list.children(":first").animate({"opacity": 0}, settings.transitionTime, function() {
											$(this).addClass("mt-hide");
											list.children(":last").prependTo(list).removeClass("mt-hide").css({"opacity": 0}).animate({"opacity": 1}, settings.transitionTime, function() {
												resumePlay();
											});
											
											transitioning = false;
										});
										
										break;
									case "type":
										
										list.children(":first").animate({"opacity": 0}, settings.transitionTime, function() {
											$(this).addClass("mt-hide");
											typeText(list.children(":last").prependTo(list).removeClass("mt-hide").css({"opacity": 0}).animate({"opacity": 1}, settings.transitionTime).children("a"));
											
											transitioning = false;
										});
										
										break;
									case "slide":
										
										list.children(":first").animate({"opacity": 0}, settings.transitionTime, function() {
											$(this).addClass("mt-hide");
											list.children(":last").prependTo(list).removeClass("mt-hide").css({"opacity": 0, "margin-left": settings.slideDistance}).animate({"opacity": 1, "margin-left": 0}, settings.transitionTime, function() {
												resumePlay();
											});
											
											transitioning = false;
										});
										
										break;
								}

								break;
							case "next":

								switch (settings.effect) {
									case "scroll":
										
										if (settings.scrollType == "discontinuous") {
											
											var index = getNewsIndex();
											var last = newsPositions.length - 1;
											var target;
											
											if (index == last) {
												list.animate({"margin-left": -listWidth}, settings.transitionTime, function() {
													list.css("margin-left", newsWidth);
													list.animate({"margin-left": 0}, settings.transitionTime, function() {
														transitioning = false;
													});
												});
											} else {
												if (index == -1)
													target = 0;
												else
													target = -newsPositions[index + 1];
												
												list.animate({"margin-left": target}, settings.transitionTime, function() {
													transitioning = false;
												});
											}
											
										} else {
											list.animate({"margin-left": -($(list.children(":first")).outerWidth())}, settings.transitionTime, function() {
												list.css("margin-left", 0).children(":first").appendTo(list);
												transitioning = false;
											});
										}
										
										if (controls.length)
											nextArrow.mouseleave(function() {
												resumePlay();
											});
										
										break;
									case "fade":
									
										list.children(":first").animate({"opacity": 0}, settings.transitionTime, function() {
											$(this).addClass("mt-hide").appendTo(list);
											list.children(":first").removeClass("mt-hide").css({"opacity": 0}).animate({"opacity": 1}, settings.transitionTime, function() {
												resumePlay();
											});
											
											transitioning = false;
										});
										
										break;
									case "type":
										
										list.children(":first").animate({"opacity": 0}, settings.transitionTime, function() {
											$(this).addClass("mt-hide").appendTo(list);
											typeText(list.children(":first").removeClass("mt-hide").css({"opacity": 0}).animate({"opacity": 1}, settings.transitionTime).children("a"));
											
											transitioning = false;
										});
										
										break;
									case "slide":
										
										list.children(":first").animate({"opacity": 0}, settings.transitionTime, function() {
											$(this).addClass("mt-hide").appendTo(list);
											list.children(":first").removeClass("mt-hide").css({"opacity": 0, "margin-left": settings.slideDistance}).animate({"opacity": 1, "margin-left": 0}, settings.transitionTime, function() {
												resumePlay();
											});
											
											transitioning = false;
										});
										
										break;
								}

								break;
						}
					}
				}
				
				// Get the index of the current news item
				function getNewsIndex() {
					var p = parseFloat(list.css("margin-left"));
					var t = newsPositions.length;
					
					if (p > 0) {
						return -1;
					} else {
						p = Math.abs(p);
						
						for (var i = 0; i < t - 1; i++) {
							if (p >= newsPositions[i] && p < newsPositions[i + 1])
								return i;
						}
						
						return t - 1;
					}
				}
				
				// Start autoplay
				function startPlay() {
					playing = true;
					
					if (settings.effect == "scroll") {
						
						playInterval = setInterval(function() {
							if (!transitioning) {
								var p = parseFloat(list.css("margin-left"));
								list.css("margin-left", p - 1);
								
								if (settings.scrollType == "discontinuous") {
									if (p < 0 && Math.abs(p) > listWidth)
										list.css("margin-left", newsWidth);
								} else {
									if (p < 0 && Math.abs(p) > $(list.children("li")[0]).outerWidth())
										list.css("margin-left", 0).children(":first").appendTo(list);
								}
							}
						}, settings.scrollInterval);
						
					} else {
						
						playInterval = setInterval(function() {
							show("next");
						}, settings.displayTime);
						
					}
				}
				// Stop autoplay
				function stopPlay() {
					playing = false;
					clearInterval(playInterval);
				}
				// Pause autoplay
				function pausePlay() {
					if (playing) {
						paused = true;
						stopPlay();
					}
				}
				// Resume autoplay
				function resumePlay() {
					if (paused && !mousingOver) {
						startPlay();
						paused = false;
					}
				}
				
				// Type each character of news
				function typeText(item) {
					var text = item.html().split("");
					var c = 0;
					item.html("_");
					
					var typeInterval = setInterval(function() {
						var t = item.html().split("_")[0] + text[c++];
						if (c != text.length) {
							t += "_";
						}
						item.html(t);
						
						if (c == text.length) {
							clearInterval(typeInterval);
							resumePlay();
						}
					}, settings.typeInterval);
				}
				
				// Display pause state on the play button
				function displayPause() {
					playButton.addClass("mt-pause");
				}
				// Display play state on the play button
				function displayPlay() {
					playButton.removeClass("mt-pause");
				}
				
				// Prevent default behaviour
				function preventDefault() {
					return false;
				}

				
				// Saves the pause and resume functions for external use
				ticker.data("pause", pausePlay);
				ticker.data("resume", resumePlay);
				ticker.data("refresh", refresh);
			});
		},
		
		// Pauses the autoplay
		pause: function() {
			
			return this.each(function() {
				$(this).data("pause")();
			});
			
		},
		
		// Resumes the autoplay
		resume: function() {
			
			return this.each(function() {
				$(this).data("resume")();
			});
			
		},

		refresh: function() {

			return this.each(function() {
				$(this).data("refresh")();
			});

		}

	};
	
	
	// Adds the ticker to the jQuery namespace
	$.fn.modernTicker = function(method) {
		
		// Method calling logic
		if (methods[method]) {
		  return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
		  return methods.init.apply(this, arguments);
		} else {
		  $.error( 'Method ' +  method + ' does not exist on jQuery.modernTicker' );
		}
		
	}
	
})(jQuery);