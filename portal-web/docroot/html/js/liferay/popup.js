(function($){
	$.Popup = function(options) {
		return $.Popup.open(options);
	};

	$.Popup.extendNativeFunctionObject({
		close: function(link) {
			jQuery(link).parents(".popup:first").remove();

			var jModal = jQuery("#alert-messages .modal:last");

			if (jModal.length) {
				jModal.before(jQuery("#alert-messages .alert-background"));
			}
			else {
				var jBg = jQuery("#alert-messages .alert-background");

				jBg.fadeTo("normal", 0, function() {
					jBg.remove();
				});

				jQuery(window).unbind("resize", $.Popup.center);
				jQuery(window).unbind("resize", $.Popup.resize);
				jQuery(window).unbind("scroll", $.Popup.center);
			}
		},
		
		count: function() {
			return jQuery(".popup").length;
		},
		
		open: function(options) {
			/*
			 * OPTIONS:
			 * modal (boolean) - show shaded background
			 * message (string) - default HTML to display
			 * noCenter (boolean) - prevent re-centering
			 * height (int) - starting height of message box
			 * width (int) - starting width of message box
			 * onClose (function) - executes after closing
			 */

			if (!options) options = new Object();

			var modal = options.modal;
			var myMessage = options.message;
			var msgHeight = options.height;
			var msgWidth = options.width;
			var noCenter = options.noCenter;
			var title = options.title;
			var onClose = options.onClose;

			var jAlertMsgs = jQuery("#alert-messages");

			if (!jAlertMsgs.length) {
				jQuery("body").append("<div id='alert-messages' style='position:absolute; top:0; left:0; z-index:" + ZINDEX.ALERT + "'></div>");
				jAlertMsgs = jQuery("#alert-messages");
			}


			jAlertMsgs.append(
				"<div class='popup " + (modal ? "modal" : "") + "' style='position:absolute; top:0; left:0;'>" +
					"<div class='popup-inner'>" +
						"<div class='popup-header'>" +
							"<span class='popup-title'>" + (title || "") + "</span>" +
							"<img class='popup-close' src='" + themeDisplay.getPathThemeImages() + "/portlet/close.png'/>" +
							"<div style='clear:both'></div>" +
						"</div>" +
						"<div class='popup-message'></div>" +
					"</div>" +
				"</div>");

			var jPopup = jAlertMsgs.find(".popup:last");
			var jMessage = jPopup.find(".popup-message");

			jPopup.find(".popup-close").click(function() {
				$.Popup.close(this);
			});
			
			if (onClose != null) {
				jPopup.find(".popup-close").click(onClose);
			}

			jPopup[0].alertOptions = options;

			jMessage.append(myMessage || "<div class=\"loading-animation\"></div>");

			if (msgHeight) {
				jMessage.css(jQuery.browser.msie ? "height" : "min-height", msgHeight + "px");
			}

			if (msgWidth) {
				jPopup.css("width", msgWidth + "px");
			}
			
			jPopup.mousedown(function() {
				if (this != jQuery("#alert-messages .popup:last")[0]) {
					jQuery("#alert-messages").append(this);
				}
			});

			var jBg = jAlertMsgs.find(".alert-background");

			if (modal) {
				if (jBg.length) {
					jPopup.before(jBg[0]);
				}
				else {
					jPopup.before("<div class='alert-background' style='position:absolute; top:0; left:0'></div>");
					jBg = jAlertMsgs.find(".alert-background");
					jBg.css({display: "none", opacity: 0});
				}
			}
			Liferay.Util.setSelectVisibility("hidden");
			Liferay.Util.setSelectVisibility("visible", jPopup[0]);

			if (jAlertMsgs.find(".popup").length == 1) {
				jQuery(window).resize($.Popup.center);
				jQuery(window).resize($.Popup.resize);
				jQuery(window).scroll($.Popup.center);
			}

			$.Popup.resize();
			jBg.fadeTo("normal", 0.5);
			
			if (false) {
				jPopup.Draggable({
					handle: jPopup.find(".popup-header")[0],
					zIndex: ZINDEX.ALERT + 1
				});
			}
			else {
				jPopup.lDrag({
					handle: jPopup.find(".popup-header")[0]
				});
			}

			if (noCenter) {
				$.Popup.center();
			}
			else {
				$.Popup.center(msgHeight, msgWidth);
			}

			Liferay.Util.addInputType(jPopup[0]);
			window.focus();

			return jMessage[0];
		},

		iframe : function(url, options) {
			var msgHeight = options.height;
			var msgWidth = options.width;
			var message = $.Popup.open(options);
			var iframe = document.createElement("iframe");

			message.height = "";
			iframe.src = url;
			iframe.frameBorder = 0;
			if (msgWidth) iframe.style.width = "100%";

			message.appendChild(iframe);
			if (!options.noCenter) {
				$.Popup.center(msgHeight, msgWidth);
			}

			return message;
		},

		center : function(height, width) {
			var jPopup = jQuery("#alert-messages .popup:last");

			if (!jPopup[0].alertOptions.noCenter) {
				jPopup.css({
					top: (Viewport.scroll().y + (Viewport.frame().y/2 - jPopup.height()/2)) + "px",
					left: (Viewport.scroll().x + (Viewport.frame().x/2 - jPopup.width()/2)) + "px"
				});
			}
		},

	    resize: function() {
			jQuery("#alert-messages .alert-background").css({
				height: Viewport.page().y + "px",
				width: Viewport.page().x + "px"
			});
	    },

	    resizeIframe: function(options) {
	    	if ($.Popup.message && options) {
	    		var iframe = $.Popup.message.getElementsByTagName("iframe")[0];
				var loading = jQuery.getOne(".loading-animation", $.Popup.message);

				if (loading) {
					loading.parentNode.removeChild(loading);
				}

	    		if (iframe) {
		    		if (options.height) {
		    			iframe.height = options.height;
		    		}

		    		if (options.width) {
		    			iframe.width = options.width;
		    		}
	    		}
	    	}

	    	$.Popup.resize();
	    }
	});
})(Liferay);