QUnit.module('nyc.sr.ListDetail', {
	beforeEach: function(assert){
		$('body').append('<div id="test-list-detail"></div><div id="loading"></div>');
		this.MOCK_SODA = {filters: {}};
		this.MOCK_CD_DATA = [
        	{
        		community_board: '01 STATEN ISLAND',
        		complaint_type: 'Noise - Residential',
        		sr_count: '130'
        	},
        	{
        		community_board: '01 STATEN ISLAND',
        		complaint_type: 'Illegal Parking',
        		sr_count: '43'
        	},
        	{
        		community_board: '01 STATEN ISLAND',
        		complaint_type: 'Derelict Vehicle',
        		sr_count: '40'
        	},
        	{
        		community_board: '01 STATEN ISLAND',
        		complaint_type: 'Noise - Street/Sidewalk',
        		sr_count: '29'
        	},
        	{
        		community_board: '01 STATEN ISLAND',
        		complaint_type: 'Damaged Tree',
        		sr_count: '29'
        	},
        	{
        		community_board: '01 STATEN ISLAND',
        		complaint_type: 'Blocked Driveway',
        		sr_count: '16'
        	},
        	{
        		community_board: '01 STATEN ISLAND',
        		complaint_type: 'Overgrown Tree/Branches',
        		sr_count: '12'
        	}
        ];
		this.MOCK_SR_DATA = [
          	{
        		agency_name: 'New York City Police Department',
        		city: 'STATEN ISLAND',
        		closed_date: '2017-08-28T22:53:32.000',
        		complaint_type: 'Blocked Driveway',
        		created_date: '2017-08-28T14:47:38.000',
        		cross_Street_1: 'BEND',
        		cross_Street_2: 'AMITY PLACE',
        		descriptor: 'No Access',
        		incident_address: '37 LUDWIG LANE',
        		incident_zip: '10303',
        		intersection_street_1: '',
        		intersection_street_2: '',
        		location_type: 'Street/Sidewalk',
        		resolution_description: 'The Police Department responded and upon arrival those responsible for the condition were gone.',
        		street_name: 'LUDWIG LANE',
        		unique_key: '37049003'
        	},
        	{
        		agency_name: 'New York City Police Department',
        		city: 'STATEN ISLAND',
        		closed_date: '2017-08-27T06:03:51.000',
        		complaint_type: 'Blocked Driveway',
        		created_date: '2017-08-27T03:30:18.000',
        		cross_Street_1: 'FOREST AVENUE',
        		cross_Street_2: 'FRANCESCA LANE',
        		descriptor: 'Partial Access',
        		incident_address: '19 SUMMERFIELD PLACE',
        		incident_zip: '10303',
        		intersection_street_1: '',
        		intersection_street_2: '',
        		location_type: 'Street/Sidewalk',
        		resolution_description: 'The Police Department issued a summons in response to the complaint.',
        		street_name: 'SUMMERFIELD PLACE',
        		unique_key: '37042645'
        	},
        	{
        		agency_name: 'New York City Police Department',
        		city: 'STATEN ISLAND',
        		closed_date: '2017-08-26T13:54:42.000',
        		complaint_type: 'Blocked Driveway',
        		created_date: '2017-08-26T11:51:14.000',
        		cross_Street_1: 'BEND',
        		cross_Street_2: 'HAMILTON AVENUE',
        		descriptor: 'Partial Access',
        		incident_address: '199 ST MARKS PLACE',
        		incident_zip: '10301',
        		intersection_street_1: '',
        		intersection_street_2: '',
        		location_type: 'Street/Sidewalk',
        		resolution_description: 'The Police Department issued a summons in response to the complaint.',
        		street_name: 'ST MARKS PLACE',
        		unique_key: '37038707'
        	},
        	{
        		agency_name: 'New York City Police Department',
        		city: 'STATEN ISLAND',
        		closed_date: '2017-08-26T11:29:09.000',
        		complaint_type: 'Blocked Driveway',
        		created_date: '2017-08-26T11:06:52.000',
        		cross_Street_1: 'TARGEE STREET',
        		cross_Street_2: 'HARDY STREET',
        		descriptor: 'No Access',
        		incident_address: '47 IRVING PLACE',
        		incident_zip: '10304',
        		intersection_street_1: '',
        		intersection_street_2: '',
        		location_type: 'Street/Sidewalk',
        		resolution_description: 'The Police Department issued a summons in response to the complaint.',
        		street_name: 'IRVING PLACE',
        		unique_key: '37039749'
        	},
        	{
        		agency_name: 'New York City Police Department',
        		city: 'STATEN ISLAND',
        		closed_date: '2017-08-26T04:00:10.000',
        		complaint_type: 'Blocked Driveway',
        		created_date: '2017-08-25T23:53:47.000',
        		cross_Street_1: 'BOND STREET',
        		cross_Street_2: 'CASTLETON AVENUE',
        		descriptor: 'No Access',
        		incident_address: '12 SIMONSON PLACE',
        		incident_zip: '10302',
        		intersection_street_1: '',
        		intersection_street_2: '',
        		location_type: 'Street/Sidewalk',
        		resolution_description: 'The Police Department responded to the complaint and with the information available observed no evidence of the violation at that time.',
        		street_name: 'SIMONSON PLACE',
        		unique_key: '37028438'
        	},
        	{
        		agency_name: 'New York City Police Department',
        		city: 'STATEN ISLAND',
        		closed_date: '2017-08-26T06:56:40.000',
        		complaint_type: 'Blocked Driveway',
        		created_date: '2017-08-25T23:22:49.000',
        		cross_Street_1: 'BEND',
        		cross_Street_2: 'HAMILTON AVENUE',
        		descriptor: 'Partial Access',
        		incident_address: '199 ST MARKS PLACE',
        		incident_zip: '10301',
        		intersection_street_1: '',
        		intersection_street_2: '',
        		location_type: 'Street/Sidewalk',
        		resolution_description: 'The Police Department responded to the complaint and determined that police action was not necessary.',
        		street_name: 'ST MARKS PLACE',
        		unique_key: '37031108'
        	}
        ]; 
	},
	afterEach: function(assert){
		$('#test-list-detail, #loading').remove();
		delete this.MOCK_SODA;
	}
});

