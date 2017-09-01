var SR_TYPE_COUNT = [
	{complaint_type: 'Noise - Residential', sr_count:'227780'},
	{complaint_type: 'HEAT/HOT WATER', sr_count:'210597'},
	{complaint_type: 'Illegal Parking', sr_count:'138591'},
	{complaint_type: 'Blocked Driveway', sr_count:'130109'},
	{complaint_type: 'Street Condition', sr_count:'95516'},
	{complaint_type: 'Street Light Condition', sr_count:'83615'},
	{complaint_type: 'UNSANITARY CONDITION', sr_count:'79531'},
	{complaint_type: 'Noise - Street/Sidewalk', sr_count:'69217'},
	{complaint_type: 'Water System', sr_count:'65668'},
	{complaint_type: 'Noise', sr_count:'59175'},
	{complaint_type: 'PAINT/PLASTER', sr_count:'58744'},
	{complaint_type: 'PLUMBING', sr_count:'51254'},
	{complaint_type: 'Noise - Commercial', sr_count:'47608'},
	{complaint_type: 'Sanitation Condition', sr_count:'37331'},
	{complaint_type: 'Traffic Signal Condition', sr_count:'36128'},
	{complaint_type: 'DOOR/WINDOW', sr_count:'35752'},
	{complaint_type: 'Dirty Conditions', sr_count:'35149'},
	{complaint_type: 'Sewer', sr_count:'34491'},
	{complaint_type: 'Rodent', sr_count:'34442'},
	{complaint_type: 'Missed Collection (All Materials)', sr_count:'34281'},
	{complaint_type: 'DOF Literature Request', sr_count:'33130'},
	{complaint_type: 'Derelict Vehicle', sr_count:'32908'},
	{complaint_type: 'WATER LEAK', sr_count:'32683'}
];

var SR_COUNT_BY_CD = [
	{id: '26 BRONX', sr_count: '1'},
	{id: '84 QUEENS', sr_count: '1'},
	{id: '56 BROOKLYN', sr_count: '1'},
	{id: '27 BRONX', sr_count: '2'},
	{id: '55 BROOKLYN', sr_count: '2'},
	{id: '82 QUEENS', sr_count: '3'},
	{id: '64 MANHATTAN', sr_count: '6'},
	{id: '80 QUEENS', sr_count: '8'},
	{id: '83 QUEENS', sr_count: '10'},
	{id: '81 QUEENS', sr_count: '14'},
	{id: '02 BRONX', sr_count: '102'},
	{id: '13 BROOKLYN', sr_count: '130'},
	{id: '01 BRONX', sr_count: '164'},
	{id: '06 QUEENS', sr_count: '166'},
	{id: '03 BRONX', sr_count: '167'},
	{id: '11 QUEENS', sr_count: '178'},
	{id: '16 BROOKLYN', sr_count: '181'},
	{id: '06 MANHATTAN', sr_count: '199'},
	{id: '06 BRONX', sr_count: '202'},
	{id: '08 BRONX', sr_count: '208'},
	{id: '06 BROOKLYN', sr_count: '209'},
	{id: '01 MANHATTAN', sr_count: '211'},
	{id: '08 MANHATTAN', sr_count: '220'},
	{id: '14 QUEENS', sr_count: '221'},
	{id: '02 STATEN ISLAND', sr_count: '225'},
	{id: '10 BRONX', sr_count: '248'},
	{id: '02 QUEENS', sr_count: '262'},
	{id: '08 BROOKLYN', sr_count: '265'},
	{id: '02 MANHATTAN', sr_count: '268'},
	{id: '07 BROOKLYN', sr_count: '271'},
	{id: '11 MANHATTAN', sr_count: '273'},
	{id: '12 BROOKLYN', sr_count: '278'},
	{id: '03 STATEN ISLAND', sr_count: '279'},
	{id: '05 MANHATTAN', sr_count: '280'},
	{id: '11 BRONX', sr_count: '288'},
	{id: '04 MANHATTAN', sr_count: '288'},
	{id: '04 QUEENS', sr_count: '296'},
	{id: '14 BROOKLYN', sr_count: '300'},
	{id: '05 BRONX', sr_count: '301'},
	{id: '08 QUEENS', sr_count: '301'},
	{id: '10 BROOKLYN', sr_count: '302'},
	{id: '15 BROOKLYN', sr_count: '312'},
	{id: '02 BROOKLYN', sr_count: '312'},
	{id: '11 BROOKLYN', sr_count: '314'},
	{id: '07 MANHATTAN', sr_count: '318'},
	{id: '09 BRONX', sr_count: '321'},
	{id: '09 BROOKLYN', sr_count: '329'},
	{id: '04 BRONX', sr_count: '337'},
	{id: '03 MANHATTAN', sr_count: '339'},
	{id: '09 MANHATTAN', sr_count: '344'},
	{id: '03 QUEENS', sr_count: '351'},
	{id: '01 STATEN ISLAND', sr_count: '358'},
	{id: '10 MANHATTAN', sr_count: '365'},
	{id: '12 BRONX', sr_count: '378'},
	{id: '04 BROOKLYN', sr_count: '382'},
	{id: '07 BRONX', sr_count: '393'},
	{id: '10 QUEENS', sr_count: '403'},
	{id: '17 BROOKLYN', sr_count: '413'},
	{id: '13 QUEENS', sr_count: '421'},
	{id: '01 BROOKLYN', sr_count: '432'},
	{id: '09 QUEENS', sr_count: '444'},
	{id: '05 BROOKLYN', sr_count: '459'},
	{id: '05 QUEENS', sr_count: '466'},
	{id: '03 BROOKLYN', sr_count: '472'},
	{id: '01 QUEENS', sr_count: '491'},
	{id: '07 QUEENS', sr_count: '502'},
	{id: '18 BROOKLYN', sr_count: '504'},
	{id: '12 QUEENS', sr_count: '530'},
	{id: '12 MANHATTAN', sr_count: '791'}
];

