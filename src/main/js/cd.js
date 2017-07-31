nyc.cd = {
	feature: {
		BOROCODES: {MANHATTAN: 1, BRONX: 2, BROOKLYN: 3, QUEENS: 4, STATEN: 5},
		BOROS: ['Manhattan', 'Bronx', 'Brooklyn', 'Queens', 'Staten Island'],
		extendFeature: function(){
			var val = this.getValue();
			this.setId(val);
			this.choices.push({name: 'community_board', value: val, label: this.getLabel(), sort: this.get('BoroCD')});
		},
		getLabel: function(){
			var cd = this.get('BoroCD') + '';
			return this.BOROS[cd.substr(0, 1) - 1] + ' ' + (1 * cd.substr(1));
		},
		getValue: function(){
			var cd = this.get('BoroCD') + '';
			return cd.substr(1) + ' ' + this.BOROS[cd.substr(0, 1) - 1].toUpperCase();
		},
		cdTip: function(){
			var cd = '<b>' + this.getLabel() + '</b>';
			var count = this.get('sr_count');
			if (!isNaN(count)) cd += ('<br>' + count + ' Service Requests');
			return {text: cd};
		}
	}		
};