QUnit.test('constructor', function(assert){
	assert.expect(17);
	
	var ld = new nyc.sr.ListDetail({
		target: '#test-list-detail',
		cdSrTypeDrilldown: this.MOCK_SODA
	});
	
	assert.equal(ld.container.length, 1);
	assert.deepEqual(ld.container, $('#test-list-detail'));

	assert.equal(ld.listDetailContainer.length, 1);
	assert.deepEqual(ld.listDetailContainer, $('#test-list-detail').find('.list-detail'));
	assert.notOk(ld.listDetailContainer.is(':visible'));
	assert.ok(ld.listDetailContainer.hasClass('ctl-collapse'));
	
	assert.equal(ld.listContainer.length, 1);
	assert.deepEqual(ld.listContainer, $('#test-list-detail').find('.list'));
	
	assert.equal(ld.detailContainer.length, 1);
	assert.deepEqual(ld.detailContainer, $('#test-list-detail').find('.detail'));
	
	assert.equal(ld.detail.length, 1);
	assert.deepEqual(ld.detail, $('#test-list-detail').find('.detail').find('p'));

	assert.equal(ld.listTitle.length, 1);
	assert.deepEqual(ld.listTitle, $('#test-list-detail').find('.list').find('span.title'));
	
	assert.equal(ld.detailTitle.length, 1);
	assert.deepEqual(ld.detailTitle, $('#test-list-detail').find('.detail').find('span.title'));
	
	assert.deepEqual(ld.cdSrTypeDrilldown, this.MOCK_SODA);
});

