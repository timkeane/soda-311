var CD_URL = 'http://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson';
var OPEN_DATA_URL = 'https://data.cityofnewyork.us/resource/fhrw-4uyv.csv';
var WHERE_NOT_MAPPABLE = "x_coordinate_state_plane IS NOT NULL AND y_coordinate_state_plane IS NOT NULL  AND community_board NOT IN ('QNA', 'Unspecified MANHATTAN', 'Unspecified BRONX', 'Unspecified BROOKLYN', 'Unspecified QUEENS', 'Unspecified STATEN ISLAND')";

Date.prototype.toShortISOString = function(){
	return this.toISOString().split('T')[0];
};

var mapRadio = new nyc.Radio({
	target: '#map-type',
	title: 'Map Type',
	choices: [
		{name: 'cd', value: 'cd', label: 'Community Districts', checked: true},
		{name: 'sr', value: 'sr', label: 'Service Request Locations'}
    ]
});

var dateInput = new nyc.Collapsible({target: '#date-ranges', title: 'Created Date', expanded: true}); 

var srSoda = new nyc.soda.Query(OPEN_DATA_URL, {
	select: 'count(unique_key) AS sr_count, x_coordinate_state_plane AS x, y_coordinate_state_plane AS y',
	group: 'x, y'
});

var cdSoda = new nyc.soda.Query({
	url: OPEN_DATA_URL,
	select: 'count(unique_key) AS sr_count, community_board',
	group: 'community_board'		
});

var srSoda = new nyc.soda.Query({
	url: OPEN_DATA_URL,
	select: 'count(unique_key) AS sr_count, x_coordinate_state_plane AS x, y_coordinate_state_plane AS y',
	group: 'x, y'
});

nyc.sr.app = new nyc.sr.App({
	map: new nyc.ol.Basemap({target: $('#map').get(0)}), 
	cdUrl: CD_URL,
	style: new nyc.sr.Style(),
	mapRadio: mapRadio,
	dateInput: dateInput,
	cdDecorations: nyc.cd.feature,
	whereNotMappable: WHERE_NOT_MAPPABLE,
	cdSoda: cdSoda,
	srSoda: srSoda,
	counter: new nyc.sr.Counter('#record-count span')
});	

var lastYear = new Date();
lastYear.setDate(lastYear.getDate() - 365);

new nyc.soda.Query().execute({
	url: OPEN_DATA_URL,
	select: 'count(unique_key) AS sr_count, complaint_type',
	group: 'complaint_type',
	order: 'sr_count DESC',
	where: "created_date >= '" + lastYear.toShortISOString() + "'",
	callback: $.proxy(nyc.sr.app.gotSrTypes, nyc.sr.app)
});