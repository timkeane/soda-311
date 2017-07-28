nyc.sr = {};

nyc.sr.App = function(map, cdSrc, sodaUrl){
	this.map = map;
	this.cdSrc = cdSrc;
	this.url = sodaUrl;
	this.defaultDates();
	this.getCdsInterval = setInterval($.proxy(this.gotCds, this), 500);
	this.buildQuery();
	map.addLayer(new ol.layer.Vector({source: cdSrc}));
	$('#created-date-min, #created-date-max').change($.proxy(this.buildQuery, this));
};

nyc.sr.App.prototype = {
	BOROS: {1: 'Manhatan', 2: 'Bronx', 3: 'Brooklyn', 4: 'Queens', 5: 'Staten Island'},
	url: null,
	count: {
		$select: "count(x_coordinate_state_plane||''||y_coordinate_state_plane) AS sr_count"
	},
	complaints: {
		$select: 'count(unique_key),complaint_type',
		$group: 'complaint_type',
		$order: 'count_unique_key DESC'
	},
	srs: {},
	defaultDates: function(){
		var today = new Date(), lastWeek = new Date();
		lastWeek.setDate(lastWeek.getDate() - 7);
		$('#created-date-min').val(lastWeek.toISOString().split('T')[0]);
		$('#created-date-max').val(today.toISOString().split('T')[0]);
	},
	getCdDisplay: function(cdNum){
		var cd = cdNum + '';
		return this.BOROS[cd.substr(0, 1)] + ' ' + (1 * cd.substr(1));
	},
	getCdValue: function(cdNum){
		var cd = cdNum + '';
		return cd.substr(1) + ' ' + this.BOROS[cd.substr(0, 1)].toUpperCase();
	},
	gotCds: function(){
		var me = this;
		if (me.cdSrc.getFeatures().length){
			var parent = $('#community-districts .ui-collapsible-content');
			var data = this.cdSrc.getFeatures();
			clearInterval(this.getCdsInterval);
			data.sort(function(a, b){
				var aCd = a.get('BoroCD'), bCd = b.get('BoroCD');
				a.set('cdDisplay', me.getCdDisplay(aCd));
				b.set('cdDisplay', me.getCdDisplay(bCd));
				a.set('community_board', me.getCdValue(aCd));
				b.set('community_board', me.getCdValue(bCd));
				if (aCd < bCd) return -1;
				if (aCd > bCd) return 1;
				return 0;
			});
			this.checkboxes(parent, data, 'cdDisplay', 'community_board');
		}
	},
	getComplaintTypes: function(){
		if (!$('#complaint-types input').length){
			this.complaints.$where = this.srs.$where;
			this.ajax(this.complaints, $.proxy(this.gotComplaintTypes, this));
		}
	},
	checkboxes: function(parent, data, displayField, valueField, limit){
		var chg = $.proxy(this.buildQuery, this), fieldset = $('<fieldset data-role="controlgroup"></fieldset>');
		$.each(data, function(i, row){
			var name = row[displayField] || row.get(displayField);
			var val = row[valueField] || row.get(valueField);
			var id = valueField + i;
			var lbl = $('<label></label>');
			var chk = $('<input type="checkbox">');
			lbl.attr('for', id).html(name);
			chk.attr('id', id)
				.data('soda-field', valueField)
				.data('soda-value', val)
				.change(chg);
			fieldset.append(lbl).append(chk);
			if (limit) return i < limit - 1;
		});
		$(parent).html(fieldset);
		$(parent).find('fieldset').controlgroup({});
	},
	gotComplaintTypes: function(response){
		var parent = $('#complaint-types .ui-collapsible-content');
		var data = $.csv.toObjects(response);
		this.checkboxes(parent, data, 'complaint_type', 'complaint_type', 10);
	},
	buildQuery: function(){
		var where = this.getDateWhere();
		where = this.appendInClause(where, '#community-districts input');
		where = this.appendInClause(where, '#complaint-types input');
		this.srs.$where = where;
		this.srs.$order = '';
		
		console.warn(this.srs);
		
		this.getCount();
		this.getComplaintTypes();
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
		this.count.$where = this.srs.$where;
		this.ajax(this.count, $.proxy(this.gotCount, this));
	},
	excludeNotMappable: function(query){
		query.$where = query.$where || '';
		if (query.$where){
			query.$where += ' AND ';
		}
		query.$where += 'x_coordinate_state_plane IS NOT NULL AND y_coordinate_state_plane IS NOT NULL';
		query.$limit = 50000;
		return query;
	},
	ajax: function(query, callback){
		$.ajax({
			url: this.url,
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

new nyc.Collapsible({target: '#date-ranges', title: 'Created Date', expanded: true}); 
new nyc.Collapsible({target: '#community-districts', title: 'Community District'}); 
new nyc.Collapsible({target: '#complaint-types', title: 'Complaint Types'}); 

var map = new nyc.ol.Basemap({target: $('#map').get(0)});

var cdSrc = new ol.source.Vector({
	format: new ol.format.GeoJSON(),
	url: 'http://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson'
});

nyc.sr.app = new nyc.sr.App(map, cdSrc, 'https://data.cityofnewyork.us/resource/fhrw-4uyv.csv');
