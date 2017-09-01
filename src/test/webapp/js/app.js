QUnit.module('nyc.sr.App', {
	beforeEach: function(assert){
		this.MAP = (function(){
			var div = $('<div id="map"></div>');
			$('body').append(div);
			return new nyc.ol.Basemap({target: div.get(0)});
		}());
		
		this.STYLE = {};
		
		this.LEGEND = (function(){
			var div = $('<div id="legend"><div class="legend"></div></div>');
			$('body').append(div);
			return new nyc.Collapsible({target: '#legend', title: 'Legend', expanded: true});
		}());
		
		this.DATE_INPUT = (function(){
			var div = $('<div id="date-ranges"><input id="created-date-min" type="date"><input id="created-date-max" type="date"></div>');
			$('body').append(div);
			return new nyc.Collapsible({target: '#date-ranges', title: 'Created Date', expanded: true}); 
		}());
		
		this.MAP_RADIO = (function(){
			var div = $('<div id="map-type"></div>');
			$('body').append(div);
			return new nyc.Radio({
				target: '#map-type',
				title: 'Map Type',
				choices: [
					{name: 'cd', value: 'cd', label: 'Community Districts', checked: true},
					{name: 'sr', value: 'sr', label: 'Service Request Locations'}
			    ]
			}); 
		}());
		
		this.TEXTAREA = (function(){
			var div = $('<div id="soda-url"><textarea></textarea></div>');
			$('body').append(div);
			return new nyc.Collapsible({target: '#soda-url', title: 'NYC OpenData URL'});  
		}());
		
		(function(){
			var div1 = $('<div id="record-count"><a class="toggle"></a></div>');
			var div2 = $('<div id="panel" style="position:fixed"></div>');
			$('body').append(div1).append(div2);
		}());
		
		var MocSodaQuery = function(){
			this.execute = function(){};
			this.getUrlAndQuery = function(){};
		};
		
		this.MOCK_CD_SODA = new MocSodaQuery();
		this.MOCK_SR_SODA = new MocSodaQuery();
		this.MOCK_CD_LIST_SODA = new MocSodaQuery();
		this.MOCK_SR_LIST_SODA = new MocSodaQuery();
		
		this.MOCK_BUCKETS = {};
		
		this.MOCK_LIST_DET = (function(){
			var div = $('<div id="list-detail"></div>');
			$('body').append(div);
			return new nyc.sr.ListDetail({
				target: '#list-detail',
				cdSrTypeDrilldown: {}
			});
		}());
		
		this.OPTIONS = {
			map: this.MAP,
			cdUrl: 'http://cd-url',
			style: this.STYLE,
			legend: this.LEGEND,
			mapRadio: this.MAP_RADIO,
			dateInput: this.DATE_INPUT,
			sodaTextarea: this.TEXTAREA,
			cdDecorations: nyc.cd.feature,
			cdSoda: this.MOCK_CD_SODA,
			srSoda: this.MOCK_SR_SODA,
			cdListSoda: this.MOCK_CD_LIST_SODA,
			srListSoda: this.MOCK_SR_LIST_SODA,
			buckets: this.MOCK_BUCKETS,
			listDetail: this.MOCK_LIST_DET
		};
		
		this.SR_TYPE_COUNT = SR_TYPE_COUNT;
		this.SR_COUNT_BY_CD = SR_COUNT_BY_CD;
		this.SR_COUNT_BY_LOCATION = SR_COUNT_BY_LOCATION;
	},
	afterEach: function(assert){
		$('#map, #legend, #date-ranges, #map-type, #soda-url, #record-count, #panel, #list-detail, #community-districts, #complaint-types').remove();
		delete this.MAP;		
		delete this.STYLE;
		delete this.LEGEND;
		delete this.DATE_INPUT;
		delete this.MAP_RADIO;
		delete this.TEXTAREA;
		delete this.MOCK_CD_SODA;
		delete this.MOCK_SR_SODA;
		delete this.MOCK_CD_LIST_SODA;
		delete this.MOCK_SR_LIST_SODA;
		delete this.MOCK_BUCKETS;
		delete this.MOCK_LIST_DET;
		delete this.OPTIONS;
		delete this.SR_TYPE_COUNT;
		delete nyc.cd.feature.choices;
	}
});

