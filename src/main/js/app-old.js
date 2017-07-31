nyc.sr = {};

nyc.sr.App = function(options){
	this.map = options.map;
	this.cdSrc = options.cdSrc;

	this.defaultDates();
	this.createPolygonStyles();
	this.getCdsInterval = setInterval($.proxy(this.gotCds, this), 500);
	this.buildQuery();
	this.cdLyr = new ol.layer.Vector({source: cdSrc, style: $.proxy(this.style.cdStyle), opacity: 0});
	this.srLyr = new ol.layer.Vector({opacity: 0});
	map.addLayer(this.cdLyr);
	map.addLayer(this.srLyr);
	new nyc.ol.FeatureTip(map, [{layer: this.cdLyr, labelFunction: this.cdTip}])
	$('#created-date-min, #created-date-max').change($.proxy(this.buildQuery, this));
	mapType.on('change', $.proxy(this.changeMapType, this));
};

nyc.sr.App.prototype = {
	BOROCODES: {MANHATTAN: 1, BRONX: 2, BROOKLYN: 3, QUEENS: 4, STATEN: 5},
	BOROS: ['Manhattan', 'Bronx', 'Brooklyn', 'Queens', 'Staten Island'],
	COLORS: ['rgb(254,237,222)', 'rgb(253,190,133)', 'rgb(253,141,60)', 'rgb(230,85,13)', 'rgb(166,54,3)'],
	STYLES: {nullStyle: new ol.style.Style({})},
	url: null,
	complaints: {	
		$select: 'count(unique_key) AS sr_count, complaint_type',
		$group: 'complaint_type',
		$order: 'sr_count DESC'
	},
	srsByLocation: {
		$select: 'count(unique_key) AS sr_count, x_coordinate_state_plane AS x, y_coordinate_state_plane AS y',
		$group: 'x, y'
	},
	srsByCd: {
		$select: 'count(unique_key) AS sr_count, community_board',
		$group: 'community_board'		
	},
	changeMapType: function(type){
		this.showSrLocations = type[0].name == 'point';
		this.buildQuery();
	},
	cdTip: function(){
		var cd = '<b>' + this.get('cdDisplay') + '</b>';
		var count = this.get('sr_count');
		if (!isNaN(count)) cd += ('<br>' + count + ' Service Requests');
		return {text: cd};
	},

	buildQuery: function(){
		var where = this.getDateWhere();
		where = this.appendInClause(where, '#community-districts input');
		where = this.appendInClause(where, '#complaint-types input');
		this.srsByLocation.$where = where;
		this.getCount();
		this.getComplaintTypes();
		this.getSrs();
	},
	getBreaks: function(counts){
		var min  = Number.MAX_VALUE, max = -1;
		$.each(counts, function(){
			var c = this.sr_count * 1;
			if (c < min) min = c;
			if (c > max) max = c;
		});
		var delta = max - min;
		var fifth = Math.round(delta / 5);
		var breaks = [[min, min + fifth]];
		for (var i = 1; i < 4; i++){
			breaks.push([breaks[i - 1][1], breaks[i - 1][1] + fifth]);
		}
		breaks.push([max - fifth, max]);
		return breaks;
	},
	getSrs: function(){
		if (this.showSrLocations){
			this.getSrsByLocation();
		}else{
			this.getSrsByCd();
		}
	},
	getSrsByCd: function(){
		this.fade(this.cdLyr, .4, 0);
		this.srsByCd.$where = this.srsByLocation.$where;
		this.ajax(this.srsByCd, $.proxy(this.gotSrsByCd, this));
	},
	gotSrsByCd: function(response){
		var me = this;
		if (me.cdsSorted){
			var srsByCd = $.csv.toObjects(response)
			var breaks = me.getBreaks(srsByCd);
			$.each(me.cdSrc.getFeatures(), function(){
				this.set('sr_count', 0);
				this.setStyle(me.STYLES.nullStyle);
			});
			$.each(srsByCd, function(){
				var sodaCd = this.community_board.split(' ');
				var count = this.sr_count;
				var fid = me.BOROCODES[sodaCd[1]] + sodaCd[0];
				var cd = me.cdSrc.getFeatureById(fid);
				cd.set('sr_count', count);
				cd.setStyle(me.getStyle(count, breaks, 'polygon'));
			});
			this.fade(this.cdLyr, 0, .4);
		}else{
			setTimeout(function(){
				me.gotSrsByCd(response);
			}, 200);
		}
	},
	fade: function(layer, start, end){
		if (layer && layer.getOpacity() != end){
			var step = (end - start) / 5;
			var fadeInterval = setInterval(function(){
				layer.setOpacity(layer.getOpacity() + step);
				if (layer.getOpacity() >= end){
					clearInterval(fadeInterval);
				}
			}, 100);
		}
	},
	getStyle: function(count, breaks, type){
		var styleIdx;
		$.each(breaks, function(i, b){
			if (count >= b[0] && count <= b[1]){
				styleIdx = i;
				return false;
			}
		});
		return this.STYLES[type][styleIdx];
	},
	getSrsByLocation: function(){
		var me = this;
		var srSrc = new ol.source.Vector({loader: new nyc.ol.source.CsvPointFeatureLoader({
			url: this.sodaUrl + '?' + $.param(this.srsByLocation),
			projection: 'EPSG:2263',
			xCol: 'x',
			yCol: 'y'
		})});
		srSrc.once('addfeature', function(){
			me.fade(me.srLyr, 0, 1);
		});
		me.srLyr.setSource(srSrc);
	},
	appendInClause: function(where, selector){
		var all = $(selector), checked = $(selector + ':checked');
		if (checked.length && all.length > checked.length){
			where += ' AND ' + all.data('soda-field') + ' IN (';
			$.each(checked, function(){
				where += ("'" + $(this).data('soda-value') + "',");
			});
			where = where.substr(0, where.length - 1) + ')';
		}
		return where;
	},
	getDateWhere: function(){
		var createdDateMin = $('#created-date-min').val();
		var createdDateMax = $('#created-date-max').val();
		if (!createdDateMin){
			alert('From date required');
			return;
		}
		var where = "created_date>=" + "'" + createdDateMin + "'";
		if (createdDateMax){
			where += ' AND ';
			where += ("created_date<=" + "'" + createdDateMax + "'");
		}
		return where;
	},
	getCount: function(){
		this.count.$where = this.srsByLocation.$where;
		this.ajax(this.count, $.proxy(this.gotCount, this));
	},
	excludeNotMappable: function(query){
		query.$where = query.$where || '';
		if (query.$where){
			query.$where += ' AND ';
		}
		query.$where += 'x_coordinate_state_plane IS NOT NULL AND y_coordinate_state_plane IS NOT NULL';
		query.$where += " AND community_board NOT IN ('QNA','Unspecified MANHATTAN','Unspecified BRONX','Unspecified BROOKLYN','Unspecified QUEENS','Unspecified STATEN ISLAND')";
		query.$limit = 50000;
		return query;
	},
	ajax: function(query, callback){
		$.ajax({
			url: this.sodaUrl,
			method: 'GET',
			data: this.excludeNotMappable(query),
			success: callback
		});
	},
	gotCount: function(response){
		var me = this;
		if (me.countInterval) clearInterval(me.countInterval);
		var start = $('#record-count span').html().replace(/,/, '') * 1;
		var end = $.csv.toObjects(response)[0].sr_count * 1;
		var count = start;
		var step = (end - start) / 1000;
		this.countInterval = setInterval(function(){
			count = Math[step > 0 ? 'ceil' : 'floor'](count + step);
			if ((step > 0 && count >= end) || (step < 0 && count <= end)){
				clearInterval(me.countInterval);
				delete this.countInterval;
				count = end;
			}
			nyc.util.formatNumberHtml({
				elements: $('#record-count span').html(count)
			});
		}, 1);
	}
};

