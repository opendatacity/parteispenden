	// Konstanten für Spalten
	var spPartei=0;
	var spName=1;
	var spVorname=2;
	var spStrasse=3;
	var spPlz=4;
	var spOrt=5;
	var spLand=6;
	var spSpende=7;
	var spLat=8;
	var spLon=9;
	
	// kumuliertes csv
	var kumPartei=0;
	var kumMitglied=1;
	var kumMandat=2;
	var kumNatPers=3;
	var kumJurPers=4;
	
	// Marker für Parteien
	var colors = {
		'CDU':   '#111111',
		'CSU':   '#666666',
		'SPD':   '#D61E1E',
		'FDP':   '#E4A300',
		'GRUENE':'#78BC1B',
		'LINKE': '#BD3075'
	};
	
	var barColors = [colors.CDU, colors.CSU, colors.SPD, colors.FDP, colors.GRUENE, colors.LINKE];
	
	var fields_kum = new Array();
	var fields_kum_temp = new Array();
	fields_kum['CDU'] = new Array();
	fields_kum['CSU'] = new Array();
	fields_kum['SPD'] = new Array();
	fields_kum['FDP'] = new Array();
	fields_kum['GRUENE'] = new Array();
	fields_kum['LINKE'] = new Array();
	var fields = new Array;	
	
	function onPopupClose(evt) {
		try {
			selectControl.unselect(selectedFeature);
		} catch (e) {
			selectedFeature.popup.hide();
			selectedFeature.popup.destroy();
		}
	}

	function onFeatureSelect(feature) {
		selectedFeature = feature;
		popup = new OpenLayers.Popup.FramedCloud(
				'chicken',
				feature.geometry.getBounds().getCenterLonLat(),
				null,
				feature.attributes.some,
				null, 
				true, 
				onPopupClose
			);
			feature.popup = popup;
			map.addPopup(popup);
	}

	function onFeatureUnselect(feature) {
			map.removePopup(feature.popup);
			feature.popup.destroy();
			feature.popup = null;
	}	

	function printLine(fields) {
		var checkVars = new Array;
		checkVars['person'] =  (document.getElementById('person').checked == true);
		checkVars['unternehmen'] =  (document.getElementById('unternehmen').checked == true);
		
		checkVars['cdu'] =     (document.getElementById('cdu').checked == true);
		checkVars['csu'] =     (document.getElementById('csu').checked == true);
		checkVars['spd'] =     (document.getElementById('spd').checked == true);
		checkVars['fdp'] =     (document.getElementById('fdp').checked == true);
		checkVars['gruene'] =  (document.getElementById('gruene').checked == true);
		checkVars['linke'] =   (document.getElementById('linke').checked == true);
		
		checkVars['spende1'] = (document.getElementById('spende1').checked == true);
		checkVars['spende2'] = (document.getElementById('spende2').checked == true);
		checkVars['spende3'] = (document.getElementById('spende3').checked == true);
		checkVars['spende4'] = (document.getElementById('spende4').checked == true);
		checkVars['spende5'] = (document.getElementById('spende5').checked == true);
		
		checkVars['deutschland'] = (document.getElementById('deutschland').checked == true);
		checkVars['grossbritannien'] = false;
		checkVars['schweiz'] = false;
		checkVars['oesterreich'] = (document.getElementById('oesterreich').checked == true);
		checkVars['usa'] = false;
				
		return (checkPerson(fields,checkVars) && checkPartei(fields,checkVars) && checkSpende(fields,checkVars) && checkLand(fields,checkVars));
	}	
	
	function enableField(id, enable) {
		if (enable) {
			$('#'+id).removeAttr('disabled');
		} else {
			$('#'+id).attr('disabled', 'disabled');
		}
	}
	
	function enableFields(parteien, quellen, spenden, laender) {
		enableField('parteien_all', parteien);
		enableField('cdu', parteien);
		enableField('csu', parteien);
		enableField('spd', parteien);
		enableField('fdp', parteien);
		enableField('gruene', parteien);
		enableField('linke', parteien);
		
		enableField('person', quellen);
		enableField('unternehmen', quellen);
		
		enableField('spenden_all', spenden);
		enableField('spende1', spenden);
		enableField('spende2', spenden);
		enableField('spende3', spenden);
		enableField('spende4', spenden);
		enableField('spende5', spenden);
		
		enableField('laender_all', laender);
		enableField('deutschland', laender);
		enableField('oesterreich', laender);
	}
	
	function checkPerson(fields,checkVars) {
		if (checkVars['person'] && (fields[spVorname]!='')) {
			return true;
		}
		if (checkVars['unternehmen'] && (fields[spVorname]=='')) {
			return true;
		}
		return false;
	 	
	}

	function checkPartei(fields, checkVars) {
		if (checkVars['csu']    && (fields[spPartei]=='CSU')   ) return true;
		if (checkVars['cdu']    && (fields[spPartei]=='CDU')   ) return true;
		if (checkVars['spd']    && (fields[spPartei]=='SPD')   ) return true;
		if (checkVars['fdp']    && (fields[spPartei]=='FDP')   ) return true;
		if (checkVars['gruene'] && (fields[spPartei]=='GRUENE')) return true;
		if (checkVars['linke']  && (fields[spPartei]=='LINKE') ) return true;
		return false;
	}
	
	function checkSpende(fields, checkVars) {
		var spende = fields[spSpende];
		if (checkVars['spende1'] && (spende<25000)) return true;
		if (checkVars['spende2'] && (spende>=25000) && (spende<50000)) return true;
		if (checkVars['spende3'] && (spende>=50000) && (spende<75000)) return true;
		if (checkVars['spende4'] && (spende>=75000) && (spende<100000)) return true;
		if (checkVars['spende5'] && (spende>=100000)) return true;
		return false;
	}
	
	function checkLand(fields,checkVars) {
		if (checkVars['deutschland'] && fields[spLand]=='Deutschland') return true;
		if (checkVars['grossbritannien'] && fields[spLand]=='Großbritannien') return true;
		if (checkVars['schweiz'] && fields[spLand]=='Schweiz') return true;
		if (checkVars['oesterreich'] && fields[spLand]=='Österreich') return true;
		if (checkVars['usa'] && fields[spLand]=='USA') return true;
		return false;
	}
	
	// formatiert Zahlen 
	function number_format( number,laenge,sep,th_sep ) {

  		number = Math.round( number * Math.pow(10, laenge) ) / Math.pow(10, laenge);
	  	str_number = number+'';
	  	arr_int = str_number.split('.');
	  	if(!arr_int[0]) arr_int[0] = '0';
	  	if(!arr_int[1]) arr_int[1] = '';
	  	if(arr_int[1].length < laenge){
				nachkomma = arr_int[1];
				for(i=arr_int[1].length+1; i <= laenge; i++){  nachkomma += '0';  }
				arr_int[1] = nachkomma;
	  	}
	  	if(th_sep != '' && arr_int[0].length > 3){
				Begriff = arr_int[0];
				arr_int[0] = '';
				for(j = 3; j < Begriff.length ; j+=3){
		  			Extrakt = Begriff.slice(Begriff.length - j, Begriff.length - j + 3);
		  			arr_int[0] = th_sep + Extrakt +  arr_int[0] + '';
				}
				str_first = Begriff.substr(0, (Begriff.length % 3 == 0)?3:(Begriff.length % 3));
				arr_int[0] = str_first + arr_int[0];
	  	}
	  	return arr_int[0]+sep+arr_int[1];
	}
	
	function changeLayers() {
		
		var indizes1 = ['CDU', 'CSU', 'SPD', 'FDP', 'GRUENE', 'LINKE'];
		var indizes2 = ['nat_select', 'jur_select', 'sum_select', 'nat_select_anz', 'jur_select_anz', 'sum_select_anz'];
		
		$.each(indizes1, function (i, index1) {
			$.each(indizes2, function (i, index2) {
				fields_kum[index1][index2] = 0;
			});
		});
		
		// Für Liste Tabellenheader erstellen
		if ($('#tab_list').hasClass('active')) {
			output = '<table id="spendentable">';
			output += '<thead><tr>';
			output += '<th>Name</th>';				
			output += '<th>Straße</th>';
			output += '<th>&nbsp;&nbsp;PLZ&nbsp;&nbsp;</th>';
			output += '<th>Stadt</th>';
			output += '<th>&nbsp;Partei&nbsp;</th>';
			output += '<th>Spende<br />in €</th>';
			output += "</tr></thead>\n<tbody>";		
		}
		
		for (var x=0; x < fields.length; x++) {
			if (printLine(fields[x])) {
				
				// Liste
				if ($('#tab_list').hasClass('active')) {
					var line = '<tr><td><a href="#" onclick="openMap('+fields[x][spLat]+','+fields[x][spLon]+');return false;">';
					if ($.trim(fields[x][spVorname])) {
						line += $.trim(fields[x][spName])+', '+$.trim(fields[x][spVorname]);
					} else {
						line += $.trim(fields[x][spName]);
					}
					line += '</a></td>';
					line += '<td class="strasse">'+fields[x][spStrasse]+'</td>';
					switch (fields[x][spLand]) {
						case 'Deutschland':
							line += '<td class="plz">D-'+fields[x][spPlz]+'</td>';
							break;
						case 'Großbritannien':
							line += '<td class="plz">GB-'+fields[x][spPlz]+'</td>';
							break;
						case 'Österreich':
							line += '<td class="plz">AT-'+fields[x][spPlz]+'</td>';
							break;
						case 'Schweiz':
							line += '<td class="plz">CH-'+fields[x][spPlz]+'</td>';
							break;
						case 'USA':
							line += '<td class="plz">US-'+fields[x][spPlz]+'</td>';
							break;
						default:
							line += '<td class="plz">'+fields[x][spPlz]+'</td>';
					}
					line += '<td class="ort">'+fields[x][spOrt]+'</td>';
					// output = output + '<td class="land">'+fields[x][spLand]+'</td>';
					if (fields[x][spPartei]=='GRUENE') {
						line += '<td class="partei">GRÜNE</td>';
					}
					else {
						line += '<td class="partei">'+fields[x][spPartei]+'</td>';
					}
					line += '<td class="spende">'+number_format(fields[x][spSpende],2,',','.')+'</td>';
					line += "</tr>\n";
					output += line;
				}
				
				// Statistik
				if ($('#tab_stru').hasClass('active') || $('#tab_comp').hasClass('active')) {
					if ($.trim(fields[x][spVorname])){
						fields_kum[fields[x][spPartei]]['nat_select']+=fields[x][spSpende];
						fields_kum[fields[x][spPartei]]['nat_select_anz']++;
					} else {
						fields_kum[fields[x][spPartei]]['jur_select']+=fields[x][spSpende];
						fields_kum[fields[x][spPartei]]['jur_select_anz']++;
					}
					fields_kum[fields[x][spPartei]]['sum_select'] += fields[x][spSpende];
					fields_kum[fields[x][spPartei]]['sum_select_anz']++;
				}
			}
		}
		
		if ($('#tab_map').hasClass('active'))  enableFields(  true,  true,  true,  true);
		if ($('#tab_list').hasClass('active')) enableFields(  true,  true,  true,  true);
		if ($('#tab_stru').hasClass('active')) enableFields( false, false, false, false);
		if ($('#tab_comp').hasClass('active')) enableFields(  true,  true,  true,  true);
		if ($('#tab_info').hasClass('active')) enableFields( false, false, false, false);
		
		// Karte
		if ($('#tab_map').hasClass('active')) {
			redrawMarkers();
		}
		
		// Liste
		if ($('#tab_list').hasClass('active')) {
			output = output+'</tbody>\n</table>';
			$('#spenden').html(output);
			$('#spendentable').dataTable( {
				'bPaginate': false,
				'sDom': '<"top"iflp<"clear">>rt',
				'sScrollY': '456px',
				'oLanguage': {
					'sZeroRecords': 'Es konnten keine Spenden gefunden werden.',
					'sInfo': '_TOTAL_ Spenden',
					'sInfoEmpty': '0 Spenden',
					'sInfoFiltered': '<br />(gefiltert von _MAX_ Spenden insgesamt)',
					'sSearch': 'Suche'
				}
			}
			);
		}
		
		// Statistik
		if ($('#tab_stru').hasClass('active') || $('#tab_comp').hasClass('active')) {
			
			// Parteien 
			var Parteien = Array('CDU','CSU','SPD','FDP','GRUENE','LINKE');
			var data = Array();
			for (var i = 0; i < 6; i++) data[i]=[]
			for (var i = 0; i < Parteien.length; i++) {
				 data[0][i] = fields_kum[Parteien[i]]['nat_select']+fields_kum[Parteien[i]]['jur_select'];
				 data[1][i] = fields_kum[Parteien[i]]['nat_select_anz']+fields_kum[Parteien[i]]['jur_select_anz'];
				 data[2][i] = data[0][i]/data[1][i];
			}

			// output für Selection-Layer
			var myGraph1 = $.plot($('#stat_sum'),
				[
					[[0, data[0][0]]],
					[[1, data[0][1]]],
					[[2, data[0][2]]],
					[[3, data[0][3]]],
					[[4, data[0][4]]],
					[[5, data[0][5]]]
				],{
				   series: { bars: { show: true, barWidth: 0.5, align: 'center', lineWidth: 0.5, fill: 0.7 } },
				   xaxis: { autoscaleMargin:1/22, ticks: [[0, 'CDU'], [1, 'CSU'], [2, 'SPD'], [3, 'FDP'], [4, 'GRÜNE'], [5, 'LINKE']] },
				   yaxis: { ticks: [[0, '0'], [2000000, '2 Mio.'], [4000000, '4 Mio.'], [6000000, '6 Mio.']] },
				   grid: { backgroundColor: '#FFF', tickColor: '#FFF', borderWidth: 1, borderColor: '#CCC' },
				   colors: barColors
				}
			);
			
			for (var i = 0; i < 6; i++) {
				$.each(myGraph1.getData()[i].data, function(i, el) {
					var o = myGraph1.pointOffset({x: el[0], y: el[1]});
					if (el[1] || el[1]==0) {
						$('<div class="data-point-label">' + number_format(el[1]/1000000,1,',','.') + ' Mio.</div>').css( {
							left: o.left - 30,
							top: o.top - 13  
						}).appendTo(myGraph1.getPlaceholder());
					}
				});
			}
				
			var myGraph2 = $.plot($('#stat_anz'),
				[
					[[0, data[1][0]]],
					[[1, data[1][1]]],
					[[2, data[1][2]]],
					[[3, data[1][3]]],
					[[4, data[1][4]]],
					[[5, data[1][5]]]
				],{
			   	series: { bars: { show: true, barWidth: 0.5, align: 'center', lineWidth: 0.5, fill: 0.7 } },
				   xaxis: { autoscaleMargin:1/22, ticks: [[0, 'CDU'], [1, 'CSU'], [2, 'SPD'], [3, 'FDP'], [4, 'GRÜNE'], [5, 'LINKE']] },
				   yaxis: { ticks: [[0, '0'], [100, '100'], [200, '200'], [300, '300'], [400, '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;400']] },
				   grid: { backgroundColor: '#FFF', tickColor: '#FFF', borderWidth: 1, borderColor: '#CCC' },
				   colors: barColors
				}
			);
			
			for (var i=0; i<6; i++) {
				$.each(myGraph2.getData()[i].data, function(i, el){
					  var o = myGraph2.pointOffset({x: el[0], y: el[1]});
					  if (el[1] || el[1]==0) {
						  $('<div class="data-point-label">' + el[1]+ '</div>').css( {
							left: o.left - 30,
							top: o.top - 13
						}).appendTo(myGraph2.getPlaceholder());
					}
				});
			}
			
			var myGraph3 = $.plot($('#stat_avg_nat'),
				[
					[[0, data[2][0]]],
					[[1, data[2][1]]],
					[[2, data[2][2]]],
					[[3, data[2][3]]],
					[[4, data[2][4]]],
					[[5, data[2][5]]]
				],{
				   series: { bars: { show: true, barWidth: 0.5, align: 'center', lineWidth: 0.5, fill: 0.7 } },
				   xaxis: { autoscaleMargin:1/22, ticks: [[0, 'CDU'], [1, 'CSU'], [2, 'SPD'], [3, 'FDP'], [4, 'GRÜNE'], [5, 'LINKE']] },
				   yaxis: { tickFormatter: function (v) { return number_format(v,0,'','.') } },
				   grid: { backgroundColor: '#FFF', tickColor: '#FFF', borderWidth: 1, borderColor: '#CCC' },
				   colors: barColors
			});
			
			for (var i=0; i<6; i++) {
				$.each(myGraph3.getData()[i].data, function(i, el){
					var o = myGraph3.pointOffset({x: el[0], y: el[1]});
					if (el[1] || el[1]==0) {
						var y = o.top - 13;
						var color = '#555';
						if (y < 5) {
							y = o.top + 3
							color = '#FFF'
						};
						$('<div class="data-point-label">' + number_format(el[1],2,',','.') + '</div>').css( {
							left: o.left - 30,
							top: y,
							color: color
						}).appendTo(myGraph3.getPlaceholder());
					}
				});
			}
						
			// output für Gesamt-Layer
			var data;
			
			for (var i=0;i<Parteien.length;i++) {
				
				data = [
					 {label: 'Spenden Herkunft bekannt<br />Personen ab 10.000 €', data: fields_kum[Parteien[i]]['nat_db']},
					 {label: 'Spenden Herkunft unbekannt<br />Personen unter 10.000 €', data: fields_kum[Parteien[i]]['nat']-fields_kum[Parteien[i]]['nat_db']},
					 {label: 'Spenden Herkunft bekannt<br />Unternehmen/ Vereine ab 10.000 €', data: fields_kum[Parteien[i]]['jur_db']},
					 {label: 'Spenden Herkunft unbekannt<br />Unternehmen/ Vereine unter 10.000 €', data: fields_kum[Parteien[i]]['jur']-fields_kum[Parteien[i]]['jur_db']},
					 {label: 'Staatliche Mittel', data: fields_kum[Parteien[i]]['staat']},
					 {label: 'Sonstige Einnahmen', data: fields_kum[Parteien[i]]['sonst']}];
				$('#sum_'+i).html('Gesamtsumme: '+number_format(fields_kum[Parteien[i]]['nat']+fields_kum[Parteien[i]]['jur']+fields_kum[Parteien[i]]['staat']+fields_kum[Parteien[i]]['sonst'],2,',','.')+'€');
				$.plot($('#stat_'+i), data, {
						series: {
							pie: { 
								show: true,
								label: {
									show: false,
									radius: Math.sqrt(fields_kum[Parteien[i]]['sum_all']/fields_kum[Parteien[2]]['sum_all']),
								}
							}
						},
						legend: {
							show: false
						},
						grid: {
							hoverable: true,
							clickable: true
						},
						colors: [
							 '#e09b88',
							 '#c23811',
							 '#8cb8e0',
							 '#1a72c1',
							 '#ede59c',
							 '#dccc3a'
						]
				});
				$('#stat_'+i).bind('plothover', pieHover);
			}
				
		}
		
	}
	var previousPoint;
	
	function pieHover(event, pos, item) {
		 if (item) {
			if (previousPoint != item.datapoint) {
				previousPoint = item.datapoint;
				$('#tooltip').remove();
				var y = item.datapoint[1][0][1];
				var content = item.series.label + '<br /><b><span style="font-size:12px">' + parseFloat(item.series.percent).toFixed(1) + ' %</span> Anteil am Gesamtbudget</b><br />' + number_format(y,2,',','.') + ' €'; 
				showTooltip(pos.pageX+20, pos.pageY-20,content);
			}
		 }
		 else {
			$('#tooltip').remove();
			previousPoint = null;			
		 }
	 };
	
	function addMarker(x, y, values, data, layer) {
		var makeMarker = function (radius, color) {
			layer.addFeatures (
				new OpenLayers.Feature.Vector(
					new OpenLayers.Geometry.Point(x, y).transform(
						new OpenLayers.Projection('EPSG:4326'), 
						new OpenLayers.Projection('EPSG:900913')
					),
					{ some: data },
					{
						graphicName: 'circle',
						pointRadius: radius,
						fillColor: color,
						fillOpacity: 0.8,
						strokeColor: '#FFFFFF',
						strokeWidth: 1,
						strokeOpacity: 0.2
					}
				)
			)
		};
		
		var circles = [];
		$.each(values, function (id, value) {
			if (value > 0) circles.push({color:colors[id], value:value});
		});
		circles.sort(function (a,b) {
			return a.value - b.value;
		});
		
		var sum = 0;
		for (var i = 0; i < circles.length; i++) {
			sum += circles[i].value;
			circles[i].sum = sum;
		};
		
		for (var i = circles.length-1; i >= 0; i--) makeMarker(Math.sqrt(circles[i].sum)/25, circles[i].color)
	}
	
	function redrawMarkers() {
		markers.removeAllFeatures();
		addMarkers();
		//markers.redraw();
	}
	
	function printCsv_kum(data_kum) {
		var records_kum = $.trim(data_kum);
		records_kum = data_kum.split("\n");
		for (var i = 0; i < records_kum.length-1; i++) {
			if (i > 0) {
				fields_kum_temp[i] = $.csv(',','"','\n')(records_kum[i]);	
				fields_kum_temp[i] = fields_kum_temp[i][0];
				fields_kum[fields_kum_temp[i][0]]['nat']     = parseFloat(fields_kum_temp[i][1]) + parseFloat(fields_kum_temp[i][2]) + parseFloat(fields_kum_temp[i][3]);
				fields_kum[fields_kum_temp[i][0]]['jur']     = parseFloat(fields_kum_temp[i][4]);
				fields_kum[fields_kum_temp[i][0]]['sum']     = fields_kum[fields_kum_temp[i][0]]['jur'] + fields_kum[fields_kum_temp[i][0]]['nat'];
				fields_kum[fields_kum_temp[i][0]]['staat']   = parseFloat(fields_kum_temp[i][5]);
				fields_kum[fields_kum_temp[i][0]]['sum_all'] = parseFloat(fields_kum_temp[i][6]);
				fields_kum[fields_kum_temp[i][0]]['sonst']   = fields_kum[fields_kum_temp[i][0]]['sum_all'] - fields_kum[fields_kum_temp[i][0]]['staat'] - fields_kum[fields_kum_temp[i][0]]['sum'];
			}
		}	
	}

	function printCsv(data) {
		var indizes1 = ['CDU', 'CSU', 'SPD', 'FDP', 'GRUENE', 'LINKE'];
		var indizes2 = ['nat_db', 'jur_db', 'sum_db', 'nat_db_anz', 'jur_db_anz', 'sum_db_anz'];
		
		$.each(indizes1, function (i, index1) {
			$.each(indizes2, function (i, index2) {
				fields_kum[index1][index2] = 0;
			});
		});
		
		var records = data.split("\n");
		
		for (var i=0; i < records.length; i++) {
			fields[i] = $.csv(',','"','\n')(records[i]);	
			fields[i] = fields[i][0];			
			for (var j=0;j<fields[i].length;j++) {
				fields[i][j] = $.trim(fields[i][j]);			
			}
			
			fields[i][spSpende] = parseFloat(fields[i][spSpende]);
			fields[i][spLat] = parseFloat(fields[i][spLat]);
			fields[i][spLon] = parseFloat(fields[i][spLon]);

			var row = fields[i];

			if (row[spVorname]) {
				fields_kum[row[spPartei]]['nat_db'] += row[spSpende];
				fields_kum[row[spPartei]]['nat_db_anz']++;
			} else {
				fields_kum[row[spPartei]]['jur_db'] += row[spSpende];
				fields_kum[row[spPartei]]['jur_db_anz']++;
			}
			fields_kum[row[spPartei]]['sum_db'] += row[spSpende];
			fields_kum[row[spPartei]]['sum_db_anz']++;
		}
		
		changeLayers();	
	}
	
	function addMarkers() {
		var points = {};
		
		for (var i=0; i < fields.length; i++) {
			var row = fields[i];
			if (printLine(row)) {
				var id = '_' + Math.round(20000*row[spLat]) + '_' + Math.round(20000*row[spLon]);
				if (points[id] == undefined) {
					points[id] = {
						lat:row[spLat],
						lon:row[spLon],
						entries:[],
						sum:0
					}
				}
				var s = $.trim(row[spVorname] + ' ' + row[spName]);
				s = s.replace(/aktiengesellschaft/gi, 'AG');
				row[10] = s;
				row[11] = s.replace(' ', '').toLowerCase();
				points[id].entries.push(row);
				points[id].sum += row[spSpende];
			}
		}
		
		var pointList = [];
		$.each(points, function (id, point) {
			pointList.push(point);
		});
		
		pointList.sort(function (a,b) {
			return b.sum - a.sum;
		});
		
		for (var i = 0; i < pointList.length; i++) {
			var point = pointList[i];
			var popupData = '';
			
			var entries = point.entries;
			entries.sort(function (a,b) {
				return b[11].localeCompare(a[11]);
			});
			
			var lastName = '';
			var values = {'CDU':0,'CSU':0,'SPD':0,'FDP':0,'GRUENE':0,'LINKE':0};
			for (var j = 0; j < entries.length; j++) {
				var row = entries[j];
				if (row[11] != lastName) {
					lastName = row[11];
					if (popupData != '') popupData += '<br />';
					popupData += '<b>' + row[10] + '</b><br />'
				}
				popupData += number_format(row[spSpende],2,',','.')+' € für die ';
				popupData += ((row[spPartei] == 'GRUENE') ? 'GRÜNEN' : row[spPartei]) + '<br />';
				values[row[spPartei]] += row[spSpende];
			}
			
			
			popupData += '<br /><br />';
			popupData += row[spStrasse] + '<br />';
			popupData += row[spPlz] + ' ' + row[spOrt] + '<br />';
			popupData += row[spLand] + '<br />';
						
			addMarker(point.lon, point.lat, values, popupData, markers);
		
		}
		
		
	}
	
	function showTooltip(x, y, contents) {
		$('<div id="tooltip">' + contents + '</div>').css( {
			position: 'absolute',
			display: 'none',
			top: y - 20,
			left: x + 5,
			border: '1px solid #fdd',
			padding: '2px',
			'background-color': '#fee',
			opacity: 0.80,
			font: '85% sans-serif'
		}).appendTo('body').fadeIn(200);
	}
	
	function openMap(lat,lon) {
		$('#tab_map').click();
		//map.setCenter(new OpenLayers.LonLat(lon,lat).transform(new OpenLayers.Projection('EPSG:4326'),map.getProjectionObject()),18);
	}
	
	var map, mainLayer, blendLayer, markers, selectControl, selectedFeature;
	
	$(document).ready(function() {
		
		map = new OpenLayers.Map('map');
		mainLayer = new OpenLayers.Layer.OSM(
			'Map',
			'http://b.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/61184/256/${z}/${x}/${y}.png',
			{attribution: 'Powered by <a href="http://leaflet.cloudmade.com">Leaflet</a> — Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'}
		);
		markers = new OpenLayers.Layer.Vector(
			'Parteien'
		);
		
		$('#odc_spendencontainer').css('display','none');
		$('#odc_strucontainer').css('display','none');
		$('#odc_compcontainer').css('display','none');
		$('#odc_infocontainer').css('display','none');
		
		$('#filter input').change(function(event){
 			changeLayers();
 			if (this.checked==false){
 				switch (this.id) {
 					case 'deutschland':
 					case 'grossbritannien':
 					case 'schweiz':
 					case 'oesterreich':
 					case 'usa':
 						document.getElementById('laender_all').checked = false;
 						break;
 					case 'spende1':
 					case 'spende2':
 					case 'spende3':
 					case 'spende4':
 					case 'spende5':
 						document.getElementById('spenden_all').checked = false;
 						break;
 					case 'cdu':
 					case 'csu':
 					case 'spd':
 					case 'fdp':
 					case 'gruene':
 					case 'linke':
 						document.getElementById('parteien_all').checked = false;
 						break;
 				}
 			}
		});
		
		$('.odc_scene').click(function(event){
			if ($(this).hasClass('active')==false) {
				$('.odc_scene').removeClass('active');
				
				$('#odc_mapcontainer'	 ).css('display', (this.id == 'tab_map' ) ? 'block' : 'none');
				$('#odc_spendencontainer').css('display', (this.id == 'tab_list') ? 'block' : 'none');
				$('#odc_strucontainer'   ).css('display', (this.id == 'tab_stru') ? 'block' : 'none');
				$('#odc_compcontainer'   ).css('display', (this.id == 'tab_comp') ? 'block' : 'none');
				$('#odc_infocontainer'   ).css('display', (this.id == 'tab_info') ? 'block' : 'none');
				
				$(this).addClass('active');
				changeLayers();				
			}
		});
		
		$('.odc_stat').click(function(event){
			if ($(this).hasClass('active')==false) {
				$('.odc_stat').removeClass('active');
				switch (this.id) {
					case 'tab_sel':
						$('#odc_allcontainer').css('display','none');
						$('#odc_selcontainer').css('display','block');
						changeLayers();
						break;
					case 'tab_all':
						$('#odc_selcontainer').css('display','none');
						$('#odc_allcontainer').css('display','block');
						break;
				} 
				$(this).addClass('active');
			}
		});
		
		$('#laender_all').click(function(event){
			if (this.checked) {
				document.getElementById('deutschland').checked=true;
				document.getElementById('oesterreich').checked=true;
				changeLayers();
			} 
		});
		
		$('#spenden_all').click(function(event){
			if (this.checked) {
				document.getElementById('spende1').checked=true;
				document.getElementById('spende2').checked=true;
				document.getElementById('spende3').checked=true;
				document.getElementById('spende4').checked=true;
				document.getElementById('spende5').checked=true;
				changeLayers();
			} 
		});
		
		$('#parteien_all').click(function(event){
			if (this.checked) {
				document.getElementById('cdu').checked=true;
				document.getElementById('csu').checked=true;
				document.getElementById('spd').checked=true;
				document.getElementById('fdp').checked=true;
				document.getElementById('gruene').checked=true;
				document.getElementById('linke').checked=true;
				changeLayers();
			} 
		});
		
		selectControl = new OpenLayers.Control.SelectFeature([markers],{onSelect: onFeatureSelect, onUnselect: onFeatureUnselect});
		map.addControl(selectControl);

		map.addLayers([mainLayer, markers]);
		
		var extent = new OpenLayers.Bounds(0, 46, 20, 56).transform(
			new OpenLayers.Projection('EPSG:4326'), 
			new OpenLayers.Projection('EPSG:900913')			
		);
		
		map.setOptions({restrictedExtent: extent});
		
		map.zoomToExtent(extent, true);
		/*map.zoomTo(6);
		map.setCenter(new OpenLayers.LonLat(10, 51.3).transform(
			new OpenLayers.Projection('EPSG:4326'), 
			new OpenLayers.Projection('EPSG:900913')			
		));*/
		
		selectControl.activate();
		jQuery.get('res/parteispenden11_kum.csv', 
			function(data_kum) { 
				printCsv_kum(data_kum);
			}
		);
		jQuery.get('res/parteispenden11.csv', 
		  	function(data) { 
				printCsv(data);
		  	}
		);
		$('#odc_selcontainer').css('display','none');
	});	
	

