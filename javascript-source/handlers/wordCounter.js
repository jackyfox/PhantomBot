(function () {

  /**
   * @event command
   */
    $.bind('command', function (event) {
        var sender = event.getSender(),
            command = event.getCommand(),
            args = event.getArgs(),
            action = args[0],
            subAction = args[1];

        	/**
             * @commandpath wordcounter [option] - Configures various option for the wordcounter
             */
        if (command.equalsIgnoreCase('wordcounter')) {
        	if (!$.isAdmin(sender)) {
        		$.say($.whisperPrefix(sender) + $.adminMsg);
        		return;
        	}

        	if (!action) {
        		$.say($.whisperPrefix(sender) + $.lang.get('wordcounter.usage'));
        		return;
        	}

        	/**
             * @commandpath wordcounter [add] [word] - Adds a word that will be counted every time someone says it
             */
        	if (action.equalsIgnoreCase('add')) {
        		if (!subAction) {
        			$.say($.whisperPrefix(sender) + $.lang.get('wordcounter.add.usage'));
        			return;
        		}

        		subAction = subAction.replace(action, '');
        		$.inidb.set('wordCounter', subAction, 0);
        		$.say(subAction + $.lang.get('wordcounter.added'));
        	}

        	/**
             * @commandpath wordcounter [remove] [word] - Removes the given word which will no longer be counted every time someone says it
             */
        	if (action.equalsIgnoreCase('remove')) {
        		if (!subAction) {
        			$.say($.whisperPrefix(sender) + $.lang.get('wordcounter.remove.usage'));
        			return;
        		} else if (!$.inidb.exists('wordCounter', subAction)) {
        			$.say($.whisperPrefix(sender) + $.lang.get('wordcounter.err.404'));
        			return;
        		}

        		subAction = subAction.replace(action, '');
        		$.inidb.del('wordCounter', subAction);
        		$.say(subAction + $.lang.get('wordcounter.removed'));
        	}
        }

        /**
        * @commandpath [count] [word] - Tells you how many times that word as been said in chat.
        */
        if (command.equalsIgnoreCase('count')) {
        	if (!$.inidb.exists('wordCounter', action.toLowerCase())) {
        		$.say($.whisperPrefix(sender) + $.lang.get('wordcounter.err.404'));
        		return;
        	}

        	$.say($.lang.get('wordcounter.count', action, $.inidb.get('wordCounter', action.toLowerCase())));
        }
    });
     

    /**
    * @event ircChannelMessage
    */
    $.bind('ircChannelMessage', function (event) {
    	var message = event.getMessage().toLowerCase(),
    	    keys = $.inidb.GetKeyList('wordCounter', ''),
    	    word,
    	    key;

    	if ($.bot.isModuleEnabled('./handlers/wordCounter.js')) {
    		for (i in keys) {
    			key = keys[i].toLowerCase();
    		    word = new RegExp('\\b' + key + '\\b', 'g');
    		}

    		if (word.test(message)) {
    			$.consoleDebug('inidb incr' + key + ' 1 in word counter');
    		    $.inidb.incr('wordCounter', key, 1);
    		}
    	}
    });

    /**
    * @event initReady
    */
    $.bind('initReady', function () {
        if ($.bot.isModuleEnabled('./handlers/wordCounter.js')) {
            $.registerChatCommand('./handlers/wordCounter.js', 'wordcounter', 1);
            $.registerChatCommand('./handlers/wordCounter.js', 'count', 7);
        }
    });
})();
