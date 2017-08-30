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
			var div = $('<div id="date-ranges"></div>');
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
			var div = $('<div id="soda-url"></div>');
			$('body').append(div);
			return new nyc.Collapsible({target: '#soda-url', title: 'NYC OpenData URL'});  
		}());
		
		this.MOCK_CD_SODA = {};
		this.MOCK_SR_SODA = {};
		this.MOCK_CD_LIST_SODA = {};
		this.MOCK_SR_LIST_SODA = {};
		this.MOCK_BUCKETS = {};
		this.MOCK_LIST_DET = {};
},
	afterEach: function(assert){
		$('#map, #legend', '#date-ranges, #map-type, #soda-url').remove();
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
	}
});

QUnit.test('constructor', function(assert){
	assert.expect(29);
	
	var defaultDates = nyc.sr.App.prototype.defaultDates;
	var initLegends = nyc.sr.App.prototype.initLegends;
	var runFirstQuery = nyc.sr.App.prototype.runFirstQuery;
	var mapClick = nyc.sr.App.prototype.mapClick;
	var changeMapType = nyc.sr.App.prototype.changeMapType;
	var copyUrl = nyc.sr.App.prototype.copyUrl;
	
	var called = function(){
		assert.ok(true);
	};
	nyc.sr.App.prototype.defaultDates = called; 
	nyc.sr.App.prototype.initLegends = called;
	nyc.sr.App.prototype.runFirstQuery = called;
	nyc.sr.App.prototype.changeMapType = called;
	nyc.sr.App.prototype.copyUrl = called;
	
	var mockEvent = {type: 'click'};
	nyc.sr.App.prototype.mapClick = function(event){
		assert.deepEqual(event, mockEvent);
	};
	
	var app = new nyc.sr.App({
		map: this.MAP,
		cdUrl: '',
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
	});
	
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
	//this.TEXTAREA.container.find('textarea').trigger('click');
	
	nyc.sr.App.prototype.defaultDates = defaultDates;
	nyc.sr.App.prototype.initLegends = initLegends;
	nyc.sr.App.prototype.runFirstQuery = runFirstQuery;
	nyc.sr.App.prototype.mapClick = mapClick;
	nyc.sr.App.prototype.changeMapType = changeMapType;
	nyc.sr.App.prototype.copyUrl = copyUrl;
	
});