QUnit.test('constructor', function(assert){
	assert.expect(39);
	
	var options = this.OPTIONS;
	
	var getCds = nyc.sr.App.prototype.getCds;
	var defaultDates = nyc.sr.App.prototype.defaultDates;
	var runFirstQuery = nyc.sr.App.prototype.runFirstQuery;
	var mapClick = nyc.sr.App.prototype.mapClick;
	var changeMapType = nyc.sr.App.prototype.changeMapType;
	var copyUrl = nyc.sr.App.prototype.copyUrl;
	var toggle = nyc.sr.App.prototype.toggle;
	
	nyc.sr.App.prototype.getCds = function(opt){
		assert.deepEqual(opt, options);
	};
	
	var called = function(){
		assert.ok(true);
	};
	nyc.sr.App.prototype.defaultDates = called; 
	nyc.sr.App.prototype.runFirstQuery = called;
	nyc.sr.App.prototype.changeMapType = called;
	nyc.sr.App.prototype.copyUrl = called;
	nyc.sr.App.prototype.toggle = called;
	
	var mockEvent = {type: 'click'};
	nyc.sr.App.prototype.mapClick = function(event){
		assert.deepEqual(event, mockEvent);
	};
	
	var app = new nyc.sr.App(options);
	
	app.map.dispatchEvent(mockEvent);
	
	assert.deepEqual(app.map, this.MAP);
	assert.deepEqual(app.view, this.MAP.getView());
	assert.equal(app.view.getMinZoom(), 9);
	assert.deepEqual(app.cdChoices, []);
	assert.deepEqual(nyc.cd.feature.choices, []);
	assert.deepEqual(app.style, this.STYLE);
	assert.equal(app.legend.length, 1);
	assert.deepEqual(app.legend, this.LEGEND.container.find('.legend'));
	
	assert.deepEqual(app.mapRadio, this.MAP_RADIO);
	assert.deepEqual(app.dateInput, this.DATE_INPUT);
	assert.deepEqual(app.sodaTextarea, this.TEXTAREA);
	assert.deepEqual(app.cdSoda, this.MOCK_CD_SODA);
	assert.deepEqual(app.srSoda, this.MOCK_SR_SODA);
	assert.deepEqual(app.cdListSoda, this.MOCK_CD_LIST_SODA);
	assert.deepEqual(app.srListSoda, this.MOCK_SR_LIST_SODA);
	assert.deepEqual(app.srListSoda, this.MOCK_SR_LIST_SODA);
	assert.deepEqual(app.buckets, this.MOCK_BUCKETS);
	assert.deepEqual(app.listDetail, this.MOCK_LIST_DET);
	
	assert.ok($.inArray(app.highlightLyr, this.MAP.getLayers().getArray()) > -1);
	assert.equal(app.highlightLyr.getZIndex(), 1000);
	assert.deepEqual(app.highlightLyr.getSource(), app.highlightSrc);

	assert.ok($.inArray(app.srLyr, this.MAP.getLayers().getArray()) > -1);

	assert.deepEqual(app.tips[0].map, this.MAP);
	assert.deepEqual(app.srLyr.nycTip, app.tip);

	this.MAP_RADIO.trigger('change');
	this.TEXTAREA.container.find('textarea').trigger('click');
	$('#record-count a.toggle').trigger('click');
	
	$('#panel').hide().width(10);
	$(window).trigger('resize');
	
	assert.ok($('#panel').is(':visible'));

	$('#panel').hide().width($(window).width());
	$(window).trigger('resize');
	
	assert.notOk($('#panel').is(':visible'));

	assert.equal(app.cdLeg.name, 'cd-leg');
	assert.equal(app.cdLeg.symbolType, nyc.BinLegend.SymbolType.POLYGON);
	assert.equal(app.cdLeg.binType, nyc.BinLegend.BinType.RANGE_NUMBER);
	
	assert.equal(app.srLeg.name, 'sr-leg');
	assert.equal(app.srLeg.symbolType, nyc.BinLegend.SymbolType.POINT);
	assert.equal(app.srLeg.binType, nyc.BinLegend.BinType.RANGE_NUMBER);
	
	nyc.sr.App.prototype.getCds = getCds;
	nyc.sr.App.prototype.defaultDates = defaultDates;
	nyc.sr.App.prototype.runFirstQuery = runFirstQuery;
	nyc.sr.App.prototype.mapClick = mapClick;
	nyc.sr.App.prototype.changeMapType = changeMapType;
	nyc.sr.App.prototype.copyUrl = copyUrl;
	nyc.sr.App.prototype.toggle = toggle;
});

