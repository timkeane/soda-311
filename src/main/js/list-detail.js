nyc.sr = nyc.sr || {};

nyc.sr.ListDetail = function(options){
	var collapsible = new nyc.Collapsible({target: $(options.target), title: 'Service Request Info'});
	this.container = collapsible.container;
	this.container.find('.ui-collapsible-content').append(nyc.sr.ListDetail.LIST_DETAIL_HTML).trigger('create');
	
	$('#list-detail .list-detail').collapsibleset('option', {
		collapsedIcon: 'carat-d', 
		expandedIcon: 'carat-u'
	}).addClass('ctl-collapse');

	this.list = this.container.find('.list p');
	this.detail = this.container.find('.detail p'); 
	this.listTitle = this.container.find('.list span.title');
	this.detailTitle = this.container.find('.detail span.title');	
	
	this.cdSrTypeDrilldown = options.cdSrTypeDrilldown;
};

nyc.sr.ListDetail.prototype = {
	container: null,
	list: null,
	detail: null,
	listTitle: null,
	detailTitle: null,
	cdSrTypeDrilldown: null,
	srSummary: function(data){
	
	},
	srDetail: function(key){
		
	},
	cdList: function(data, where){
		var me = this, table = $(nyc.sr.ListDetail.CD_LIST_HTML), tbody = table.find('tbody');
		this.cdSrTypeDrilldown.setQuery({where: where});
		me.listTitle.html(me.cdListHeading(data[0]));
		$.each(data, function(){
			var row = $(me.replace(nyc.sr.ListDetail.CD_TR_HTML, this));
			tbody.append(row);
			row.find('a').data('soda-row', this).click($.proxy(me.cdDrilldown, me));
		});
		this.list.html(table);
		this.container.collapsible('expand');
	},
	cdDrilldown: function(event){
		var row = $(event.target).data('soda-row');
		var where = this.cdSrTypeDrilldown.query.where;
		where = nyc.soda.Query.and(where, "complaint_type = '" + row.complaint_type + "'");
		this.cdSrTypeDrilldown.execute({
			where: where,
			callback: function(){console.warn(arguments);}
		});
	},
	cdListHeading: function(row){
		var orig = row.community_board;
		var num = orig.split(' ')[0];
		var boro = orig.replace(num, '').trim().toLowerCase();
		return boro + ' ' + (num * 1);
	}
};

nyc.inherits(nyc.sr.ListDetail, nyc.ReplaceTokens);

nyc.sr.ListDetail.CD_LIST_HTML = '<table class="cd-info"><thead><tr><th>Count</th><th>Type</th></tr></thead><tbody></tbody></table>';

nyc.sr.ListDetail.CD_TR_HTML = '<tr><td>${sr_count}</td><td><a>${complaint_type}</a></td></tr>';

nyc.sr.ListDetail.SR_SUMMARY_HTML = '';

nyc.sr.ListDetail.SR_DETAIL_HTML = '';

nyc.sr.ListDetail.LIST_DETAIL_HTML = '<div class="list-detail" data-role="collapsible-set"><div class="list" data-role="collapsible" data-collapsed="false"><h3><span class="title"></span></h3><p></p></div><div class="detail" data-role="collapsible"><h3><span class="title">Detail</span></h3><p></p></div></div>';

