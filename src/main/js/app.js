nyc.sr = nyc.sr || {};

nyc.sr.App = function(options){
	this.map = options.map;
	this.view = this.map.getView();
	this.cdChoices = [];
	this.cdTip = options.cdDecorations.cdTip; 
	options.cdDecorations.choices = this.cdChoices;
	this.cdSrc = this.getCds(options);
	this.style = options.style;
	this.mapRadio = options.mapRadio;
	this.dateInput = options.dateInput;
	this.cdSoda = options.cdSoda;
	this.srSoda = options.srSoda;
	this.counter = options.counter;
	
	this.defaultDates();

	this.srLyr = new ol.layer.Vector({opacity: 0});
	this.map.addLayer(this.srLyr);
	
	this.mapRadio.on('change', $.proxy(this.changeMapType, this));
	
};

nyc.sr.App.prototype = {
	map: null,
	view: null,
	cdChoices: null,
	cdTip: null,
	cdSrc: null,
	cdLyr: null,
	srLyr: null,
	style: null,
	mapRadio: null,
	dateInput: null,
	cdCheck: null,
	srTypeCheck: null,
	whereNotMappable: null,
	mapType: 'cd',
	changeMapType: function(type){
		this.mapType = type[0].name;
		this.buildQuery();
	},
	defaultDates: function(){
		var today = new Date(), lastWeek = new Date();
		lastWeek.setDate(lastWeek.getDate() - 7);
		this.minDate = this.dateInput.container.find('#created-date-min');
		this.maxDate = this.dateInput.container.find('#created-date-max');
		this.dateInput.container.find('input').change($.proxy(this.buildQuery, this));
		this.minDate.val(lastWeek.toShortISOString());
		this.maxDate.val(today.toShortISOString()).trigger('change');
	},
	getCds: function(options){		
		var cdSrc = new nyc.ol.source.Decorating(
			{url: options.cdUrl, format: new ol.format.GeoJSON()},
			[options.cdDecorations],
			{nativeProjection: 'EPSG:4326', projection: 'EPSG:3857'}
		);
		cdSrc.on(nyc.ol.source.Decorating.LoaderEventType.FEATURESLOADED, $.proxy(this.gotCds, this));
		return cdSrc;
	},
	gotCds: function(){
		this.cdLyr = new ol.layer.Vector({
			source: this.cdSrc, 
			style: $.proxy(this.style.cdStyle),
			visible: false
		});
		new nyc.ol.FeatureTip(this.map, [{layer: this.cdLyr, labelFunction: this.cdTip}]);
		this.map.addLayer(this.cdLyr);
		this.creatCdCheck();
	},
	creatCdCheck: function(){
		var div = $('<div id="community-districts"></div>');		
		this.cdChoices.sort(function(a, b){
			var aCd = a.sort, bCd = b.sort;
			if (aCd < bCd) return -1;
			if (aCd > bCd) return 1;
			return 0;
		});
		this.cdCheck = new nyc.Check({
			target: div, 
			title: 'Community District',
			choices: this.cdChoices
		});
		this.dateInput.container.after(div);
		div.trigger('create');
		this.cdCheck.on('change', $.proxy(this.buildQuery, this));		
	},
	gotSrTypes: function(csv){
		var div = $('<div id="complaint-types"></div>');		
		var types = [];
		$.each($.csv.toObjects(csv), function(i, typ){
			types.push({
				name: 'complaint_type',
				label: typ.complaint_type,
				value: typ.complaint_type
			});
			return i < 9;
		});
		this.srTypeCheck = new nyc.Check({
			target: div, 
			title: 'Complaint Type',
			choices: types
		});
		if (this.cdCheck){
			this.cdCheck.container.after(div);		
		}else{
			$('#panel').append(div);		
		}
		div.trigger('create');
		this.srTypeCheck.on('change', $.proxy(this.buildQuery, this));
	},
	buildQuery: function(){
		var where = this.and(this.whereNotMappable, this.dateClause());
		//where = this.and(where, this.cdClause());


	},
	dateClause: function(){
		var where = "created_date >= '" + this.minDate.val() + "'";
		where = this.and(where, "created_date >= '" + this.maxDate.val() + "'");
		return where;
	},
	cdClause: function(){
		var cds = this.cdCheck.val();
		if (cds.length){
			var where = 'community_board IN (';
			$.each(cds, function(){
				where += "'" + this.value + "',"
			});
			return where.substr(0, where.length - 1) + ')';			
		}
	},
	and: function(where, more){
		if (more){
			return where + ' AND ' + more;
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
	}
};