QUnit.test('toggle (pw > 0 && pw < ww)', function(assert){
	assert.expect(2);
	
	var done = assert.async();
	
	$('#panel').hide().width(10);
	
	var app = new nyc.sr.App(this.OPTIONS);

	app.toggle();
	
	setTimeout(function(){
		assert.notOk($('#panel').is(':visible'));
		assert.notOk($('#record-count a.toggle').hasClass('panel'));
		done();
	}, 600);
});

QUnit.test('toggle (pw == 0)', function(assert){
	assert.expect(2);
	
	var done = assert.async();
	
	$('#panel').hide().width(0);
	
	var app = new nyc.sr.App(this.OPTIONS);

	app.toggle();

	setTimeout(function(){
		assert.ok($('#panel').is(':visible'));
		assert.ok($('#record-count a.toggle').hasClass('panel'));
		done();
	}, 600);
});

QUnit.test('toggle (pw == ww)', function(assert){
	assert.expect(2);
	
	var done = assert.async();
	
	$('#panel').hide().width($(window).width());
	
	var app = new nyc.sr.App(this.OPTIONS);

	app.toggle();

	setTimeout(function(){
		assert.ok($('#panel').is(':visible'));
		assert.ok($('#record-count a.toggle').hasClass('panel'));
		done();
	}, 600);
});

QUnit.test('runFirstQuery (cds already loaded)', function(assert){
	assert.expect(1);

	var app = new nyc.sr.App(this.OPTIONS);
	
	var runFirstQuery = nyc.sr.App.prototype.runFirstQuery;

	nyc.sr.App.prototype.runFirstQuery = function(){};

	app.runFirstQuery = runFirstQuery;

	app.cdSrc = {
		getFeatures: function(){
			return [{}];
		}
	};
	
	app.sodaMapQuery = function(){
		assert.ok(true);
	};
	
	app.runFirstQuery();
	
	nyc.sr.App.prototype.runFirstQuery = runFirstQuery;
});

QUnit.test('runFirstQuery (cds loaded late)', function(assert){
	assert.expect(2);

	var done = assert.async();
	
	var runFirstQuery = nyc.sr.App.prototype.runFirstQuery;

	nyc.sr.App.prototype.runFirstQuery = function(){};
	
	var app = new nyc.sr.App(this.OPTIONS);
	
	app.runFirstQuery = runFirstQuery;
	
	app.cdSrc = {
		getFeatures: function(){
			return [];
		}
	};
	
	app.sodaMapQuery = function(){
		assert.ok(true);
		nyc.sr.App.prototype.runFirstQuery = runFirstQuery;
		done();
	};
	
	app.runFirstQuery();
	
	var i = 0;
	setTimeout(function(){
		assert.ok(true);
		app.cdSrc.getFeatures = function(){return [{}];};
	}, 500);
});

QUnit.test('changeMapType', function(assert){
	assert.expect(2);

	var app = new nyc.sr.App(this.OPTIONS);

	app.sodaMapQuery = function(){
		assert.ok(true);
	};

	app.changeMapType([{name: 'mock-type'}]);
	
	assert.equal(app.mapType, 'mock-type');
});

QUnit.test('defaultDates', function(assert){
	assert.expect(8);

	var today = new Date();
	var lastWeek = new Date();
	lastWeek.setDate(lastWeek.getDate() - 7);
	var actualEvent;
	
	var sodaMapQuery = nyc.sr.App.prototype.sodaMapQuery;
	
	nyc.sr.App.prototype.sodaMapQuery = function(event){
		actualEvent = event;
	};
	
	var app = new nyc.sr.App(this.OPTIONS);

	assert.equal(app.minDate.length, 1);
	assert.equal(app.maxDate.length, 1);
	assert.deepEqual(app.minDate, this.DATE_INPUT.container.find('#created-date-min'));
	assert.deepEqual(app.maxDate, this.DATE_INPUT.container.find('#created-date-max'));
	assert.equal(app.minDate.val(), lastWeek.toShortISOString());
	assert.equal(app.maxDate.val(), today.toShortISOString());

	app.minDate.val('1776-07-04').trigger('change');
	assert.deepEqual(actualEvent.target, app.minDate.get(0));
	
	app.maxDate.val('1941-12-07').trigger('change');
	assert.deepEqual(actualEvent.target, app.maxDate.get(0));
	
	nyc.sr.App.prototype.sodaMapQuery = sodaMapQuery;
});

