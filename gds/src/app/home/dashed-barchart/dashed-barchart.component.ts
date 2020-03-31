import { Component, OnInit, ElementRef, ViewChild, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3v4';
declare var $: any;
@Component({
  selector: 'sdrc-dashed-barchart',
  templateUrl: './dashed-barchart.component.html',
  styleUrls: ['./dashed-barchart.component.scss']
})
export class DashedBarchartComponent implements OnInit {

  @ViewChild('barChart') private chartContainer: ElementRef;
  @Input('data') private data: Array<any>;
  @Input('xGrid') private xGrid: boolean;
  @Input('yGrid') private yGrid: boolean;
  @Input('values') private values: boolean;

  allNullValues:boolean = true;
  constructor(private hostRef: ElementRef) { }

  ngOnInit() {
    if (this.data) {
      this.createChart(this.data);
    }
  }

  ngOnChanges() {
    if (this.data) {
      this.createChart(this.data);
    }
  }

  createChart(data) {
    let el = this.chartContainer.nativeElement;
    d3.select(el).select("svg").remove();
    var n = data.length, // number of layers
      m = 10 // number of samples per layer
    var layers = data;
    layers.forEach(function (layer, i) {
      layer.forEach(function (el, j) {
        el.y = undefined;
        el.y0 = i;
      });
    });

    var margin = {
      top: 50,
      right: 20,
      bottom: 70,   // bottom height
      left: 25
    },
      width =
        $(this.hostRef.nativeElement).parent().width() - margin.right - margin.left -60, height;
    // if(width > 565) {
    //   height = 350
    // } else {
    //   height = 200
    // }
    height = $(this.hostRef.nativeElement).parent().height() - margin.top - margin.bottom - 30

    //  var z = d3.scale.scaleOrdinal(['#717171']);
    var x = d3.scaleBand().domain(data[0].map(function (d) {
      return d.axis;
    })).range([0, width]).padding(0.4);

    var max = d3.max(data[0].map(function (d) {
      return parseFloat(d.value);
    }));

    if (max < 100){
      max = 100
    }

    if(max == undefined){
      max = 100
    }

    var y = d3.scaleLinear().domain([0, max]).range(
      [height, 0]);

    var color = ["#279B48"];

    var hoverColor = ["#279B48"];

    var formatTick = function (d) {
      return d.split(".")[0];
    };
    const xBandwidth = x.bandwidth() > 50 * data.length ? 50 * data.length : x.bandwidth();


    var xAxis = d3.axisBottom().scale(x).tickFormat(formatTick);
    var svg = d3.select(el).append("svg").attr("id",
      "columnbarChart").attr("width",
        width + margin.left + margin.right + 50).attr("height",
          height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + ( max >1000? 65 : 50) + "," + (data[0][0].axis.length > 20 ? 12 : 40) + ")");
    if (this.xGrid) {
      svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(make_x_gridlines()
          .tickSize(-height).tickFormat(null)
        ).selectAll("text").remove();
    }
    // add the Y gridlines
    if (this.yGrid) {
      svg.append("g")
        .attr("class", "grid")
        .call(make_y_gridlines()
          .tickSize(-width).tickFormat(null)
        ).selectAll("text").remove();
    }
     
    var layer = svg.selectAll(".layer").data(layers).enter()
      .append("g").attr("class", "layer").style("fill",
        function (d, i) {
          return color[i];
        }).attr("id", function (d, i) {
          return i;
        });

        var dot = layer.selectAll(".dot")
      .data(function(d){
        return d.slice(0, d.length-1)
      }).enter().append("g").attr("class", "dot")
      var bar = layer.selectAll(".bar")
      .data(function (d) {
        return [d[d.length-1]];
      })
    .enter().append("g")
      .attr("class", "bar");
    
    var circle = dot.append("circle")
    .attr("cx", function (d) {
      return x(d.axis) + xBandwidth/2 + 7;
    }).attr("cy", function (d) {
      return y(d.value);
    }).attr("r", function (d) {
      if (d.value == null)
        return "0px";
      else
        return "3px";
    })

    var lineFunctionCardinal = d3.line()
  .defined(function (d) { return d && d.value != null; })
  .x(function (d) {
    return x(d.axis)  + xBandwidth/2 + 7;
  }).y(function (d) {
    return y(d.value);
  }).curve(d3.curveLinear);

    var connectPath = layer.append("path")
        .attr("class", "line")
        .attr(
          "d",
          function (d) {
            return lineFunctionCardinal(d);
          }).style("stroke", "#689435").style("fill", "none")
          // .style("transition", "stroke-dashoffset 7.5s linear")
    var totalLength = connectPath.node().getTotalLength();  
    var dashing = "3, 3"

    connectPath.attr("stroke-dasharray", createDashArray(totalLength, dashing))
    .attr("stroke-dashoffset", totalLength)
    .transition()
    .duration(3000)
          //  .ease("linear")
          .attr("stroke-dashoffset", 0);
    var rect = bar.append("rect")
  
    .attr("y", height).attr("width", xBandwidth).attr(
      "height", 0)
      
      .style("cursor", (d) => {
        if (d.value) {
          return 'pointer'
        }
        else {
          return 'default'
        }
      })
      
      .on("mouseover", function (d) {
        showPopover.call(this, d)
        d3.select(this)
        .attr('fill', "#279B48");
      }).on("mouseout", function (d) {
        removePopovers()
        d3.select(this).attr("fill", function() {
          return "#279B48";
      });
      });

      for (var i = 0; i < data.length; i++) {
      bar.append("text")
   
      .attr("x", function(d) {  
        return x(d.axis) + (x.bandwidth() - xBandwidth) / 2 + xBandwidth / (2 * data.length) + (xBandwidth / data.length * i); })
      .attr("y", 200)
      .style("text-anchor", "middle")
      .style("fill", "#000").text(function (d) {
        return d.value;
      }).style("font-size", "12px");

      dot.append("text")
   
      .attr("x", function(d) {  
        return x(d.axis) + xBandwidth/2 + 7})
      .attr("y", function(d) { return y(d.value) - 7})
      .style("text-anchor", "middle")
      .style("fill", "#000").text(function (d) {
        return d.value;
      }).style("font-size", "12px");
    }
    // transitionGrouped();
    y.domain([0, max]);
    bar.selectAll("rect").transition().duration(1000).delay(0).attr("x", function (d) {
      return x(d.axis) + (x.bandwidth() - xBandwidth) / 2 + xBandwidth / n * d.y0;    
    }).attr("width", xBandwidth / n).transition().attr(
      "y", function (d) {
        return y(d.value);
      }).attr("height", function (d) {
        return height - y(d.value);
      });

        bar.selectAll("text").transition().duration(2000).delay(0)
        .attr("y", function (d) {
          return y(d.value) - 3;
        })
        .tween("text", function(d) {
          var i = d3.interpolate(0, d.value);
          return function(t) {
            if(d.value){

              if(d.value < 1){
                d3.select(this).text((i(t)));
              }else{
                d3.select(this).text(Math.round(i(t)));
              }
             
            }
          };
        });

        
      //check for no data availble
      let allNullValues = true;
      for (let j = 0; j < data.length; j++) {
        for (let k = 0; k < data[j].length; k++) {
          if (data[j][k].value != null) {
            allNullValues = false;
          }
        }
         
      }
      if (allNullValues) {
          svg.append("text")
          .attr("transform", "translate(" + ((width / 2)) + "," + (height/2 -30) + ")")
            .attr("x", 0)
            .attr("y",30)
            .attr("font-size", "20px")
            .style("text-anchor", "middle")
            .text("Data Not Available");
            return;
      }
    if(!allNullValues) {
    svg.append("g").attr("class", "x axis").attr("transform",
      "translate(0," + height + ")").call(xAxis)
      .selectAll("text").style("text-anchor", "end")
      .attr("class", function (d, i) { return "chartBartext" + i })
      .attr("dx", "-0.8em").attr("dy", "0em")
      .style("transform", "rotate(-45deg)")
      // .call(wrap, x.bandwidth(), width);

    var yAxis = d3.axisLeft().scale(y).ticks(5);

    svg.append("g").attr("class", "y axis").call(yAxis).append(
      "text").attr("transform", "rotate(-90)")
      .attr("y",function(){
        if(max> 1000){
         return  -40 - margin.left
        }else{
         return -18 - margin.left
        }
      })
      .attr("x", 0 - (height / 2)).attr(
          "dy", "1em").attr("text-anchor", "end").style("fill", "#333")
      .style("font-weight", "400")
      .attr("font-family", "'Questrial', sans-serif")
      .style("font-size", "13px")
      // .text(data[0][0].unit);
    }

    // gridlines in x axis function
    function make_x_gridlines() {
      return d3.axisBottom(x)
        .ticks(5)
    }

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

    // gridlines in y axis function
    function make_y_gridlines() {
      return d3.axisLeft(y)
        .ticks(5)
    }

    function transitionGrouped() {
      y.domain([0, max]);

      rect.transition().duration(2000).delay(0).attr("x", function (d) {
        return x(d.axis) + (x.bandwidth() - xBandwidth) / 2 + xBandwidth / n * d.y0;    
      }).attr("width", xBandwidth / n).transition().attr(
        "y", function (d) {
          return y(d.value);
        }).attr("height", function (d) {
          return height - y(d.value);
        });
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
            if(d.axis != '' && d.denominator != null && d.numerator!=null && d.unit == 'Percentage'){
              return "<div style='color: #495769;'>" +"<b>"+ d.axis +"</b>"+ "</div>" + 
              "<div>" +" Data Value : "+"<span style='color: #495769;font-weight:500;'>"+ d.value +"%"+"</span>"+ "</div>"+
              "<div>" + "Numerator : " +"<span style='color: #495769;font-weight:500'>"+ d.numerator +"</span>"+ "</div>"+
              "<div>" +"Denominator : " +"<span style='color: #495769;font-weight:500'>"+ d.denominator +"</span>"+ "</div>";
            }else if(d.denominator == null && d.numerator==null && d.unit == 'Percentage'){
              return "<div style='color: #495769;'>" +"<b>"+ d.axis +"</b>"+ "</div>" + 
              "<div>" +" Data Value : "+"<span style='color: #495769;font-weight:500;'>"+ d.value +"%"+"</span>"+ "</div>";
            } else if(d.denominator == null && d.numerator!=null && d.unit == 'Percentage'){
              return "<div style='color: #495769;'>" +"<b>"+ d.axis +"</b>"+ "</div>" + 
              "<div>" +" Data Value : "+"<span style='color: #495769;font-weight:500;'>"+ d.value +"%"+"</span>"+ "</div>"+
              "<div>" + "Numerator : " +"<span style='color: #495769;font-weight:500'>"+ d.numerator +"</span>"+ "</div>";
            }else if(d.denominator != null && d.numerator==null && d.unit == 'Percentage'){
              return "<div style='color: #495769;'>" +"<b>"+ d.axis +"</b>"+ "</div>" + 
              "<div>" +" Data Value : "+"<span style='color: #495769;font-weight:500;'>"+ d.value +"%"+"</span>"+ "</div>"+
              "<div>" +"Denominator : " +"<span style='color: #495769;font-weight:500'>"+ d.denominator +"</span>"+ "</div>";
            }
          else{
              return "<div style='color: #495769;'>" + "<b>" + d.axis + "</b>" + "</div>" +
              "<div style='color: #495769;'> Data Value: " + d.value + "</div>";
          }
        }
        });
      $(this).popover('show');


    }
    //============Text wrap function in x-axis of column chart=====================



    function wrap(text, width, windowWidth) {
      text.each(function () {
        var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          cnt = 0,
          line = [],
          textLength = text.node().getComputedTextLength(),
          lineNumber = 0,
          lineHeight = 1,
          y = text.attr("y"),
          ellipsis = text.text('').append('tspan').attr('class', 'elip').text('...'),
          dy = parseFloat(text.attr("dy"));
        if (windowWidth > 660)
          var tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em").style('font-size', '10px');
        else
          var tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em").style('font-size', '10px');

        if (words.length == 1) {
          let chars = words.toString().split("");
          chars.splice((chars.length / 2).toFixed(), 0, '-', ' ');
          tspan.text(chars.join(""));
          if (tspan.node().getComputedTextLength() > width) {
            words = chars.join("").split(/\s+/).reverse();
          }
          tspan.text('');
        }
        while (word = words.pop()) {
          cnt++;
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            // if(cnt!=1)
            if (width > 660)
              tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").style('font-size', '10px').text(word);
            else
              tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").style('font-size', '10px').text(word);
          }
        }
      });
    }


  }

}
