nyc.sr.Counter = function(target){
	this.target = $(target);
};

nyc.sr.Counter.prototype = {
	interval: null,
	count: function(countTo){
		var me = this, target = this.target;
		if (me.interval) clearInterval(me.interval);
		var start = $('#record-count span').html().replace(/,/, '') * 1;
		var end = countTo;
		var count = start;
		var step = (end - start) / 1000;
		this.interval = setInterval(function(){
			count = Math[step > 0 ? 'ceil' : 'floor'](count + step);
			if ((step > 0 && count >= end) || (step < 0 && count <= end)){
				clearInterval(me.interval);
				delete this.interval;
				count = end;
			}
			nyc.util.formatNumberHtml({
				elements: target.html(count)
			});
		}, 1);
	}
};
