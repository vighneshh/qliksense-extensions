
define( ["qlik", "jquery","./d3.v4.min", "css!./style.css"], 
function ( qlik, $, d3, cssContent  ) {
	'use strict';
	$("<style>").html(cssContent).appendTo("head");
	return {
		initialProperties: {
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInitialDataFetch: [{
					qWidth: 2,
					qHeight: 14
				}]
			},
			showcharts : "both",
			barwidth: 0,
			linewidth: 2,
			dotsize: 5,
			ylabelvaluesize: 15,
			ylabelvaluecolor: "black"
				//selectionMode: "CONFIRM"
		},
		
		definition: {
			type: "items",
			component: "accordion",
			items: {
			     target: {
						type: "array",
						ref: "targets",
						label: "Set Target",
						itemTitleRef: "label",
						allowAdd: true,
						allowRemove: true,
						addTranslation: "Add target",
						items: {
						    MyAccordion: {
								type: "string",
								component: "dropdown",
								label: "Orientation",
								ref: "orientation",
								options: [{
									value: "x",
									label: "X target"
								}, {
									value: "y",
									label: "Y target"
								}],
								defaultValue: "x",
								},
								
								
						
							target: {
								ref: "target",
								label: "target",
								type: "string",
								
								},
								tlabel: {
									type: "string",
									ref: "tlabel",
									label: "Label"
								
								},
							
						},
						
						
					},
				dimensions: {
					uses: "dimensions",
					min: 1
				},
				measures: {
					uses: "measures",
					min: 1
					 ,
					 	items:{
					 		
					 		Accordion2: {
								type: "string",
								component: "dropdown",
								label: "Change Color For Chart",
								ref: "chart",
								options: [{
									value: "x",
									label: "Bar Chart"
								}, {
									value: "y",
									label: "Line Chart"
								}],
								defaultValue: "x",
								},
					 	Bcolor:{
					 					type:"string",
					 					label:"Color",
					 					ref:"qAttributeExpressions.0.qExpression",
					 					component:"expression",
					 					defaultValue:"='blue'",
					 					show: function ( data ) {
									return (data.chart == 'x');
								}
					 				},
					 	Lcolor:{
					 					type:"string",
					 					label:"Color",
					 					ref:"qAttributeExpressions.1.qExpression",
					 					component:"expression",
					 					defaultValue:"='red'",
					 					show: function ( data ) {
									return data.chart == 'y';
								}
					 				}



					    },

				
				},
				
					/*****************************/			
		  		Accordion1: {
								type: "string",
								component: "dropdown",
								label: "Show Charts",
								ref: "showcharts",
								options: [{
									value: "bar",
									label: "Bar Chart Only"
								}, {
									value: "line",
									label: "Line Chart Only"
								},{
									value: "both",
									label: "Both"
								}],
								defaultValue: "both",
				},
				customchanges: {
						type: "items",
						label: "Custom Changes",
						items: {
							barwidth: {
								ref: "barwidth",
								label: "Bar Width",
								type: "number",
								defaultValue: 0
							},
							linewidth: {
								ref: "linewidth",
								label: "Line width",
								type: "string",
								defaultValue: 2
							},
							dotsize: {
								ref: "dotsize",
								label: "Dot Size",
								type: "string",
								defaultValue: 5
							},
							ylabelvaluesize: {
								ref: "ylabelvaluesize",
								label: "Y Label Value Size",
								type: "string",
								defaultValue: 15
							},
							ylabelvaluecolor: {
								ref: "ylabelvaluecolor",
								label: "Y Label Value Color",
								type: "string",
								defaultValue: "black"
							}
							
						}
					},
				
				
				
				sorting: {
					uses: "sorting"
				},
				settings: {
					uses: "settings"
				}
			}
		},
		// snapshot: {
		// 	canTakeSnapshot: true
		// },
		support : {
			snapshot: true,
			export: true,
			exportData : true
		},
		paint: function ($element,layout) {
		
		    var self = this;
			var id = "container_" + layout.qInfo.qId;

 


			$element.html('<svg id = "'+id+'" ></svg>');
            
//console.log(layout.qHyperCube.qDataPages[0].qMatrix[0][0]);
// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = $element.width() - margin.left - margin.right,
    height = $element.height() - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
var y = d3.scaleLinear()
          .range([height, 0]);
          
// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
// var svg = d3.select("body").append("svg")
var svg = d3.select("#"+id)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

// get the data

console.log(layout)

var qMatrix = layout.qHyperCube.qDataPages[0].qMatrix;
//console.log(qMatrix.map(function(d) { console.log(d[1].qNum) }))



  // Scale the range of the data in the domains
  x.domain(qMatrix.map(function(d) { return d[0].qText; }));
  y.domain([0, d3.max(qMatrix, function(d) { return d[1].qNum; })]);

console.log(layout.showcharts)



// Bar
if((layout.showcharts == 'both') || (layout.showcharts == 'bar' ) )
{
  // append the rectangles for the bar chart
	 svg.selectAll(".bar")
	      .data(qMatrix)
	    .enter().append("rect")
	      .attr("class", "bar")
	      .attr("x", function(d) { return x(d[0].qText); })
		  .attr("xvalue", function(d) { return d[0].qText; })
	      .attr("width",( x.bandwidth() + layout.barwidth ))
	      .attr("y", function(d) { return y(d[1].qNum); })
		  .attr("yvalue", function(d) { return d[1].qNum; })
		  .attr("data-value", function(d) { return d[0].qElemNumber; })
	      .attr("height", function(d) { return height - y(d[1].qNum); })
	      .attr("fill",function(d){ return d[1].qAttrExps.qValues[0].qText;});

	    
 }


 svg.selectAll(null)
	    .data(qMatrix)
	    .enter()
	    .append("text")
	    .attr("font-size",layout.ylabelvaluesize+"px")
	    .attr("fill",layout.ylabelvaluecolor)
            .attr("class", "label")
            //y position of the label is halfway down the bar
            .attr("x", function (d) {
                return x(d[0].qText)+(x.bandwidth()/2) ;
            })
            //x position is 3 pixels to the right of the bar
            .attr("y", function (d) {
                return y(d[1].qNum) - 8;
            })
            .text(function (d) {
                return d[1].qNum;
            });
/// Line
var lineData = []
qMatrix.forEach(function (d){
	var p =  {"x": d[0].qText, "y": d[1].qNum,"c":d[1].qAttrExps.qValues[1].qText};
	lineData.push(p)  
})
lineData = lineData.map(function (point, index, arr) {
    var next = arr[index + 1],
        prev = arr[index - 1];
    return {
        x: point.x,
        y: point.y,
        x1: point.x,
        y1: point.y,
        x2: (next) ? next.x : prev.x,
        y2: (next) ? next.y : prev.y,
        c: point.c
    };
});

if((layout.showcharts == 'both') || (layout.showcharts == 'line')){
	var lines = svg.selectAll(null)
	        .data(lineData)
	        .enter()
	        .append('line')
	        .attr("class", "line")
	        .attr('x1', function(d) { return x(d.x1)+(x.bandwidth()/2); })
	        .attr('y1', function(d) { return y(d.y1); })
	        .attr('x2', function(d) { return x(d.x2)+(x.bandwidth()/2); })
	        .attr('y2', function(d) { return y(d.y2); })
	        .attr("stroke", function(d) { return d.c; })
	        .attr("fill", "none")
	        .attr("stroke-width", layout.linewidth);



	 svg.selectAll("dot")
	      .data(qMatrix)
	    .enter().append("circle")
	    .attr("class", "dot")
	      //.filter(function(d) { return d.close < 400 })  // <== This line
	      .style("fill", function(d){return d[1].qAttrExps.qValues[1].qText })                          // <== and this one
	      .attr("r",layout.dotsize)
	      .attr("cx", function(d) { return x(d[0].qText)+(x.bandwidth()/2); })
	      .attr("cy", function(d) { return y(d[1].qNum); })
	      .attr("data-value", function(d) { return d[0].qElemNumber; });
}

  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

			//add your rendering code here
			//$element.html( html );
			//needed for export
			
			
				

		$element.find('.bar').on('click', function() {
					if(this.hasAttribute("data-value")) {
						var value = parseInt(this.getAttribute("data-value"), 10), dim = 0;
						self.selectValues(dim, [value], true);
						this.classList.toggle("selected");
					}
				});
				
	
	
	
	//console.log(layout)
	
var temp = layout.target;
temp.forEach(function (d){
  if(d.orientation == 'x'){
    svg
    .append("line")
      .attr("x1", x(d.target) )
      .attr("x2", x(d.target) )
      .attr("y1", y(0))
      .attr("y2", y(1000))
      .attr("stroke", "black")
      .attr("stroke-dasharray", "4");
	  
	  svg
    .append("text")
    .attr("x", x(d.target))
    .attr("y", y(d.target))
    .text(d.tlabel + '=' + d.target)
    .style("font-size", "15px");
  }
  else{
  svg
    .append("line")
      .attr("x1", x(0) )
      .attr("x2", width )
      .attr("y1", y(d.target))
      .attr("y2", y(d.target))
      .attr("stroke", "black")
      .attr("stroke-dasharray", "4");
	  
	  
	   svg
    .append("text")
    .attr("x", 0)
    .attr("y", y(d.target))
    .text(d.tlabel + '=' + d.target)
    .style("font-size", "15px");
  }
  
	
	})

	
	
	
	return qlik.Promise.resolve();
	
		}
	};

} );