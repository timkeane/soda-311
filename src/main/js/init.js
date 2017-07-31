
var CD_URL = 'http://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson';
var SR_URL = 'https://data.cityofnewyork.us/resource/fhrw-4uyv.csv';

function gotCds(response){
	var mapChoice = new nyc.Radio({
		target: '#map-type',
		title: 'Map Type',
		expanded: true,
		choices: [
			{name: 'polygon', value: 'polygon', label: 'Community Districts', checked: true},
			{name: 'point', value: 'point', label: 'Service Request Locations'}
	    ]
	});
	var dateChoice = new nyc.Collapsible({target: '#date-ranges', title: 'Created Date', expanded: true}); 
	var complaintChoice = new nyc.Collapsible({target: '#complaint-types', title: 'Complaint Type'}); 

	var map = new nyc.ol.Basemap({target: $('#map').get(0)});

	var cdChoices = [];

	var cdSrc = new nyc.ol.source.Decorating({
		format: new ol.format.GeoJSON()
	},{
		extendFeature: function(){
			this.set('cdDisplay', this.getLabel());
			this.set('community_board', this.getValue());
			this.setId(this.get('BoroCD'));
			cdChoices.push({name: 'cd', value: this.getValue(), label: this.getLabel()});
		},
		getLabel: function(){
			var cd = this.get('BoroCD') + '';
			return this.BOROS[cd.substr(0, 1) - 1] + ' ' + (1 * cd.substr(1));
		},
		getValue: function(){
			var cd = this.get('BoroCD') + '';
			return cd.substr(1) + ' ' + this.BOROS[cd.substr(0, 1) - 1].toUpperCase();
		}
	});
	
	response.features.sort(function(a, b){
		var aCd = a.get('BoroCD'), bCd = b.get('BoroCD');
		if (aCd < bCd) return -1;
		if (aCd > bCd) return 1;
		return 0;
	});

	var cdChoice = new nyc.Collapsible({
		target: '#community-districts', 
		title: 'Community District',
		choices: cdChoices
	}); 


	if (me.cdSrc.getFeatures().length){
		var parent = $('#community-districts .ui-collapsible-content');
		var data = this.cdSrc.getFeatures();
		clearInterval(this.getCdsInterval);
		data.sort(function(a, b){
			var aCd = a.get('BoroCD'), bCd = b.get('BoroCD');
			a.set('cdDisplay', me.getLabel(aCd));
			b.set('cdDisplay', me.getLabel(bCd));
			a.set('community_board', me.getValue(aCd));
			b.set('community_board', me.getValue(bCd));
			a.setId(aCd);
			b.setId(bCd);
			if (aCd < bCd) return -1;
			if (aCd > bCd) return 1;
			return 0;
		});
		this.cdsSorted = true;
		this.checkboxes(parent, data, 'cdDisplay', 'community_board');
	}	
	
	nyc.sr.app = new nyc.sr.App({
		map: map, 
		cdSrc: cdSrc, 
		mapChoice: mapChoice,
		dateChoice: dateChoice, 
		cdChoice: cdChoice,
		complaintChoice: complaintChoice,
		
	});	
};

$.ajax({
	url: CD_URL,
	success: gotCds
});
