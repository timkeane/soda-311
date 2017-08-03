nyc.soda = {};

nyc.soda.Query = function(options){
	options = options || {};
	this.query = {};
	this.setUrl(options.url);
	this.setQuery(options.query);
	this.addFilters(options.filters);
};

nyc.soda.Query.prototype = {
	url: null,
	baseWhereClause: null,
	query: null,
	setUrl: function(url){
		this.url = url || this.url;
	},
	clearFilter: function(field){
		delete this.filters[field];
	},
	/**
	 * @desc
	 * @public
	 * @method
	 * @param {Array<Object<string, Array<nyc.soda.Query.Filter>>>}
	 */
	addFilters: function(filters){
		var me = this;
		for (var field in filters){
			$.each(filters[field], function(){
				me.addFilter(field, this);
			});
		}
	},
	addFilter: function(field, filter){
		var value = filter.value, where;
		filter.op = filter.op.toUpperCase();
		if (typeof value == 'string'){
			value = "'" + value + "'";
		}else if (typeof value == 'number'){
			value = value + '';
		}else if ($.isArray(value)){
			if (typeof value[0] == 'number'){
				value = '(' + value.toString() + ')';
			}else{
				value = "('" + value.join("', '") + "')";
			}
		}
		where = nyc.soda.Query.and(field + ' ' + filter.op + ' ' + value);
		console.warn(where);
		this.query.where = where;
	},
	setQuery: function(query){
		query = query || {};
		this.query.select = query.select || this.query.select;
		this.query.where = query.where || this.query.where;
		this.query.group = query.group || this.query.group;
		this.query.order = query.order || this.query.order;
		this.query.limit = query.limit || this.query.limit;
		this.baseWhereClause = this.query.where || '';
	},
	execute: function(options){
		var me = this, csv;
		options = options || {};
		me.setUrl(options.url);
		csv = me.csv();
		me.setQuery(options.query);
		me.addFilters(options.filters);
		$.ajax({
			url: me.url,
			method: 'GET',
			data: me.qstr(),
			success: function(data){
				me.callback(data, csv, options.callback);
			}
		});
	},
	qstr: function(){
		var qry = {};
		for (var p in this.query){
			qry['$' + p] = this.query[p];
		}
		return $.param(qry);
	},
	getUrlAndQuery: function(){
		return this.url + '?' + this.qstr();
	},
	callback: function(data, csv, callback){
		var data = this.csv() ? $.csv.toObjects(data) : data; 
		if (callback) {
			callback(data, this);
		}
	},
	csv: function(){
		var idxCsv = this.url.indexOf('.csv');
		var idxQstr = this.url.indexOf('?');
		var len = this.url.length;
		var csvPos = len - idxCsv;
		var qstrPos = len - idxQstr;
		return idxCsv > -1 && (csvPos == 4 || (qstrPos == csvPos - 4));
		
	}
};

nyc.soda.Query.and = function(where, more){
	if (more){
		return where + ' AND ' + more;
	}
	return where;	
};

/**
 * @desc Filter object for {nyc.soda.Query}
 * @public
 * @type
 * @property {string} op Filter operator (=, !=, >, <, >=, <=, IN, NOT IN, BETWEEN, NOT BETWEEN)
 * @property {string|number|Array<string>|Array<number>} value Filter value
 */
nyc.soda.Query.Filter;

/**
 * @desc Query object for {nyc.soda.Query}
 * @public
 * @type
 * @property {string} select SODA $select parameter
 * @property {string} where SODA $where parameter
 * @property {string} group SODA $group parameter
 * @property {string} order SODA $order parameter
 * @property {string} limit SODA $limit parameter
 */
nyc.soda.Query.Query;

/**
 * @desc Constructor options for {nyc.soda.Query}
 * @public
 * @type
 * @property {string} url SODA URL
 * @property {nyc.soda.Query.Query=} query Query options
 * @property {Array<Object<string, Array<nyc.soda.Query.Filter>>>=} filters Filters
 */
nyc.soda.Query.Options;

/**
 * @desc Options for {nyc.soda.Query#execute}
 * @public
 * @type
 * @property {string} url SODA URL
 * @property {nyc.soda.Query.Query=} query Query options
 * @property {Array<Object<string, Array<nyc.soda.Query.Filter>>>=} filters Filters
 * @property {Function=} callback Callback function
 */
nyc.soda.Query.ExecOptions;

