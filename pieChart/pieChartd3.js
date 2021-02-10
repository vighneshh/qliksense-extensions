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
			
			
			


	
	
// get datda
var qMatrix = layout.qHyperCube.qDataPages[0].qMatrix;
        
    var width = $element.width(),
   height = $element.height(),
    radius = Math.min(width, height) / 2;
        
		
		
		var svg = d3.select("#"+id)
		.attr("width", width)
       .attr("height", height)
       var g = svg.append("g")
                   .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var color = d3.scaleOrdinal(['#4daf4a','#377eb8','#ff7f00','#984ea3','#e41a1c']);

        var pie = d3.pie().value(function(d) { 
                return d[1].qNum; 
            });

        var path = d3.arc()
                     .outerRadius(radius - 10)
                     .innerRadius(0);

        var label = d3.arc()
                      .outerRadius(radius)
                      .innerRadius(radius - 80);



        
            var arc = g.selectAll(".arc")
                       .data(pie(qMatrix))
                       .enter().append("g")
                       .attr("class", "arc");

            arc.append("path")
               .attr("d", path)
               .attr("fill", function(d) { return color(d.data[0].qText); });
        
            //console.log(arc)
        
            arc.append("text")
               .attr("transform", function(d) { 
                        return "translate(" + label.centroid(d) + ")"; 
                })
               .text(function(d) { return d.data[0].qText; });
          

            
	
	


			
		}
	};
} );
