nyc.sr = nyc.sr || {};

nyc.sr.App = function(options){
	this.map = options.map;
	this.view = this.map.getView();
	this.whereNotMappable = options.whereNotMappable;
	this.cdChoices = [];
	options.cdDecorations.choices = this.cdChoices;
	this.cdSrc = this.getCds(options);
	this.style = options.style;
	this.legend = options.legend.container.find('.legend');
	this.mapRadio = options.mapRadio;
	this.dateInput = options.dateInput;
	this.sodaTextarea = options.sodaTextarea;
	this.cdSoda = options.cdSoda;
	this.srSoda = options.srSoda;
	this.buckets = options.buckets;
	
	this.defaultDates();

	this.srLyr = new ol.layer.Vector({style: $.proxy(this.style.srStyle, this.style)});
	this.map.addLayer(this.srLyr);
	new nyc.ol.FeatureTip(this.map, [{layer: this.srLyr, labelFunction: this.tip}]);
	
	this.mapRadio.on('change', $.proxy(this.changeMapType, this));

	this.initLegends();
	this.runFirstQuery();
};

nyc.sr.App.prototype = {
	map: null,
	view: null,
	cdChoices: null,
	cdSrc: null,
	cdLyr: null,
	srLyr: null,
	cdLeg: null,
	srLeg: null,
	style: null,
	mapRadio: null,
	dateInput: null,
	cdCheck: null,
	srTypeCheck: null,
	whereNotMappable: null,
	mapType: 'cd',
	initLegends: function(){
		this.cdLeg = new nyc.BinLegend(
			'cd-leg',
			nyc.BinLegend.SymbolType.POLYGON,
			nyc.BinLegend.BinType.RANGE_NUMBER
		);
		this.srLeg = new nyc.BinLegend(
			'sr-leg',
			nyc.BinLegend.SymbolType.POINT,
			nyc.BinLegend.BinType.RANGE_NUMBER
		);
	},
	runFirstQuery: function(){
		if (this.cdSrc.getFeatures().length){
			this.sodaQuery();
		}else{
			var me = this;
			setTimeout(function(){
				me.runFirstQuery();
			}, 200);
		}
	},
	changeMapType: function(type){
		this.mapType = type[0].name;
		this.sodaQuery();
	},
	defaultDates: function(){
		var today = new Date(), lastWeek = new Date();
		lastWeek.setDate(lastWeek.getDate() - 7);
		this.minDate = this.dateInput.container.find('#created-date-min');
		this.maxDate = this.dateInput.container.find('#created-date-max');
		this.dateInput.container.find('input').change($.proxy(this.sodaQuery, this));
		this.minDate.val(lastWeek.toShortISOString());
		this.maxDate.val(today.toShortISOString());
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
			style: $.proxy(this.style.cdStyle, this.style)
		});
		new nyc.ol.FeatureTip(this.map, [{layer: this.cdLyr, labelFunction: this.tip}]);
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
		this.cdCheck.on('change', $.proxy(this.sodaQuery, this));		
	},
	gotSrTypes: function(data){
		var div = $('<div id="complaint-types"></div>');		
		var types = [];
		$.each(data, function(i, typ){
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
		this.sodaTextarea.container.before(div);		
		div.trigger('create');
		this.srTypeCheck.on('change', $.proxy(this.sodaQuery, this));
	},
	sodaQuery: function(){
		var where = this.and(this.whereNotMappable, this.dateClause()), soda, callback;
		where = this.and(where, this.inClause('community_board', this.cdCheck));
		where = this.and(where, this.inClause('complaint_type', this.srTypeCheck));
		if (this.mapType == 'cd'){
			soda = this.cdSoda;
			callback = $.proxy(this.updateCdLayer, this);
		}else{
			soda = this.srSoda;
			callback = $.proxy(this.updateSrLayer, this);
		}
		$('#loading').fadeIn();
		soda.execute({where: where, callback: callback});
		this.sodaTextarea.container.find('textarea').html(soda.getUrlAndQuery());
	},
	dateClause: function(){
		var where = "created_date >= '" + this.minDate.val() + "'";
		where = this.and(where, "created_date <= '" + this.maxDate.val() + "'");
		return where;
	},
	inClause: function(sodaCol, checkboxes){
		if (checkboxes && checkboxes.val().length){
			var where = sodaCol + ' IN (';
			$.each(checkboxes.val(), function(){
				where += "'" + this.value + "',";
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
	updateCdLayer: function(data){
		var buckets = this.buckets.build(data, this.cdSrc);
		this.style.buckets = buckets.buckets;
		this.legend.html(this.cdLeg.html('Service Requests by<br>Community District', buckets.breaks));
		$(this.mapRadio.inputs[1]).prop('disabled', buckets.total > 50000).checkboxradio('refresh');
		this.srLyr.setVisible(false);
		this.cdLyr.setVisible(true);
	},
	updateSrLayer: function(data){
		var me = this;
		var src = new nyc.ol.source.Decorating(
			{loader: new nyc.ol.source.CsvPointFeatureLoader({
				url: me.srSoda.getUrlAndQuery(),
				projection: 'EPSG:2263',
				fidCol: 'id',
				xCol: 'x_coordinate_state_plane',
				yCol: 'y_coordinate_state_plane'
			})},
			[],
			{nativeProjection: 'EPSG:2263', projection: 'EPSG:3857'}
		);

		src.on(nyc.ol.source.Decorating.LoaderEventType.FEATURESLOADED, function(){
			var buckets = me.buckets.build(data, src);
			if (buckets.total == 50000){
				$(me.mapRadio.inputs[1]).prop('disabled', true).checkboxradio('refresh');
				$(me.mapRadio.inputs[0]).trigger('click').checkboxradio('refresh');
			}else{
				me.style.buckets = buckets.buckets;
				me.legend.html(me.srLeg.html('Service Requests by<br>Location', buckets.breaks));
				me.cdLyr.setVisible(false);
				me.srLyr.setVisible(true);				
			}
		});
		
		me.srLyr.setSource(src);
	},
	tip: function(){
		var count = this.get('sr_count') || '', txt = '';
		if (this.getLabel){
			txt = '<b>' + this.getLabel() + '</b><br>';
		}
		return {text: txt + count + ' Service Requests'};
	},
	copyUrl: function(event){
		var target = $(event.target), pos = target.position(), tip = $('#soda-url .tip');
		target.select();
		document.execCommand('copy');
		tip.css({left: pos.left + 'px', top: pos.top + 'px'}).fadeIn(function(){
			$(document).one('click', $.proxy(tip.fadeOut, tip));
		});
		console.warn(event);
	}
};