QUnit.test('srListDetail (no title)', function(assert){
	assert.expect(7);
	
	var done = assert.async();
	
	var data = this.MOCK_SR_DATA;
	
	var moreFields = nyc.sr.ListDetail.SR_DETAIL_MORE;
	
	var expectedDetail = $('<div></div>');
	$('body').append(expectedDetail);
	
	var ld = new nyc.sr.ListDetail({
		target: '#test-list-detail',
		cdSrTypeDrilldown: this.MOCK_SODA
	});
	
	assert.ok(ld.detailContainer.collapsible('option', 'collapsed'));
	assert.ok($('#loading').is(':visible'));
	
	ld.srListDetail(data, {});

	assert.equal(ld.detailTitle.html(), 'Blocked Driveway (6)');
	assert.notOk(ld.detailContainer.collapsible('option', 'collapsed'));
	assert.equal(ld.detail.children().length, 6);
	
	ld.detail.children().each(function(i, actual){
		var expected = $(ld.replace(nyc.sr.ListDetail.SR_DETAIL_HTML, data[i]));
		var more = $('<div class="more"></div>');
		expected.append(more);
		expectedDetail.append(expected).trigger('create');
		
		if (i % 2 != 0){
			expected.addClass('odd-row');
		}
		
		for (var field in moreFields){
			var val = (data[i][field] || '').trim();
			if (val){
				more.append(ld.replace(moreFields[field], data[i]));
			}
		}
	});
	
	nyc.util.formatDateHtml({
		elements: expectedDetail.find('.sr-date')
	});		

	assert.equal(ld.detail.html(), expectedDetail.html());

	setTimeout(function(){
		assert.notOk($('#loading').is(':visible'));
		expectedDetail.remove();
		done();
	}, 600);
});

QUnit.test('srListDetail (has title)', function(assert){
	assert.expect(7);
	
	var done = assert.async();
	
	var data = this.MOCK_SR_DATA;
	
	var moreFields = nyc.sr.ListDetail.SR_DETAIL_MORE;
	
	var expectedDetail = $('<div></div>');
	$('body').append(expectedDetail);
	
	var ld = new nyc.sr.ListDetail({
		target: '#test-list-detail',
		cdSrTypeDrilldown: this.MOCK_SODA
	});
	
	assert.ok(ld.detailContainer.collapsible('option', 'collapsed'));
	assert.ok($('#loading').is(':visible'));
	
	ld.srListDetail(data, null, 'a title');

	assert.equal(ld.detailTitle.html(), 'a title (6)');
	assert.notOk(ld.detailContainer.collapsible('option', 'collapsed'));
	assert.equal(ld.detail.children().length, 6);
	
	ld.detail.children().each(function(i, actual){
		var expected = $(ld.replace(nyc.sr.ListDetail.SR_DETAIL_HTML, data[i]));
		var more = $('<div class="more"></div>');
		expected.append(more);
		expectedDetail.append(expected).trigger('create');
		
		if (i % 2 != 0){
			expected.addClass('odd-row');
		}
		
		for (var field in moreFields){
			var val = (data[i][field] || '').trim();
			if (val){
				more.append(ld.replace(moreFields[field], data[i]));
			}
		}
	});
	
	nyc.util.formatDateHtml({
		elements: expectedDetail.find('.sr-date')
	});		

	assert.equal(ld.detail.html(), expectedDetail.html());

	setTimeout(function(){
		assert.notOk($('#loading').is(':visible'));
		expectedDetail.remove();
		done();
	}, 600);
});

QUnit.test('srList', function(assert){
	assert.expect(8);
	
	var ld = new nyc.sr.ListDetail({
		target: '#test-list-detail',
		cdSrTypeDrilldown: this.MOCK_SODA
	});

	ld.srListDetail = function(data, soda, title){
		assert.equal(data, 'mock-data');
		assert.notOk(soda);
		assert.equal(title, 'Service Requests');
	};
	
	assert.notOk(ld.listDetailContainer.is(':visible'));
	assert.ok(ld.container.collapsible('option', 'collapsed'));
	
	ld.srList('mock-data');

	assert.ok(ld.listDetailContainer.is(':visible'));
	assert.notOk(ld.container.find('.list').is(':visible'));
	assert.notOk(ld.container.collapsible('option', 'collapsed'));
});

