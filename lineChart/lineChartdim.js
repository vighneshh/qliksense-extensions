/*globals define*/
define( ["qlik", "jquery","./d3.v4.min", "css!./style.css"], 
function ( qlik, $, d3 ) {
	'use strict';
	

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
					min: 1
				},
				measures: {
					uses: "measures",
					min: 1
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
		
		var id = "container_" + layout.qInfo.qId;
			$element.html('<svg id = "'+id+'" ></svg>')
			
			

// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = $element.width() - margin.left - margin.right,
    height = $element.height() - margin.top - margin.bottom;

// parse the date / time

var qMatrix = layout.qHyperCube.qDataPages[0].qMatrix;


// set the ranges

// 5. X scale will use the index of our data
var x = d3.scaleBand().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d[0].qText); })
    .y(function(d) { return y(d[1].qNum); });



// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
// var svg = d3.select("body").append("svg")
var svg = d3.select("#"+id)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Get the data



  // format the data


  // Scale the range of the data
  x.domain(qMatrix.map(function(d) { return d[0].qText; }));
  y.domain([0, d3.max(qMatrix, function(d) { return d[1].qNum; })]);

  // Add the valueline path.
  svg.append("path")
      .data([qMatrix])
      .attr("class", "line")
      .attr("d", valueline);
      
  // Add the scatterplot
  svg.selectAll("dot")
      .data(qMatrix)
    .enter().append("circle")
      //.filter(function(d) { return d.close < 400 })  // <== This line
      .style("fill", "red")                          // <== and this one
      .attr("r", 5)
      .attr("cx", function(d) { return x(d[0].qText); })
      .attr("cy", function(d) { return y(d[1].qNum); });

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));
			
		}
	};
} );
