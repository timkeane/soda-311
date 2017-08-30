QUnit.module('nyc.sr.Buckets', {
	beforeEach: function(assert){
		$('body').append('<div id="record-count"><span></span></div>');
	},
	afterEach: function(assert){
		$('#record-count').remove();
	}
});

QUnit.test('count up', function(assert){
	assert.expect(30);
	
	var done = assert.async();
	
	var count = 0;
	var formatNumberHtml = nyc.util.formatNumberHtml;
	
	nyc.util.formatNumberHtml = function(args){
		count++;
		assert.equal(args.elements.html(), count);
		assert.equal(args.elements.length, 1);
		assert.deepEqual(args.elements, $('#record-count span'));
		if (count == 10){
			done();
			nyc.util.formatNumberHtml = formatNumberHtml;
		}
	};

	$('#record-count span').html(count);
	
	var buckets = new nyc.sr.Buckets('#record-count span');
		
	buckets.count(10);
});

QUnit.test('count down', function(assert){
	assert.expect(30);
	
	var done = assert.async();
	
	var count = 10;
	var formatNumberHtml = nyc.util.formatNumberHtml;
	
	nyc.util.formatNumberHtml = function(args){
		count--;
		assert.equal(args.elements.html(), count);
		assert.equal(args.elements.length, 1);
		assert.deepEqual(args.elements, $('#record-count span'));
		if (count == 0){
			done();
			nyc.util.formatNumberHtml = formatNumberHtml;
		}
	};

	$('#record-count span').html(count);
	
	var buckets = new nyc.sr.Buckets('#record-count span');
		
	buckets.count(0);
});

QUnit.test('build', function(assert){
	assert.expect(32);
	
	var rowIdx = 0;
	
	var data = [
		{id: 0, sr_count: 2},
		{id: 1, sr_count: 3},
		{id: 2, sr_count: 1},
		{id: 3, sr_count: 1},
		{id: 4, sr_count: 1},
		{id: 5, sr_count: 1},
		{id: 6, sr_count: 2},
		{id: 7, sr_count: 11},
		{id: 8, sr_count: 50},
		{id: 9, sr_count: 4}
	];
	
	var mockSource = {
		getFeatureById: function(id){
			var row = data[rowIdx];
			rowIdx++;
			assert.equal(id, row.id);
			return {
				set: function(prop, val){
					assert.equal(prop, 'sr_count');
					assert.equal(val, row.sr_count * 1);
				}
			};
		}
	};
	
	var buckets = new nyc.sr.Buckets('#record-count span');
	
	buckets.count = function(countTo){
		assert.equal(countTo, 76);
	};
	
	var result = buckets.build(data, mockSource);
	
	assert.deepEqual(result, {
		breaks: [11, 21, 31, 41, 50],
		buckets: [[1, 11], [11, 21], [21, 31], [31, 41], [41, 50]],
		total: 76
	});
});
