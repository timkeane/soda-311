QUnit.module('nyc.cd.feature', {
	beforeEach: function(assert){
		this.createTestFeature = function(cd){
			var feature = new ol.Feature({BoroCD: cd});
			feature.choices = ['choice0', 'choice1'];
			for (var m in nyc.cd.feature){
				feature[m] = nyc.cd.feature[m]; 
			}
			feature.extendFeature();
			return feature;
		};
	}
});

QUnit.test('nyc.cd.feature 101', function(assert){
	assert.expect(5);
	var feature = this.createTestFeature(101);
	assert.equal(feature.getId(), '01 MANHATTAN');
	assert.equal(feature.getValue(), '01 MANHATTAN');
	assert.equal(feature.getLabel(), 'Manhattan 1');	
	assert.equal(feature.choices.length, 3);	
	assert.deepEqual(feature.choices[2], {
	  label: 'Manhattan 1',
	  name: 'community_board',
	  sort: 101,
	  value: '01 MANHATTAN'
	});	
});

QUnit.test('nyc.cd.feature 202', function(assert){
	assert.expect(5);
	var feature = this.createTestFeature(202);
	assert.equal(feature.getId(), '02 BRONX');
	assert.equal(feature.getValue(), '02 BRONX');
	assert.equal(feature.getLabel(), 'Bronx 2');	
	assert.equal(feature.choices.length, 3);	
	assert.deepEqual(feature.choices[2], {
	  label: 'Bronx 2',
	  name: 'community_board',
	  sort: 202,
	  value: '02 BRONX'
	});	
});

QUnit.test('nyc.cd.feature 312', function(assert){
	assert.expect(5);
	var feature = this.createTestFeature(312);
	assert.equal(feature.getId(), '12 BROOKLYN');
	assert.equal(feature.getValue(), '12 BROOKLYN');
	assert.equal(feature.getLabel(), 'Brooklyn 12');	
	assert.equal(feature.choices.length, 3);	
	assert.deepEqual(feature.choices[2], {
	  label: 'Brooklyn 12',
	  name: 'community_board',
	  sort: 312,
	  value: '12 BROOKLYN'
	});	
});

QUnit.test('nyc.cd.feature 421', function(assert){
	assert.expect(5);
	var feature = this.createTestFeature(421);
	assert.equal(feature.getId(), '21 QUEENS');
	assert.equal(feature.getValue(), '21 QUEENS');
	assert.equal(feature.getLabel(), 'Queens 21');	
	assert.equal(feature.choices.length, 3);	
	assert.deepEqual(feature.choices[2], {
	  label: 'Queens 21',
	  name: 'community_board',
	  sort: 421,
	  value: '21 QUEENS'
	});	
});

QUnit.test('nyc.cd.feature 505', function(assert){
	assert.expect(5);
	var feature = this.createTestFeature(505);
	assert.equal(feature.getId(), '05 STATEN ISLAND');
	assert.equal(feature.getValue(), '05 STATEN ISLAND');
	assert.equal(feature.getLabel(), 'Staten Island 5');	
	assert.equal(feature.choices.length, 3);	
	assert.deepEqual(feature.choices[2], {
	  label: 'Staten Island 5',
	  name: 'community_board',
	  sort: 505,
	  value: '05 STATEN ISLAND'
	});	
});
