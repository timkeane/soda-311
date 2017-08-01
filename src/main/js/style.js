nyc.sr = nyc.sr || {};

nyc.sr.Style = function(){
	this.setCdStyles();
	this.setSrStyles();
	this.buckets = [];
};

nyc.sr.Style.prototype = {
	COLORS: ['rgba(254,237,222,.4)', 'rgba(253,190,133,.4)', 'rgba(253,141,60,.4)', 'rgba(230,85,13,.4)', 'rgba(166,54,3,.4)'],
	SIZES: [2, 4, 6, 8, 10],
	nullStyle: new ol.style.Style({}),
	buckets: null,
	cdStyles: null,
	srStyles: null,
	srStyle: function(feature){
		return this.getStyle(this.srStyles, feature.get('sr_count'));
	},
	cdStyle: function(feature){
		return this.getStyle(this.cdStyles, feature.get('sr_count'));
	},
	getStyle: function(styles, count){
		if (count){
			var styleIdx;
			$.each(this.buckets, function(i, b){
				if (count >= b[0] && count <= b[1]){
					styleIdx = i;
					return false;
				}
			});
			return styles[styleIdx];
		}
		return this.nullStyle;
	},
	setSrStyles: function(){
		var me = this, srStyles = [];
		$.each(me.COLORS, function(i, color){
			srStyles.push(
				new ol.style.Style({
					image: new ol.style.Circle({
						radius: me.SIZES[i],
						fill: new ol.style.Fill({
							color: color
						}),
						stroke: new ol.style.Stroke({
							color: 'rgba(166,54,3,' + (((i + 1) / 5) * ((i + 1) / 5)) + ')',
							width: 1
						})
					})
				})
			);
		});
		me.srStyles = srStyles;		
	},
	setCdStyles: function(){
		var cdStyles = [];
		$.each(this.COLORS, function(_, color){
			cdStyles.push(
				new ol.style.Style({
					fill: new ol.style.Fill({
						color: color
					}),
					stroke: new ol.style.Stroke({
						color: 'rgba(255,255,255,0.2)',
						width: 3
					})
				})
			);
		});
		this.cdStyles = cdStyles;
	}
};