QUnit.test('getCds', function(assert){
	assert.expect(6);
	
	var done = assert.async();
	
	var options = this.OPTIONS;
	
	var getCds = nyc.sr.App.prototype.getCds;
	var gotCds = nyc.sr.App.prototype.gotCds;
	var runFirstQuery = nyc.sr.App.prototype.runFirstQuery;

	nyc.sr.App.prototype.getCds = function(){};
	nyc.sr.App.prototype.gotCds = function(){};
	nyc.sr.App.prototype.runFirstQuery = function(){};
	
	var app = new nyc.sr.App(options);
	
	app.getCds = getCds;
	app.runFirstQuery = runFirstQuery;
	
	app.gotCds = function(){
		var feature = app.cdSrc.getFeatures()[0];
		assert.equal(app.cdSrc.getUrl(), 'data/cd.json');
		for (var memb in nyc.cd.feature){
			assert.deepEqual(feature[memb], nyc.cd.feature[memb]);
		}
		nyc.sr.App.prototype.getCds = getCds;		
		nyc.sr.App.prototype.gotCds = gotCds;		
		nyc.sr.App.prototype.runFirstQuery = runFirstQuery;		
		done();
	};
	options.cdUrl = 'data/cd.json';

	app.getCds(options);
});

QUnit.test('gotCds', function(assert){
	assert.expect(5);
	
	var done = assert.async();
	
	var options = this.OPTIONS;
	options.cdUrl = 'data/cd.json';
	
	var app;
	
	var createCdCheck = nyc.sr.App.prototype.createCdCheck;

	nyc.sr.App.prototype.createCdCheck = function(){
		assert.ok(true);
	};
	
	var gotCds = nyc.sr.App.prototype.gotCds;
	nyc.sr.App.prototype.gotCds = function(){
		gotCds.call(app);
		assert.ok(app.cdLyr);
		assert.deepEqual(app.tips[1].map, options.map);
		assert.ok($.inArray(app.cdLyr, options.map.getLayers().getArray()) > -1);
		assert.deepEqual(app.cdLyr.nycTip, app.tip);
		nyc.sr.App.prototype.gotCds = gotCds;		
		nyc.sr.App.prototype.createCdCheck = createCdCheck;
		setTimeout(function(){
			done();
		}, 200);
	};

	app = new nyc.sr.App(options);
});

QUnit.test('createCdCheck', function(assert){
	assert.expect(5);
	
	var done = assert.async();
	
	var options = this.OPTIONS;
	options.cdUrl = 'data/cd.json';

	var sodaMapQuery = nyc.sr.App.prototype.sodaMapQuery;
	var createCdCheck = nyc.sr.App.prototype.createCdCheck;

	nyc.sr.App.prototype.sodaMapQuery = function(){
		assert.ok(true);
	};
	
	nyc.sr.App.prototype.createCdCheck = function(){
		createCdCheck.call(app);
		assert.equal(app.cdCheck.inputs.length, 71);
		assert.deepEqual(app.cdCheck.choices, app.cdChoices);
		assert.equal(app.cdCheck.container.length, 1);
		assert.deepEqual(app.dateInput.container.next().get(0), app.cdCheck.container.get(0));
		app.cdCheck.trigger('change');
		done();
		nyc.sr.App.prototype.createCdCheck = createCdCheck;
		nyc.sr.App.prototype.sodaMapQuery = sodaMapQuery;
	};
	app = new nyc.sr.App(options);
});

QUnit.test('gotSrTypes', function(assert){
	assert.expect(5);

	var app = new nyc.sr.App(this.OPTIONS);

	app.sodaMapQuery = function(){
		assert.ok(true, 'sodaMapQuery');
	};

	var expectedChoices = [];
	$.each(this.SR_TYPE_COUNT, function(i, typ){
		expectedChoices.push({
		    checked: false,
			name: 'complaint_type',
			label: typ.complaint_type,
			value: typ.complaint_type
		});
		return i < 9;
	});
	app.gotSrTypes(this.SR_TYPE_COUNT);
	
	assert.equal(app.srTypeCheck.inputs.length, 10);
	assert.deepEqual(app.srTypeCheck.choices, expectedChoices);
	assert.equal(app.srTypeCheck.container.length, 1);
	assert.deepEqual(app.sodaTextarea.container.prev().get(0), app.srTypeCheck.container.get(0));
	
	app.srTypeCheck.trigger('change');
});

