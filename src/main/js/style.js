nyc.sr = nyc.sr || {};

nyc.sr.Style = function(){
	this.setCdStyles();
	this.setSrStyles();
	this.buckets = [];
};

nyc.sr.Style.prototype = {
	COLORS: ['rgb(254,237,222)', 'rgb(253,190,133)', 'rgb(253,141,60)', 'rgb(230,85,13)', 'rgb(166,54,3)'],
	SIZES: [16, 8, 4, 2, 1],
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
		var styleIdx;
		$.each(this.buckets, function(i, b){
			if (count >= b[0] && count <= b[1]){
				styleIdx = i;
				return false;
			}
		});
		return styles[styleIdx];
	},
	setSrStyles: function(){
		var me = this, srStyles = [];
		$.each(me.COLORS, function(i, color){
			srStyles.push(
				new ol.style.Style({
					icon: new ol.style.Circle({
						fill: new ol.style.Fill({
							color: color
						})
					}),
					radius: me.SIZES[i],
					stroke: new ol.style.Stroke({
						color: '#000',
						width: 2
					})
				})
			);
		});
		this.srStyles = srStyles;		
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
						color: '#fff',
						width: 3
					})
				})
			);
		});
		this.cdStyles = cdStyles;
	}
};
