QUnit.module('nyc.sr.ListDetail', {
	beforeEach: function(assert){
		$('body').append('<div id="test-list-detail"></div>');
		this.MOCK_SODA = {};
	},
	afterEach: function(assert){
		$('#test-list-detail').remove();
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

QUnit.test('srListDetail', function(assert){
	assert.expect(0);
});