var SR_COUNT_BY_LOCATION = [
	{
		id: '999446 174840',
		sr_count: '1',
		x_coordinate_state_plane: '999446',
		y_coordinate_state_plane: '174840'
	},{
		id: '995958 170019',
		sr_count: '1',
		x_coordinate_state_plane: '995958',
		y_coordinate_state_plane: '170019'
	},{
		id: '996628 172209',
		sr_count: '1',
		x_coordinate_state_plane: '996628',
		y_coordinate_state_plane: '172209'
	},{
		id: '997462 178320',
		sr_count: '1',
		x_coordinate_state_plane: '997462',
		y_coordinate_state_plane: '178320'
	},{
		id: '997994 190656',
		sr_count: '1',
		x_coordinate_state_plane: '997994',
		y_coordinate_state_plane: '190656'
	},{
		id: '998524 173013',
		sr_count: '1',
		x_coordinate_state_plane: '998524',
		y_coordinate_state_plane: '173013'
	},{
		id: '1001431 248388',
		sr_count: '1',
		x_coordinate_state_plane: '1001431',
		y_coordinate_state_plane: '248388'
	},{
		id: '1002759 176681',
		sr_count: '1',
		x_coordinate_state_plane: '1002759',
		y_coordinate_state_plane: '176681'
	},{
		id: '1002809 177422',
		sr_count: '1',
		x_coordinate_state_plane: '1002809',
		y_coordinate_state_plane: '177422'
	},{
		id: '1002810 176070',
		sr_count: '1',
		x_coordinate_state_plane: '1002810',
		y_coordinate_state_plane: '176070'
	},{
		id: '1002964 188956',
		sr_count: '1',
		x_coordinate_state_plane: '1002964',
		y_coordinate_state_plane: '188956'
	},{
		id: '1003083 250522',
		sr_count: '1',
		x_coordinate_state_plane: '1003083',
		y_coordinate_state_plane: '250522'
	},{
		id: '1003615 251323',
		sr_count: '1',
		x_coordinate_state_plane: '1003615',
		y_coordinate_state_plane: '251323'
	},{
		id: '1004838 255242',
		sr_count: '1',
		x_coordinate_state_plane: '1004838',
		y_coordinate_state_plane: '255242'
	},{
		id: '1006531 241465',
		sr_count: '1',
		x_coordinate_state_plane: '1006531',
		y_coordinate_state_plane: '241465'
	},{
		id: '1006787 190850',
		sr_count: '1',
		x_coordinate_state_plane: '1006787',
		y_coordinate_state_plane: '190850'
	},{
		id: '1006903 194488',
		sr_count: '1',
		x_coordinate_state_plane: '1006903',
		y_coordinate_state_plane: '194488'
	},{
		id: '1007188 187681',
		sr_count: '1',
		x_coordinate_state_plane: '1007188',
		y_coordinate_state_plane: '187681'
	},{
		id: '1009125 237325',
		sr_count: '1',
		x_coordinate_state_plane: '1009125',
		y_coordinate_state_plane: '237325'
	},{
		id: '1009130 221917',
		sr_count: '1',
		x_coordinate_state_plane: '1009130',
		y_coordinate_state_plane: '221917'
	},{
		id: '1009319 190763',
		sr_count: '1',
		x_coordinate_state_plane: '1009319',
		y_coordinate_state_plane: '190763'
	},{
		id: '1010105 220285',
		sr_count: '1',
		x_coordinate_state_plane: '1010105',
		y_coordinate_state_plane: '220285'
	},{
		id: '1010183 208903',
		sr_count: '1',
		x_coordinate_state_plane: '1010183',
		y_coordinate_state_plane: '208903'
	},{
		id: '1010457 262672',
		sr_count: '1',
		x_coordinate_state_plane: '1010457',
		y_coordinate_state_plane: '262672'
	},{
		id: '1010551 185876',
		sr_count: '1',
		x_coordinate_state_plane: '1010551',
		y_coordinate_state_plane: '185876'
	},{
		id: '1010688 253908',
		sr_count: '1',
		x_coordinate_state_plane: '1010688',
		y_coordinate_state_plane: '253908'
	},{
		id: '1010695 253922',
		sr_count: '1',
		x_coordinate_state_plane: '1010695',
		y_coordinate_state_plane: '253922'
	},{
		id: '1012183 238406',
		sr_count: '1',
		x_coordinate_state_plane: '1012183',
		y_coordinate_state_plane: '238406'
	},{
		id: '1012676 183036',
		sr_count: '1',
		x_coordinate_state_plane: '1012676',
		y_coordinate_state_plane: '183036'
	},{
		id: '1013827 249097',
		sr_count: '1',
		x_coordinate_state_plane: '1013827',
		y_coordinate_state_plane: '249097'
	},{
		id: '1015279 235344',
		sr_count: '1',
		x_coordinate_state_plane: '1015279',
		y_coordinate_state_plane: '235344'
	},{
		id: '1016880 207599',
		sr_count: '1',
		x_coordinate_state_plane: '1016880',
		y_coordinate_state_plane: '207599'
	},{
		id: '1017024 179841',
		sr_count: '1',
		x_coordinate_state_plane: '1017024',
		y_coordinate_state_plane: '179841'
	},{
		id: '1023310 252768',
		sr_count: '1',
		x_coordinate_state_plane: '1023310',
		y_coordinate_state_plane: '252768'
	},{
		id: '1024581 266201',
		sr_count: '1',
		x_coordinate_state_plane: '1024581',
		y_coordinate_state_plane: '266201'
	},{
		id: '1025369 188709',
		sr_count: '1',
		x_coordinate_state_plane: '1025369',
		y_coordinate_state_plane: '188709'
	},{
		id: '1051639 197765',
		sr_count: '1',
		x_coordinate_state_plane: '1051639',
		y_coordinate_state_plane: '197765'
	},{
		id: '943269 169468',
		sr_count: '1',
		x_coordinate_state_plane: '943269',
		y_coordinate_state_plane: '169468'
	},{
		id: '982584 184886',
		sr_count: '1',
		x_coordinate_state_plane: '982584',
		y_coordinate_state_plane: '184886'
	},{
		id: '984351 202331',
		sr_count: '1',
		x_coordinate_state_plane: '984351',
		y_coordinate_state_plane: '202331'
	},{
		id: '984614 213220',
		sr_count: '1',
		x_coordinate_state_plane: '984614',
		y_coordinate_state_plane: '213220'
	},{
		id: '985267 212563',
		sr_count: '1',
		x_coordinate_state_plane: '985267',
		y_coordinate_state_plane: '212563'
	},{
		id: '986560 180836',
		sr_count: '1',
		x_coordinate_state_plane: '986560',
		y_coordinate_state_plane: '180836'
	},{
		id: '987121 195024',
		sr_count: '1',
		x_coordinate_state_plane: '987121',
		y_coordinate_state_plane: '195024'
	},{
		id: '987146 204446',
		sr_count: '1',
		x_coordinate_state_plane: '987146',
		y_coordinate_state_plane: '204446'
	},{
		id: '988749 198872',
		sr_count: '1',
		x_coordinate_state_plane: '988749',
		y_coordinate_state_plane: '198872'
	},{
		id: '988862 203892',
		sr_count: '1',
		x_coordinate_state_plane: '988862',
		y_coordinate_state_plane: '203892'
	},{
		id: '989395 224914',
		sr_count: '1',
		x_coordinate_state_plane: '989395',
		y_coordinate_state_plane: '224914'
	},{
		id: '989586 204227',
		sr_count: '1',
		x_coordinate_state_plane: '989586',
		y_coordinate_state_plane: '204227'
	},{
		id: '991599 227959',
		sr_count: '1',
		x_coordinate_state_plane: '991599',
		y_coordinate_state_plane: '227959'
	},{
		id: '991913 187122',
		sr_count: '1',
		x_coordinate_state_plane: '991913',
		y_coordinate_state_plane: '187122'
	},{
		id: '995925 186621',
		sr_count: '1',
		x_coordinate_state_plane: '995925',
		y_coordinate_state_plane: '186621'
	},{
		id: '1006622 185391',
		sr_count: '2',
		x_coordinate_state_plane: '1006622',
		y_coordinate_state_plane: '185391'
	},{
		id: '1005205 210076',
		sr_count: '2',
		x_coordinate_state_plane: '1005205',
		y_coordinate_state_plane: '210076'
	},{
		id: '1006507 192216',
		sr_count: '2',
		x_coordinate_state_plane: '1006507',
		y_coordinate_state_plane: '192216'
	},{
		id: '997276 178308',
		sr_count: '2',
		x_coordinate_state_plane: '997276',
		y_coordinate_state_plane: '178308'
	},{
		id: '1019783 219655',
		sr_count: '3',
		x_coordinate_state_plane: '1019783',
		y_coordinate_state_plane: '219655'
	},{
		id: '1002686 249226',
		sr_count: '4',
		x_coordinate_state_plane: '1002686',
		y_coordinate_state_plane: '249226'
	}
];