QUnit.test('getFilters (no props)', function(assert){
	assert.expect(1);

	var app = new nyc.sr.App(this.OPTIONS);
	
	app.cdCheck = {};
	app.srTypeCheck = {};
	
	app.filterValues = function(chk){
		return chk === app.cdCheck ? 'mock-cd-filters' : 'mock-sr-filters';
	};
	app.dateFilters = function(){
		return 'mock-date-filters';
	};
	
	assert.deepEqual(app.getFilters(), {
		created_date: 'mock-date-filters',
		community_board: 'mock-cd-filters',
		complaint_type: 'mock-sr-filters'
	});
});
	
QUnit.test('getFilters (has sr props)', function(assert){
	assert.expect(1);

	var props = {x_coordinate_state_plane: 1, y_coordinate_state_plane: 2};
	
	var app = new nyc.sr.App(this.OPTIONS);
	
	app.cdCheck = {};
	app.srTypeCheck = {};
	
	app.filterValues = function(chk){
		return chk === app.cdCheck ? 'mock-cd-filters' : 'mock-sr-filters';
	};
	app.dateFilters = function(){
		return 'mock-date-filters';
	};
	
	assert.deepEqual(app.getFilters(props), {
		created_date: 'mock-date-filters',
		community_board: 'mock-cd-filters',
		complaint_type: 'mock-sr-filters',
		x_coordinate_state_plane: [{op: '=', value: props.x_coordinate_state_plane}],
		y_coordinate_state_plane: [{op: '=', value: props.y_coordinate_state_plane}]
	});
});

QUnit.test('getFilters (has cd props)', function(assert){
	assert.expect(1);

	var props = {community_board: 101};
	
	var app = new nyc.sr.App(this.OPTIONS);
	
	app.cdCheck = {};
	app.srTypeCheck = {};
	
	app.filterValues = function(chk){
		return chk === app.cdCheck ? 'mock-cd-filters' : 'mock-sr-filters';
	};
	app.dateFilters = function(){
		return 'mock-date-filters';
	};
	
	assert.deepEqual(app.getFilters(props), {
		created_date: 'mock-date-filters',
		community_board: 'mock-cd-filters',
		complaint_type: 'mock-sr-filters',
		community_board: [{op: '=', value: props.community_board}]
	});
});

QUnit.test('dateFilters', function(assert){
	assert.expect(1);

	var app = new nyc.sr.App(this.OPTIONS);

	assert.deepEqual(app.dateFilters(), [
        {op: '>=', value: app.minDate.val()},
        {op: '<=', value: app.maxDate.val()}
    ]);
});

QUnit.test('sodaMapQuery (cd map)', function(assert){
	assert.expect(6);

	var app = new nyc.sr.App(this.OPTIONS);

	app.mapType = 'cd';
	
	app.highlightSrc.addFeature(new ol.Feature());
	
	app.getFilters = function(){
		return 'mock-filters';
	};

	app.updateCdLayer = function(data){
		assert.equal(data, 'mock-data');
	};

	app.updateSrLayer = function(data){
		assert.notOk(true);
	};

	app.executeSoda = function(soda, filters, callback){
		assert.ok(soda == app.cdSoda);
		assert.equal(filters, 'mock-filters');
		callback('mock-data');
	};

	app.sodaMapQuery();
	
	assert.equal(app.highlightSrc.getFeatures().length, 0);
	assert.notOk(app.listDetail.listDetailContainer.is(':visible'));
	assert.ok(app.listDetail.container.collapsible('option', 'collapsed'));
});

QUnit.test('sodaMapQuery (sr map)', function(assert){
	assert.expect(6);

	var app = new nyc.sr.App(this.OPTIONS);

	app.mapType = 'sr';
	
	app.highlightSrc.addFeature(new ol.Feature());
	
	app.getFilters = function(){
		return 'mock-filters';
	};

	app.updateCdLayer = function(data){
		assert.notOk(true);
	};

	app.updateSrLayer = function(data){
		assert.equal(data, 'mock-data');
	};

	app.executeSoda = function(soda, filters, callback){
		assert.ok(soda === app.srSoda);
		assert.equal(filters, 'mock-filters');
		callback('mock-data');
	};

	app.sodaMapQuery();
	
	assert.equal(app.highlightSrc.getFeatures().length, 0);
	assert.notOk(app.listDetail.listDetailContainer.is(':visible'));
	assert.ok(app.listDetail.container.collapsible('option', 'collapsed'));
});

