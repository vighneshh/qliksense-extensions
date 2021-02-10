define( [ "qlik","css!./style.css"],
function ( qlik) {
	return {
	
	// Define what the properties panel looks like
			definition: {
				type: "items",
				component: "accordion",
				items: {
					measures: {
						uses: "measures",
						min:1,
						max:3,
						items:{
							KPIUnit:{
								type:"string",
								label:"KPI Unit",
								ref:"qDef.KPIUnit",
								defaultValue:"▲ ▼",
								expression:"optional"
							},
							KPIcolor:{
								type:"string",
								label:"KPI Color",
								ref:"qDef.KPIcolor",
								defaultValue:"red",
								expression:"optional"
							},
							customCSS:{
								type:"string",
								label:"KPI Custom CSS",
								ref:"qDef.customCSS",
								expression:"optional"
							},
							sheetID:{
								type:"string",
								label:"Sheet ID",
								ref:"qDef.sheetID",
								expression:"optional"
							},
							fieldName:{
								type:"string",
								label:"Field Name",
								ref:"qDef.fieldName"
							},
							fieldValue:{
								type:"string",
								label:"Field Value",
								ref:"qDef.fieldValue"
							},
							varName:{
								type:"string",
								label:"Variable Name",
								ref:"qDef.varName"
							},
							varValue:{
								type:"string",
								label:"Variable Value",
								ref:"qDef.varValue"
							}
						}
					},
					sorting: {
						uses: "sorting"
					},
					appearance: {
						uses: "settings",
						items:{
						/*
							SoctLock: {
								type: "boolean",
								label: "Override Locked values",
								ref: "SoctLock",
								defaultValue: true
							},
							*/
							SoctLock: {
								type: "boolean",
								component: "buttongroup", // radiobuttons, switch, dropdown, buttongroup
								label: "Override Locked values",
								ref: "SoctLock",
								options: [{
									value: true,
									label: "On"
								}, {
									value: false,
									label: "Not On"
								}],
								defaultValue: true
							},
							
						// KPI Style tab
							KPIStyle:{
								label:"KPI Style",
								type:"items",
								items:{
									KPIcolor:{
										type:"string",
										label:"KPI Color",
										ref:"style.KPIcolor",
										defaultValue:"#fff"
									},
									KPIBgcolor:{
										type:"string",
										label:"KPI Bg Color",
										ref:"style.KPIBgcolor",
										defaultValue:"blue"
									},
									KPIBFontSize:{
										type:"string",
										label:"KPI Font Size",
										ref:"style.KPIBFontSize",
										defaultValue:"18"
									},
									KPIBtitleCss:{
										type:"string",
										label:"KPI Title CSS",
										ref:"style.KPIBtitleCss"
									}
								}
							}
						}
					}
				}
			},
	
		support : {
			snapshot: false,
			export: false,
			exportData : false
		},
		paint: function ($element,layout) {
			var KPIFontsize=(layout.style.KPIBFontSize == undefined ? '' : layout.style.KPIBFontSize='px'),
				KPIBgcolor = (layout.style.KPIBgcolor == undefined ? '' : layout.style.KPIBgcolor),
				KPIcolor = (layout.style.KPIcolor == undefined ? '' : layout.style.KPIcolor),
				KPIBtitleCss = (layout.style.KPIBtitleCss == undefined ? '' : layout.style.KPIBtitleCss),
				KPI=[],
				app = qlik.currApp(this);
				
			$.each(layout.qHyperCube.qMeasureInfo,function(key,value){
				//console.log(key,value);
				KPI.push({
					"value": layout.qHyperCube.qGrandTotalRow[key].qText,
					"color":value.KPIcolor,
					"unit":value.KPIUnit,
					"title":value.qFallbackTitle,
					"css":value.customCSS,
					"sheetID": (value.sheetID == undefined || value.sheetID == '' ? 'noNav' : value.sheetID),
					"fieldName":(value.fieldName == undefined || value.fieldName == '' ? 'noSel' : value.fieldName),
					"fieldValue":(value.fieldValue == undefined || value.fieldValue == '' ? 'noSel' : value.fieldValue),
					"varName":(value.varName == undefined || value.varName == '' ? 'noSel' : value.varName),
					"varValue":(value.varValue == undefined || value.varValue == '' ? 'noSel' : value.varValue)
				});
			});
			
			console.log(KPI);
				
			//console.log('PH 6',layout);
			//add your rendering code here

				var html='<div class="container">';	
						
						html+='<div class="title" style="'+KPIBtitleCss+' color:'+KPIcolor+';background:'+KPIBgcolor+';font-size:'+KPIFontsize+';">';
							html+='<span>'+KPI[0].title+'</span>';
						html+='</div>';
						
						html+='<div class="value">';
							html+='<span sheetID="'+KPI[0].sheetID+'" fieldName="'+KPI[0].fieldName+'" fieldValue="'+KPI[0].fieldValue+'" varName="'+KPI[0].varName+'" varValue="'+KPI[0].varValue+'" class="calc" style="'+(KPI[0].css == undefined ? '' : KPI[0].css)+'color:'+KPI[0].color+';">'+KPI[0].value+'</span><span class="unit" >'+KPI[0].unit+'</span>';
						html+='</div>';
						
						html+='<div class="valueCont">';
								if(KPI.length>1){
									html+='<div class="value2" style="width: 50%;">';
										html+='<span sheetID="'+KPI[1].sheetID+'" fieldName="'+KPI[1].fieldName+'" fieldValue="'+KPI[1].fieldValue+'" varName="'+KPI[1].varName+'" varValue="'+KPI[1].varValue+'" class="calc" style="'+(KPI[1].css == undefined ? '' : KPI[1].css)+'">'+KPI[1].value+'</span><span class="unit" style="color:'+KPI[1].color+';">'+KPI[1].unit+'</span>';
										html+='<div class="Title2">'+KPI[1].title+'</div>';
									html+='</div>';
								}
							
								if(KPI.length==3){
									html+='<div class="value3" style="width: 50%;">';
										html+='<span sheetID="'+KPI[2].sheetID+'" fieldName="'+KPI[2].fieldName+'" fieldValue="'+KPI[2].fieldValue+'" varName="'+KPI[2].varName+'" varValue="'+KPI[2].varValue+'" class="calc" style="'+(KPI[2].css == undefined ? '' : KPI[1].css)+'">'+KPI[2].value+'</span><span class="unit" style="color:'+KPI[2].color+';">'+KPI[2].unit+'</span>';
										html+='<div class="Title3">'+KPI[2].title+'</div>';
									html+='</div>';
								}
							
						html+='</div>';
						
					html+='</div>';
					//html+='';
					
			$element.html( html );
			var sheetMode = (qlik.navigation.getMode() == 'analysis' ? true : false);
			// console.log(qlik.navigation.getMode());
			
			
		
			//console.log(sheetMode);
		   // navigation
		 	$('.calc').click(function(){
				var sheetID = $(this).attr('sheetID'),
				fieldName= $(this).attr('fieldName'),
				fieldValue= $(this).attr('fieldValue'),
				varName= $(this).attr('varName'),
				varValue= $(this).attr('varValue');
				
				if(sheetID != 'noNav' &&  sheetMode){
					console.log('Navigating to',sheetID);
					qlik.navigation.gotoSheet(sheetID);
				}else{
					console.log('Cannot Navigate');
				}
				
				if(fieldName!='noSel' && fieldValue!='noSel'){
					console.log('Field Name:',fieldName,', Field Value:',fieldValue);
					// clear field values
					//app.field(fieldName).clear();
					// clearOther
					//app.field(fieldName).clearOther(true);
					// selectMatch : not case senc
					//app.field(fieldName).selectMatch(fieldValue, layout.SoctLock);
					//selectValues : case senc;
					fieldValue = fieldValue.split(',')
					app.field(fieldName).selectValues(fieldValue, true, layout.SoctLock);
				}
				
				// var value set
				app.variable.setStringValue(varName,varValue);
				
			});
		
			
			//needed for export
			return qlik.Promise.resolve();
		}
	};

} );

