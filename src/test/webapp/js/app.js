QUnit.module('nyc.sr.App', {
	beforeEach: function(assert){
		this.MAP = (function(){
			var div = $('<div id="map"></div>');
			$('body').append(div);
			return new nyc.ol.Basemap({target: div.get(0)});
		}());
		
		this.STYLE = new nyc.sr.Style();
		
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
		
		this.MOCK_CD_SODA = {};
		this.MOCK_SR_SODA = {};
		this.MOCK_CD_LIST_SODA = {};
		this.MOCK_SR_LIST_SODA = {};
		this.MOCK_BUCKETS = {};
		this.MOCK_LIST_DET = {};
		
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
	},
	afterEach: function(assert){
		$('#map, #legend, #date-ranges, #map-type, #soda-url, #record-count, #panel').remove();
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

	assert.deepEqual(app.fTip.map, this.MAP);
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
	}, 300);
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