QUnit.test('sodaInfoQuery (cd map)', function(assert){
	assert.expect(6);

	var feature = new ol.Feature({mockProp: 'mock-value'});
	var cdLyr = new ol.layer.Vector({});
	var srLyr = new ol.layer.Vector({});
	
	var app = new nyc.sr.App(this.OPTIONS);
	
	app.cdLyr = cdLyr;
	app.srLyr = srLyr;
	
	app.getFilters = function(props){
		assert.deepEqual(props, feature.getProperties());
		return 'mock-filters';
	};
	
	app.cdList = function(data){
		assert.equal(data, 'mock-data');
	};

	app.srList = function(data){
		assert.notOk(true);
	};

	app.executeSoda = function(soda, filters, callback){
		assert.ok(soda == app.cdListSoda);
		assert.equal(filters, 'mock-filters');
		callback('mock-data');
	};

	app.highlight = function(f){
		assert.ok(f === feature);
	};

	assert.ok(app.sodaInfoQuery(feature, cdLyr));
});

QUnit.test('sodaInfoQuery (sr map)', function(assert){
	assert.expect(6);

	var feature = new ol.Feature({mockProp: 'mock-value'});
	var cdLyr = new ol.layer.Vector({});
	var srLyr = new ol.layer.Vector({});
	
	var app = new nyc.sr.App(this.OPTIONS);
	
	app.cdLyr = cdLyr;
	app.srLyr = srLyr;
	
	app.getFilters = function(props){
		assert.deepEqual(props, feature.getProperties());
		return 'mock-filters';
	};
	
	app.cdList = function(data){
		assert.notOk(true);
	};

	app.srList = function(data){
		assert.equal(data, 'mock-data');
	};

	app.executeSoda = function(soda, filters, callback){
		assert.ok(soda == app.srListSoda);
		assert.equal(filters, 'mock-filters');
		callback('mock-data');
	};

	app.highlight = function(f){
		assert.ok(f === feature);
	};

	assert.ok(app.sodaInfoQuery(feature, srLyr));
});

QUnit.test('highlight', function(assert){
	assert.expect(2);

	var feature1 = new ol.Feature({mockProp1: 'mock-value-1'});
	var feature2 = new ol.Feature({mockProp2: 'mock-value-2'});

	var app = new nyc.sr.App(this.OPTIONS);
	
	app.highlightSrc.addFeature(feature1);
	
	app.highlight(feature2);
	
	assert.equal(app.highlightSrc.getFeatures().length, 1);
	assert.deepEqual(app.highlightSrc.getFeatures()[0], feature2);
});

QUnit.test('cdList', function(assert){
	assert.expect(4);

	var done = assert.async();
	
	this.MOCK_LIST_DET.cdList = function(data, filters){
		assert.equal(data, 'mock-data');
		assert.equal(filters, 'mock-filters');
	};
	
	var div = $('<div id="loading"></div>');
	$('body').append(div);
	
	var app = new nyc.sr.App(this.OPTIONS);
	
	app.toggle = function(){
		assert.ok(true);
	};
	
	app.cdList('mock-data', {filters: 'mock-filters'});	
	
	setTimeout(function(){
		assert.notOk(div.is(':visible'));
		div.remove();
		done();
	}, 600);
});

QUnit.test('srList', function(assert){
	assert.expect(4);

	var done = assert.async();
	
	this.MOCK_LIST_DET.srList = function(data, filters){
		assert.equal(data, 'mock-data');
		assert.equal(filters, 'mock-filters');
	};
	
	var div = $('<div id="loading"></div>');
	$('body').append(div);
	
	var app = new nyc.sr.App(this.OPTIONS);
	
	app.toggle = function(){
		assert.ok(true);
	};
	
	app.srList('mock-data', {filters: 'mock-filters'});	
	
	setTimeout(function(){
		assert.notOk(div.is(':visible'));
		div.remove();
		done();
	}, 600);
});

QUnit.test('executeSoda', function(assert){
	assert.expect(3);

	var url = 'https://data.cityofnewyork.us/resource/fhrw-4uyv.csv?$select=co1,%20col2&$where=col3%20IS%20NOT%20NULL';
	var mockSoda = {
		execute: function(filters, callback){
			assert.equal(filters.filters, 'mock-filters');
			assert.equal(callback, 'mock-callback');
		},
		getUrlAndQuery: function(){
			return url;
		}
	};
	
	var app = new nyc.sr.App(this.OPTIONS);
	
	app.executeSoda(mockSoda, 'mock-filters', 'mock-callback');	
	
	assert.equal(app.sodaTextarea.container.find('textarea').html(), 'https://data.cityofnewyork.us/resource/fhrw-4uyv.csv?$select=co1, col2&amp;$where=col3 IS NOT NULL');
});

