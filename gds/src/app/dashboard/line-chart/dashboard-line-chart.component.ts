import { Component, OnInit, ElementRef, ViewChild, Input, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { Constants } from '@src/app/constants';
import { DashboardConstants } from '../dashboard.constant';
declare var $:any;

@Component({
  selector: 'app-dashboard-line-chart',
  templateUrl: './dashboard-line-chart.component.html',
  styleUrls: ['./dashboard-line-chart.component.scss']
})
export class DashboardLineChartComponent implements OnInit {

  @ViewChild('linechart') private chartContainer: ElementRef;
  @Input() private data: any;
  @Input() private lineWithDataPoint: boolean

  @Input() private areaChart: boolean
  @Input() unitVal: any;

  constructor(private hostRef: ElementRef) { }

  ngOnInit() {
    if (this.data) {
      this.createChart(this.data.chartData[0]);
    }
  }

  // ngOnChanges(changes) {
  //   if (this.data && changes.data.previousValue) {
  //     this.createChart(this.data);
  //   }
  // }

  createChart(data) {
    let el = this.chartContainer.nativeElement;
    let viewportWidth = $(window).width();
    d3.select(el).selectAll("*").remove();
    var margin = {
      top: 85,
      right: 65,
      bottom: 125,
      left: 40
    }
    let w = $(this.hostRef.nativeElement).parent().width();
    let h = 322;

    let width = w - margin.left - margin.right
    let height = h - margin.top - margin.bottom;

    var x = d3.scaleBand().range([0, width], 1.0);
    var y = d3.scaleLinear().rangeRound(
      [height, 0]);

    // define the axis
    var xAxis = d3.axisBottom().scale(x).ticks(5);
    var yAxis = d3.axisLeft().scale(y)
      .ticks(5);

    var dataNest = d3.nest().key(function (d) {
      return d.key;
    }).entries(data);
    dataNest = addLastCompletionAsFirstProjection(dataNest);

    var max = d3.max(data.map(function (d) {
      // return parseInt(d.value);
      if(d.unit == "Per cent"){
        return 100;
      }
      else{
        return parseInt(d.value);
      }
    }))
    // var max = d3.max([0, 100])


    x.domain(data.map(function (d) {
      return d.timeperiod;
    }));
    y.domain([0, max]);

    // // Define the line
    let area = d3.area()
        .defined(function(d) { return d && d.value != null; })
      .curve(d3.curveLinear)
      .x(function (d) { return x(d.timeperiod) + width /2 / data.length;; })
      .y0(height)
      .y1(function (d) { return y(d.value); });

      
    var lineFunctionCardinal = d3.line()
      .defined(function (d) { return d && d.value != null; })
      .x(function (d) {
        return x(d.timeperiod) + width /2 / data.length;;
      }).y(function (d) {
        return y(d.value);
      }).curve(d3.curveLinear);

    // Adds the svg canvas
    var svgRender = d3.select(el).append("svg").attr("id",
      "trendsvg").attr("width",
        w).attr(
          "height",
          h)
          .attr("xmlns","http://www.w3.org/2000/svg")
          .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
          
     var svg = svgRender.append("g").attr(
        "transform",
        "translate(" + (margin.left + 15) +","
        + (margin.top) + ")").style(
          "fill", "#000");

    var color = d3.scaleOrdinal().range(
      ["#386d5c", "#f07258", "#333a3b", "#428ead"]);

      svgRender.append("text")
                .attr("x", 10)
                .attr("y", 5)
                .attr("dy", 15)
                .attr("font-size", "12px" )
                .style("fill", "#000000")
                .style("font-weight", "bold")
                .text(this.data.indicatorName).call(wrap, width);
        
                svgRender.append("svg:image")
                .attr("xlink:href",DashboardConstants.legends.star)
                .attr("x", w - 35 )
                .attr("y", 45 )
                .attr("width", "15")
                .attr("height", "15")

      
//  check for no data availble
let allNullValues = true;
if (data.length > 0) {
  for (let j = 0; j < data.length; j++) {
    if (data[j].value != null) {
      allNullValues = false;
      break;
    }
  }
}
if (allNullValues) {
  svg.append("text")
    .attr("transform", "translate(" + width / 2 + ",80)")
    .attr("x", 0)
    .attr("y", 30)
    .attr("font-size", function () {
      if (viewportWidth < 420) {
        return "22px";
      } else {
        return "25px";
      }
    })
    .style("text-anchor", "middle")
    .style("fill", "#397a46")
    .text("No Data Available");
  return;
} 

// Current Value
    // svgRender.append("text")
    // .attr("x", 10)
    // .attr("y", 50)
    // .attr("font-size", "12px" )
    // .style("fill", "#000000")
    // .text("Current Value:" + this.data.chartData[0].filter(d => d.latest)[0].value);


    // add the x-axis
    svg.append("g").attr("class", "x axis")
      .attr(
        "transform", "translate(0," + height + ")")
      .call(xAxis)
    //  .append("text").attr("x",
    //      width).attr("y",
    //      "65").attr("dx", ".71em")																			

    //  .text("Time Period").style({"fill":
    //      "#000","text-align":"right", "text-anchor": "end",
    //    "font-weight": "bold",
    //    "letter-spacing": "1px"
    //  });

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle").
      style("font-size","10px")
      .text(data[0].unit);
      // .text(data[0].unit.replace(new RegExp("[ ]+","g"), "")); 

    d3.selectAll(".x.axis .tick text").attr("dx", "-10px").attr("dy",
      "3").attr("transform", "rotate(-45)")
      .style("text-anchor", "end");


        
    // svg.selectAll(".tick text")
    //   .call(wrap, x.bandwidth());
    svg.append("g").attr("class", "y axis").call(yAxis)
      .append("text").attr("transform",
        "rotate(-90)").attr("y", -50).attr("x", -height / 2).attr(
          "dy", ".71em").text("Value")
      
      // Current Value
      svgRender.append("text")
      .attr("x", 10)
      .attr("y", h-15)
      .attr("font-size", "11px" )
      .style("fill", "#000000")
      .text("Current Value:" + (this.data.chartData[0].filter(d => d.latest).length != 0 ? this.data.chartData[0].filter(d => d.latest)[0].value:''));

      // department Name
      if(this.data.reportSource!="SDG_COMPUTED_SOURCE"){
        svgRender.append("text")
        .attr("x", w - 15)
        .attr("y", h -25)
        .attr("font-size", "11px" )
        .style("fill", "#000000")
        .style("text-anchor", "end")
        .text("Department:" + this.data.reportSource);
      }



      //added legend 

      var imgs = svgRender.selectAll("image.image").data([0]);
      var x_position = 0;
      if(this.data.reportSource!="SDG_COMPUTED_SOURCE"){
        imgs.enter()
        .append("svg:image")
        .attr("xlink:href", DashboardConstants.legends.Target)
        .attr("x", 20 )
        .attr("y", h-60 )
        .attr("width", "32")
        .attr("height", "8")
        // .style("text-anchor", "start");
        imgs.enter().append("text")
        .attr("x", 60 )
        .attr("y", h-52 )
        .attr("width", "12")
        .attr("height", "8")
        .style("font-size", "12").text("Target")

       
      }
     
             
                imgs.enter()
                .append("svg:image")
                .attr("xlink:href",DashboardConstants.legends.completed)
                .attr("x", 100+x_position)
                .attr("y", h-60 )
                .attr("width", "53")
                .attr("height", "10")
                .style("text-anchor", "start");
                imgs.enter().append("text")
                .attr("x", 150)
                .attr("y", h-52)
                .attr("width", "12")
                .attr("height", "8")
                .style("font-size", "12").text("Achieved")
              
       
                imgs.enter()
                .append("svg:image")
                .attr("xlink:href",DashboardConstants.legends.projected)
                .attr("x", 205  +x_position)
                .attr("y", h-60 )
                .attr("width", "53")
                .attr("height", "10")
                .style("text-anchor", "start");

                imgs.enter().append("text")
                .attr("x", 255 +x_position)
                .attr("y", h-52 )
                .attr("width", "12")
                .attr("height", "8")
                .style("font-size", "12").text("Projected")

      
                
    // adding multiple lines in Line chart
    for (let index = 0; index < dataNest.length; index++) {

      var series = svg.append(
        "g").attr("class", "series tag" + dataNest[index].key.split(" ")[0]).attr("id",
          "tag" + dataNest[index].key.split(" ")[0]);

      // if (this.areaChart) {
      //   svg.append("path")
      //     .data([dataNest[index].values])
      //     .attr("class", "area")
      //     .attr("d", area)
      //     .style("fill", "#a1dd74")
      //     .style("opacity", "0.26")
      //     .transition().duration(3000)
      // }

     
        //Apply to your element(s)

      var path = svg.selectAll(".series#tag" + dataNest[index].key.split(" ")[0])
        .append("path")
        .attr("class", "line tag" + dataNest[index].key.split(" ")[0])
        .attr("id", "tag" + dataNest[index].key.split(" ")[0])
        .attr(
          "d",
          function (d) {
            //if(dataNest[index].key == "CL")
            return lineFunctionCardinal(dataNest[index].values);
            //else
            //return lineFunctionStep(dataNest[index].values);
          }).style("stroke", function (d) {
             return dataNest[index].key == "target" ? "#207A46":"#e9692e" ;
          }).style("stroke-width", "2px").style(
            "fill", "none").style("cursor", function (d) {
              //  if(dataNest[index].key == "P-Average")
              //    return "pointer";
              //  else
              return "default";
            }).on("mouseover",
              function (d) {
                if ($(this).attr("id") == "tagP-Average")
                  showPopover.call(this, dataNest[3].values[0]);
              }).on("mouseout", function (d) {
                removePopovers();
              });

         
      var totalLength = path.node().getTotalLength();

      var dashing = "2, 2"
      path.attr("stroke-dasharray", function(d) {
        return dataNest[index].key == "completed" ? totalLength + " " + totalLength : createDashArray(totalLength, dashing)
      })
      
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(3000)
            //  .ease("linear")
            .attr("stroke-dashoffset", 0);      //dotted line from  value point to x-axis
      if (this.lineWithDataPoint) {
        svg.selectAll(".series#tag" + dataNest[index].key.split(" ")[0]).select(".series-line")
          .data(function () {
            return dataNest[index].values;
          }).enter().append("line")
          // .attr("stroke-dasharray", "2,2")
          // .attr("stroke", "#303030")
          // .attr("stroke-width", 1)
          .attr("fill", "none")
          .attr("x1", function (d) {
            return x(d.timeperiod) + width /2 / data.length;;
          })     				// x position of the first end of the line
          .attr("y1", y(0))      // y position of the first end of the line
          .attr("x2", function (d) {
            return x(d.timeperiod) + width /2 / data.length;;
          })      				// x position of the second end of the line
          .attr("y2", function (d) {
            return y(d.value);
          })
      }
      let chart = svg.selectAll(".series#tag" + dataNest[index].key.split(" ")[0]).select(".point").data(function () {
        return dataNest[index].values;
      }).enter()
      
      if(dataNest[index].key == "target") {
        chart.append('circle').attr("id",
        "tag" + dataNest[index].key.split(" ")[0])
        .attr("class", function (d) {
          return dataNest[index].key.split(" ")[0] 
        })
        .attr("cx", function (d) {
          return x(d.timeperiod) + width /2 / data.length;
        }).attr("cy", function (d) {
          return y(d.value);
        }).attr("r", function (d) {
          if (d.value == null)
            return "0px";
          else
            return "3px";
        }).style("fill", "#207A46").style("stroke", "#207A46").style(
          "stroke-width", "2px").style("cursor", "pointer")
        .on("mouseover", function (d) {
          // d3.select(this).moveToFront();
          showPopover.call(this, d);
        }).on("mouseout", function (d) {
          removePopovers();
        });
        // chart.append('path').attr("id",
        // "tag" + dataNest[index].key.split(" ")[0])
        // .attr("class", function (d) {
        //   return dataNest[index].key.split(" ")[0] + 'triangle'
        // })
        // .attr('d', function(d) { 
        //   let px = x(d.timeperiod) + width /2 / data.length;;
        //   let py = y(d.value)
        //   return 'M ' + px +' '+ (py-4) + ' L ' + (px-4) + ' ' + (py + 4) + ' L '+ (px + 4) + ' ' + (py + 4) + ' z';
        // }).style("fill", "#207A46").style("cursor", "pointer")
        // .on("mouseover", function (d) {
        //   showPopover.call(this, d);
        // }).on("mouseout", function (d) {
        //   removePopovers();
        // });
      } else {
        chart.append("circle").attr("id",
        "tag" + dataNest[index].key.split(" ")[0])
        .attr("class", function (d) {
          return dataNest[index].key.split(" ")[0]
        }).attr("cx", function (d) {
          return x(d.timeperiod) + width /2 / data.length;
        }).attr("cy", function (d) {
          return y(d.value);
        }).attr("r", function (d) {
          if (d.value == null)
            return "0px";
          else
            return "3px";
        }).style("fill", "#e9692e").style("stroke", "#e9692e").style(
          "stroke-width", "2px").style("cursor", "pointer")
        .on("mouseover", function (d) {
          // d3.select(this).moveToFront();
          showPopover.call(this, d);
        }).on("mouseout", function (d) {
          removePopovers();
        });
      }
      

      // second render pass for the dashed lines
      var left, right
      for (var j = 0; j < dataNest[index].values.length; j += 1) {
        var current = dataNest[index].values[j]
        if (current.value != null) {
          left = current
        } else {
          // find the next value which is not nan
          while (dataNest[index].values[j] != undefined && dataNest[index].values[j].value == null && j < dataNest[index].values.length) j += 1
          right = dataNest[index].values[j]

          if (left != undefined && right != undefined && left.key == right.key) {
            svg.append("path")
              .attr("id", "tag" + dataNest[index].key)
              .attr("class", "tag" + dataNest[index].key)
              .attr("d", lineFunctionCardinal([left, right]))
                .style("stroke", "#303030")
                .attr('stroke-dasharray', '4,4').style(
                "fill", "red");

              svg
                  .append('defs')
                  .append('pattern')
                  .attr('id', 'diagonalHatch')
                  .attr('patternUnits', 'userSpaceOnUse')
                  .attr('width', 4)
                  .attr('height', 4)
                  .append('path')
                  .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
                  .attr('stroke', '#000000')
                  .attr('stroke-width', 1);

              svg.append("path")
                  .attr("id", "tag" + dataNest[index].key)
                  .attr("class", "tag" + dataNest[index].key)
                  .attr("class", "area")
                  .attr("d", area([left, right]))
                  .attr('fill', '#a1dd74')
                  .style("stroke", function (d) {
                    return d.key == "target" ? "#207A46":"#e9692e" ;
                  })
                  .style("opacity", "0.26")
          }
          j -= 1
        }
      }

      // svg.selectAll("g.value")
      //   .data([dataNest[index].values])
      //   .enter().append("g")
      //   .attr("class", "value")
      //   .selectAll("circle")
      //   .data(function (d) { return d; })
      //   .enter().append("text")
      //   .attr("x", function (d) { return x(d.timeperiod) + width / data.length * dataNest.length / 2 })
      //   .attr("y", function (d) { return y(d.value) - 10 })
      //   .attr("dx", "-9")
      //   .attr("dy", "0")
      //   .attr("font-size", "10px")
      //   .text(function (d) { return d.value; });

    }

    // svg.append("text").attr("x", width / 2)// author
    //   .attr("y", height + 50).attr("dy", ".3em")
    //   .text("Time Period")
    //   .style("fill", "#a1dd74").style("text-anchor", "middle").style("font-size", "10px")
    let val = this.unitVal;
    function createDashArray(totalLength, dashing) {
      var dashLength = dashing
                        .split(/[\s,]/)
                        .map(function (a) { return parseFloat(a) || 0 })
                        .reduce(function (a, b) { return a + b });
      
      var dashCount = Math.ceil( totalLength / dashLength );

      var newDashes = new Array(dashCount).join( dashing + " " );

      var dashArray = newDashes + " 0, " + totalLength;

      return dashArray;
    }
    function addLastCompletionAsFirstProjection(dataNest) {
      let completed = getValueByKeyDataNest(dataNest, "completed") ? getValueByKeyDataNest(dataNest, "completed").values:[];
      let projected = getValueByKeyDataNest(dataNest, "projected") ? getValueByKeyDataNest(dataNest, "projected").values: [];
      if(completed && completed.length){
        let temp = completed[completed.length -1];
        temp.key == "projected"
        projected.unshift(temp);
        dataNest.projected = projected;
      }
      return dataNest;
    }
    function getValueByKeyDataNest(dataNest, key): any {
      for (let i = 0; i < dataNest.length; i++) {
        const el = dataNest[i];
        if(el.key == key) {
          return el;
        }
      }
    }
    function removePopovers() {
      $('.popover').each(function () {
        $(this).remove();
      });
    }
    function showPopover(d) {
      $(this).popover(
        {
          title: '',
          placement: 'top',
          container: 'body',
          trigger: 'manual',
          html: true,
          animation: false,
          content: function () {
            
            return "<div style='color: #257ab6;'> Time Period : " + d.timeperiod + "</div>" + "Value : "
            + d.value +" ( " + (d.key == "completed" ? "Achieved": d.key == 'projected' ? "Projected": "Target"  )+ " )" ;

            // return "<div style='color: #257ab6;'> Time Period : " + d.timeperiod + "</div>" + "Data Value : "
            //   + d.value + "% <br> Numerator : " + Math.round(d.numerator) + '<br> Denominator : ' + d.denominator + "";
          }
        });
      $(this).popover('show');
    }

    //============Text wrap function in x-axis of column chart=====================
    function wrap(text, width) {
      text.each(function() {

        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            cnt=0,
            line = [],
            lineNumber = 0,
            lineHeight = 15, 
            y = text.attr("y"),
            x = text.attr("x"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "px");


            if(words.length == 1) {
              let chars = words.toString().split("");
              chars.splice((chars.length/2).toFixed(), 0, '-',' ');
              tspan.text(chars.join(""));
              if (tspan.node().getComputedTextLength() > width ) {
                words = chars.join("").split(/\s+/).reverse();
              }
              tspan.text('');

            }


        while (word = words.pop()) {
          cnt++;
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width ) {
            
              line.pop();
            
              tspan.text(line.join(" "));	
              line = [word];
             // if(cnt!=1)
              tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "px").text(word);
            
          }
        }
      });
    }

    d3.selection.prototype.moveToFront = function () {
      return this.each(function () {
        this.parentNode.appendChild(this);
      });
    };
    d3.selectAll(".domain, .y.axis .tick line").style({ "fill": "#a1dd74", "stroke": "#a1dd74" });
    d3.selectAll("circle.point").moveToFront();
    d3.selectAll("circle.point").enter().append("text");
  }

  glow(svg):any{
    //Container for the gradients
var defs = svg.append("defs");

//Filter for the outside glow
var filter = defs.append("filter")
    .attr("id","glow");
filter.append("feGaussianBlur")
    .attr("stdDeviation","3.5")
    .attr("result","coloredBlur");
var feMerge = filter.append("feMerge");
feMerge.append("feMergeNode")
    .attr("in","coloredBlur");
feMerge.append("feMergeNode")
    .attr("in","SourceGraphic");
  }

}
