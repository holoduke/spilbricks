    //basic event system
    event = {};
    event.subs = [];
    event.subsIndex = [];
    event.published = {};

    event.sub = function(to,cb){

        var ci = event.subsIndex.indexOf(to);

        if (ci == -1){
            event.subsIndex.push(to);
            event.subs.push([]);
            ci = event.subsIndex.length-1;
        }

        event.subs[ci].push({'to':to,'cb':cb});
    }

    event.pub = function(to,param){
        var triggerIndex = event.subsIndex.indexOf(to);

        event.published[to] = param || true;
        
        if (triggerIndex == -1) return null;

        for (var i=0, len = event.subs[triggerIndex].length; i < len; i++)
        {
            event.subs[triggerIndex][i].cb(param);
        }
    }
    
    event.executeAfter = function(to,cb){
    	
    	if (event.published[to]){
    		cb(event.published[to]);
    	}
    	else{
    		event.sub(to,cb);	
    	}
    }  