QUnit.test('mapClick', function(assert){
	assert.expect(5);

	this.OPTIONS.map.forEachFeatureAtPixel = function(pix, fn){
		assert.equal(pix[0], 1);
		assert.equal(pix[1], 2);
		assert.equal(fn, 'mock-proxy');
	};
	
	var app = new nyc.sr.App(this.OPTIONS);
	
	var proxy = $.proxy;
	
	$.proxy = function(fn, scope){
		assert.deepEqual(fn, app.sodaInfoQuery);
		assert.deepEqual(scope, app);
		return 'mock-proxy';
	};
	
	app.mapClick({pixel: [1, 2]});
	
	$.proxy = proxy;
});

QUnit.test('filterValues', function(assert){
	assert.expect(3);

	var values = [{value: 1}, {value: 2}, {value: 3}];
	var mockCheck = {
		val: function(){
			return values;
		}
	};
	
	var app = new nyc.sr.App(this.OPTIONS);
	
	assert.notOk(app.filterValues());
	assert.deepEqual(app.filterValues(mockCheck), [{op: 'IN', value: [1, 2, 3]}]);

	values = [];

	assert.notOk(app.filterValues(mockCheck));
});

QUnit.test('updateCdLayer', function(assert){
	assert.expect(156);

	var done = assert.async();
	
	var countByCd = this.SR_COUNT_BY_CD;
	
	var options = this.OPTIONS;
	options.cdUrl = 'data/cd.json';

	var updateCdLayer = nyc.sr.App.prototype.updateCdLayer;
	nyc.sr.App.prototype.updateCdLayer = function(){};
	
	var app = new nyc.sr.App(options);
	
	app.cdLeg.html = function(title, bins){
		assert.equal(title, 'Service Requests by<br>Community District');
		assert.equal(bins, 'mock-breaks');
		return 'mock-legend-html';
	};
	
	app.updateCdLayer = updateCdLayer;
	
	var total = 50001;
	app.buckets.build = function(data, source){
		assert.deepEqual(data, countByCd);
		return {buckets: 'mock-buckets', breaks: 'mock-breaks', total: total};
	};

	var test = function(moreThan50k){

		assert.notOk(app.srLyr.getVisible());
		assert.ok(app.cdLyr.getVisible());
		assert.equal(app.style.buckets, 'mock-buckets');
		assert.equal(app.legend.html(), 'mock-legend-html');
		assert[moreThan50k ? 'ok' : 'notOk']($(app.mapRadio.inputs[1]).prop('disabled'));
		
		$.each(countByCd, function(i){
			var feature = app.cdSrc.getFeatureById(this.id);
			assert.equal(feature.get('sr_count'), this.sr_count, i + '');
		});
	};
	
	var intv = setInterval(function(){
		if (app.cdSrc.getFeatures().length){
			clearInterval(intv);

			app.cdLyr.dispatchEvent = function(event){
				assert.equal(event, 'change');
			};
	
			app.updateCdLayer(countByCd);
			test(true);
			
			total = 10;
			app.updateCdLayer(countByCd);
			test(false);
			
			done();
		}		
	}, 500);
});

QUnit.test('updateSrLayer (total > 50000)', function(assert){
	assert.expect(121);

	var done = assert.async();
	
	var srData = this.SR_COUNT_BY_LOCATION;
	
	var updateSrLayer = nyc.sr.App.prototype.updateSrLayer;
	nyc.sr.App.prototype.updateSrLayer = function(){};
	
	var app = new nyc.sr.App(this.OPTIONS);
	
	app.updateSrLayer = updateSrLayer;
	
	app.srSoda.getUrlAndQuery = function(){
		return 'data/sr-count-by-location.csv';
	};

	app.buckets.build = function(data, source){
		assert.deepEqual(data, srData);
		return {buckets: 'mock-buckets', breaks: 'mock-breaks', total: 50001};
	};
	
	app.mapRadio.inputs[0].click(function(){
		assert.ok(true)
	});
	
	app.style.buckets = 'unchanged';
	
	app.updateSrLayer(srData);

	var intv = setInterval(function(){
		if (app.srSrc && app.srSrc.getFeatures().length){
			clearInterval(intv);

			$.each(srData, function(){
				var feature = app.srSrc.getFeatureById(this.id);
				var wmCoords = feature.getGeometry().getCoordinates();
				var spCoords = proj4('EPSG:2263', 'EPSG:3857', [this.x_coordinate_state_plane, this.y_coordinate_state_plane]);
				
				assert.deepEqual(wmCoords, spCoords);
				assert.equal(feature.get('sr_count'), this.sr_count);
			});

			assert.equal(app.style.buckets, 'unchanged');
			assert.deepEqual(app.srLyr.getSource(), app.srSrc);
			assert.ok($(app.mapRadio.inputs[1]).prop('disabled'));

			nyc.sr.App.prototype.updateSrLayer = updateSrLayer;
			done();			
		}		
	}, 500);
});

