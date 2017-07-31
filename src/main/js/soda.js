nyc.soda = {};

nyc.soda.Query = function(url, options){
	this.query = {};
	this.setUrl(options.url);
	this.setQuery(options.query);
};

nyc.soda.Query.prototype = {
	url: null,
	query: null,
	setUrl: function(url){
		this.url = url || this.url;
	},
	setQuery: function(options){
		this.query.$select = options.select || this.query.$select;
		this.query.$where = options.where || this.query.$where;
		this.query.$group = options.group || this.query.$group;
		this.query.$order = options.order || this.query.$order;
	},
	execute: function(options){
		this.setUrl(options.url);
		this.setQuery(options.query);
		$.ajax({
			url: this.url,
			method: 'GET',
			data: $.param(this.query),
			success: options.callback
		});
	}
};