QUnit.test('cdList', function(assert){
	assert.expect(15);
	
	var data = this.MOCK_CD_DATA;

	var expectedTable = $(nyc.sr.ListDetail.CD_LIST_HTML);
	var div = $('<div></div>');
	div.append(expectedTable);
	$('body').append(div);
	
	this.MOCK_SODA.setFilters = function(filters){
		assert.equal(filters, 'mock-filers');
	};
	
	var ld = new nyc.sr.ListDetail({
		target: '#test-list-detail',
		cdSrTypeDrilldown: this.MOCK_SODA
	});

	ld.cdListHeading = function(row){
		assert.deepEqual(row, data[0]);
		return 'a title';
	};
	
	var rowIdx;
	ld.cdDrilldown = function(event){
		assert.deepEqual($(event.target).data('soda-row'), data[rowIdx]);
	};
	
	ld.cdList(data, 'mock-filers');

	ld.list.find('table.cd-info tbody tr').each(function(i, actual){
		var expectedRow = $(ld.replace(nyc.sr.ListDetail.CD_TR_HTML, data[i]));
		expectedTable.find('tbody').append(expectedRow);
		rowIdx = i;
		$(actual).find('a').trigger('click');
	});
	
	assert.ok(ld.listDetailContainer.is(':visible'));
	assert.equal(ld.listTitle.html(), 'a title');
	assert.ok(ld.container.find('.list').is(':visible'));
	assert.notOk(ld.container.collapsible('option', 'collapsed'));
	assert.notOk(ld.listContainer.collapsible('option', 'collapsed'));
	
	assert.equal(ld.list.html(), div.html());
		
	div.remove();
});

QUnit.test('cdDrilldown', function(assert){
	assert.expect(5);

	var done = assert.async();
	
	var a = $('<a></a>');
	a.data('soda-row', this.MOCK_CD_DATA[3]);
	
	this.MOCK_SODA.setFilter = function(field, filter){
		this.filters[field] = filter;
	};
	
	this.MOCK_SODA.execute = function(options, callback){
		callback('mock-soda-data', this);
	};
	
	$('#loading').hide();
	
	var ld = new nyc.sr.ListDetail({
		target: '#test-list-detail',
		cdSrTypeDrilldown: this.MOCK_SODA
	});
	
	ld.srListDetail = function(data, soda, title){
		assert.equal(data, 'mock-soda-data');
		assert.deepEqual(soda, ld.cdSrTypeDrilldown);
		assert.notOk(title);
	};
	
	ld.cdDrilldown({target: a.get(0)});
	
	assert.deepEqual(this.MOCK_SODA.filters, {
		complaint_type: {op: '=', value: this.MOCK_CD_DATA[3].complaint_type},
		community_board: {op: '=', value: this.MOCK_CD_DATA[3].community_board}
	});
	
	setTimeout(function(){
		assert.ok($('#loading').is(':visible'));
		done();
	}, 600);
});

QUnit.test('cdListHeading', function(assert){
	assert.expect(5);
	
	var ld = new nyc.sr.ListDetail({
		target: '#test-list-detail',
		cdSrTypeDrilldown: this.MOCK_SODA
	});	
	
	assert.equal(ld.cdListHeading({community_board: '11 MANHATTAN'}), 'manhattan 11');
	assert.equal(ld.cdListHeading({community_board: '02 BRONX'}), 'bronx 2');
	assert.equal(ld.cdListHeading({community_board: '20 BROOKLYN'}), 'brooklyn 20');
	assert.equal(ld.cdListHeading({community_board: '05 QUEENS'}), 'queens 5');
	assert.equal(ld.cdListHeading({community_board: '01 STATEN ISLAND'}), 'staten island 1');
});