QUnit.test('updateSrLayer (total < 50000)', function(assert){
	assert.expect(124);

	var done = assert.async();
	
	var srData = this.SR_COUNT_BY_LOCATION;
	
	var updateSrLayer = nyc.sr.App.prototype.updateSrLayer;
	nyc.sr.App.prototype.updateSrLayer = function(){};
	
	var app = new nyc.sr.App(this.OPTIONS);
	
	app.updateSrLayer = updateSrLayer;
	
	app.cdLyr = {
		setVisible: function(vis){
			assert.notOk(vis);
		}
	};
	
	app.srLeg.html = function(title, bins){
		assert.equal(title, 'Service Requests by Location');
		assert.equal(bins, 'mock-breaks');
		return 'mock-legend-html';
	};
	
	app.srSoda.getUrlAndQuery = function(){
		return 'data/sr-count-by-location.csv';
	};

	app.buckets.build = function(data, source){
		assert.deepEqual(data, srData);
		return {buckets: 'mock-buckets', breaks: 'mock-breaks', total: 10};
	};
	
	app.mapRadio.inputs[0].click(function(){
		assert.ok(false)
	});
	
	app.updateSrLayer(srData);

	var intv = setInterval(function(){
		if (app.srSrc && app.srSrc.getFeatures().length){
			clearInterval(intv);

			$.each(srData, function(){
				var feature = app.srSrc.getFeatureById(this.id);
				var wmCoords = feature.getGeometry().getCoordinates();
				var spCoords = proj4('EPSG:2263', 'EPSG:3857', [this.x_coordinate_state_plane, this.y_coordinate_state_plane]);
				
				assert.deepEqual(wmCoords, spCoords);
				assert.equal(feature.get('sr_count'), this.sr_count);
			});
			
			assert.equal(app.style.buckets, 'mock-buckets');
			assert.deepEqual(app.srLyr.getSource(), app.srSrc);	
			assert.notOk($(app.mapRadio.inputs[1]).prop('disabled'));
			assert.ok(app.srLyr.getVisible());
			
			nyc.sr.App.prototype.updateSrLayer = updateSrLayer;
			done();			
		}		
	}, 500);
});

QUnit.test('tip', function(assert){
	assert.expect(1);
	
	var mockFeature = {
		getLabel: function(){
			return 'mock-label';
		},
		get: function(prop){
			if (prop == 'sr_count'){
				return 'mock-count';
			}
		}
	};
	
	mockFeature.tip = nyc.sr.App.prototype.tip;
	
	assert.equal(mockFeature.tip().text, '<b>mock-label</b><br>mock-count Service Requests');
});

QUnit.test('copyUrl', function(assert){
	assert.expect(6);

	var done = assert.async();
	
	var execCommand = document.execCommand;
	
	document.execCommand = function(cmd){
		assert.equal(cmd, 'copy');
	};
	
	var app = new nyc.sr.App(this.OPTIONS);

	var tip = $('<div class="tip"></div>').css({
		display: 'none',
		position: 'sticky',
		float: 'left',
		margin: '10px 0 -75px',
		'z-index': 2000
	});
	app.sodaTextarea.container.css({position: 'fixed', left: '-1000px', top: '-1000px'}).append(tip);
	
	var textarea = app.sodaTextarea.container.find('textarea');
	
	var pos = textarea.position();
	
	assert.notOk(tip.is(':visible'));
	
	textarea.trigger('click');

	assert.equal(tip.css('left'), pos.left + 'px');
	assert.equal(tip.css('top'), pos.top + 'px');
	
	setTimeout(function(){
		assert.ok(tip.is(':visible'));		
		$(document).trigger('click');
		setTimeout(function(){
			assert.notOk(tip.is(':visible'));
			done();
		}, 600);
	}, 600);
	
	document.execCommand = execCommand;
});
