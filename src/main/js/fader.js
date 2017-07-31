nyc.sr = nyc.sr || {};

nyc.sr.layer = {
	fade: function(layer, start, end){
		if (layer && layer.getOpacity() != end){
			var step = (end - start) / 1000;
			var fadeInterval = setInterval(function(){
				layer.setOpacity(layer.getOpacity() + step);
				if (layer.getOpacity() >= end){
					clearInterval(fadeInterval);
				}
			}, 1);
		}
	}
};
