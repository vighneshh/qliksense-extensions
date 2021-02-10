/*globals define*/
define( ["qlik", "jquery","./lib/date","./lib/jquery.ganttView","css!./lib/jquery.ganttView.css","css!./lib/jquery-ui-1.8.4.css", "css!./style.css"], 
	function ( qlik, $ , cssContent) {
	// 'use strict';
	$( "<style>" ).html( cssContent ).appendTo( "head" );
	

	return {
		initialProperties: {
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInitialDataFetch: [{
					qWidth: 10,
					qHeight: 50
				}]
			}
		},
		definition: {
			type: "items",
			component: "accordion",
			items: {
				dimensions: {
					uses: "dimensions",
					min: 6
				},
				measures: {
					uses: "measures",
					min: 0
				},
				sorting: {
					uses: "sorting"
				},
				settings: {
					uses: "settings"
				}
			}
		},
		snapshot: {
			canTakeSnapshot: true
		},
		paint: function ( $element, layout ) {

  // var id = "ganttChart" ;

 


			$element.html('<div id="ganttChart"></div>');
         

var qMatrix = layout.qHyperCube.qDataPages[0].qMatrix;
console.log(qMatrix)

data = []
types = []
qMatrix.forEach(function (d){
    types.push(d[0].qText)
})
settypes = new Set(types)
// console.log(settypes)
// dimension 1 = Type
// dimension 2 = Subtype
// dimension 3 = Actual/Plan
// dimension 4 = StartDate (in text format "17/05/2020")
// dimension 5 = EndDate (in text format "17/05/2020")
// dimension 6 = Color
//
qMatrix.forEach(function (d){
	var startParts = d[3].qText.split('/');
	var endParts = d[4].qText.split('/');
	// console.log(+startParts[2],startParts[1]-1,+startParts[0])
	// console.log(+endParts[2],endParts[1]-1,+endParts[0])
	var p = {
		id: d[0].qText+d[2].qText, name:  d[0].qText, series: [
			{ name: d[2].qText, start: new Date(+startParts[2],startParts[1]-1,+startParts[0]), 
				end: new Date(+endParts[2],endParts[1]-1,+endParts[0]) ,color:d[5].qText }
			
		]
	}
	;
	data.push(p)  
})
var ganttData = data;
// console.log(data)
			var ganttData = [
	{
		id: 1, name: "Feature 1", series: [
			{ name: "Planned", start: new Date(2010,00,01), end: new Date(2010,00,03) },
			{ name: "Planned", start: new Date(2010,00,05), end: new Date(2010,00,20), color: "blue" }

			
		]
	}, 
	{
		id: 2, name: "Feature 1", series: [
			
			{ name: "Actual", start: new Date(2010,00,02), end: new Date(2010,00,05)  },
			{ name: "Actual", start: new Date(2010,00,06), end: new Date(2010,00,17), color: "blue" }
			
		]
	}, 
	{
		id: 3, name: "Feature 2", series: [
			{ name: "Planned", start: new Date(2010,00,11), end: new Date(2010,01,03) },
			{ name: "Planned", start: new Date(2010,01,01), end: new Date(2010,01,03), color: "blue" }
			
		]
	}, 
	{
		id: 4, name: "Feature 2", series: [
			
			{ name: "Actual", start: new Date(2010,00,15), end: new Date(2010,01,03)  },
			{ name: "Actual", start: new Date(2010,01,01), end: new Date(2010,01,05), color: "blue" }
		]
	},
	{
		id: 5, name: "Feature 3", series: [
			{ name: "Planned", start: new Date(2010,02,01), end: new Date(2010,03,20) },
			{ name: "Planned", start: new Date(2010,00,05), end: new Date(2010,00,20),color: "blue" }
		]
	}, 
	{
		id: 6, name: "Feature 3", series: [
			
			{ name: "Actual", start: new Date(2010,02,01), end: new Date(2010,03,26) },
			{ name: "Actual", start: new Date(2010,00,06), end: new Date(2010,00,17), color: "blue" }
			
		]
	}
];
///////data ended



$(function () {
			$("#ganttChart").ganttView({ 
				data: ganttData,
				slideWidth: 1000,
				groupBySeries: true,
				groupById: true,
				groupByIdDrawAllTitles: false
				
			});
			
			// $("#ganttChart").ganttView("setSlideWidth", 600);
		});
			


			




		$element.find('.ganttview-block').on('click', function() {
			debugger;
			console.log("hi")
					if(this.hasAttribute("datavalue")) {
						var value = parseInt(this.getAttribute("title"), 10), dim = 0;
						self.selectValues(dim, [value], true);
						console.log("hi");
						this.classList.toggle("selected");
					}
				});
				
			
		}
	};
} );
