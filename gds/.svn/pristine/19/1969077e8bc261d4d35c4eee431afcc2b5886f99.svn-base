import { Component, OnInit,Input, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { Constants } from '@src/app/constants';
import { DashboardConstants } from '../dashboard.constant';
declare var $:any;

@Component({
  selector: 'sdrc-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BarChartComponent implements OnInit {
  
  @ViewChild('barChart') private chartContainer: ElementRef;
  @Input() private data: any;

  constructor(private hostRef: ElementRef) { }

  ngOnInit() {
    if (this.data) {
      if (this.data && this.data.chartData.length) {
        this.createChart(this.data.chartData);
      }else {
        let el = this.chartContainer.nativeElement;
        d3.select(el).select("svg").remove();
      }
    }
  }
  
  // ngOnChanges(changes){
  //   if(this.data && changes.data.previousValue){
  //     if (this.data.length) {
  //       this.createChart(this.data);
  //     }else {
  //       let el = this.chartContainer.nativeElement;
  //       d3.select(el).select("svg").remove();
  //     }
  //   }
  // }

  createChart(data){
    let el = this.chartContainer.nativeElement;
    d3.select(el).select("svg").remove();
    var n = data.length, // number of layers
    m = 10 // number of samples per layer
    var layers = data;
    layers.forEach(function(layer, i) {
      layer.forEach(function(el, j) {
        el.y = undefined;
        el.y0 = i;
      });
    });
    
    var margin = {
      top: 70,
      right: 65,
      bottom: 125,
      left: 40
    }
    let w = $(this.hostRef.nativeElement).parent().width();
    let h = 322;

    let width = w - margin.left - margin.right
    let height = h - margin.top - margin.bottom;
   
    var x = d3.scaleBand().domain(data[0].map(function(d) {
      return d.axis;
    })).range([0, width]).padding(0.1);

    var max = 0;
    for (let index = 0; index < data.length; index++) {
      var layerMax = d3.max(data[index].map(function (d) {
        //  return parseFloat(d.value); 
        if(d.unit == "Per cent"){
          return 100;
        }
        else{
          return parseFloat(d.value);
        }
        }));
        if(layerMax > max){
          max = layerMax;
        }
    }



// if (max < 100){
//   max = 100
// }

// if(max == undefined){
//   max = 100
// }
let viewportWidth = $(window).width();
    var y = d3.scaleLinear().domain([ 0, max ]).rangeRound(
      [ height, 0 ]);
  
  
  
    var formatTick = function(d) {
      return d.split(".")[0];
    };
   
    var xAxis = d3.axisBottom().scale(x).tickFormat(formatTick);
    var svgRender = d3.select(el).append("svg").attr("id",
        "cardbarChart").attr("width",
        width + margin.left + margin.right).attr("height",
        height + margin.top + margin.bottom)
        .attr("xmlns","http://www.w3.org/2000/svg")
          .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
    var svg = svgRender.append("g")
        .attr(
            "transform",
            "translate(" + (margin.left + 15) + ","
                + margin.top + ")");
  
                svgRender.append("text")
                .attr("x", 10)
                .attr("y", 5)
                .attr("dy", 15)
                .attr("font-size", "12px" )
                .style("fill", "#000000")
                .style("font-weight", "bold")
                .text(this.data.indicatorName).call(wrap, width);
                svgRender.append("svg:image")
                .attr("xlink:href", DashboardConstants.legends.star)
                .attr("x", w - 35 )
                .attr("y", 45 )
                .attr("width", "15")
                .attr("height", "15")

    //  check for no data availble
let allNullValues = true;
if (data.length > 0) {
  for (let i = 0; i < data.length; i++) {
    const layer = data[i];
    for (let j = 0; j < layer.length; j++) {
      if (layer[j].value != null) {
        allNullValues = false;
        break;
      }
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


    var layer = svg.selectAll(".layer").data(layers).enter()
        .append("g").attr("class", "layer").attr("id", function(d, i) {
          return i;
        });
  
    var rect = layer.selectAll("rect").data(function(d) {
      return d;
    }).enter().append("rect").attr("x", function(d) {
      return x(d.axis);
    }).attr("y", height).attr("width", x.bandwidth()).attr(
        "height", 0).on("mouseover", function(d) {
      showPopover.call(this, d);
    
      
  
    }).on("mouseout", function(d) {
      removePopovers();
     
      

    }).style("fill",
    function(d, i) {
      if(d && d.key == 'target') {
        return "#207a46"
      }
      if(d && d.key == 'completed') {
        return "#e9692e"
      }
      
      if(d && d.key == 'projected') {
        return "#ff9666"
      }
    });

    // Current Value
    svgRender.append("text")
    .attr("x", 10)
    .attr("y", h-25)
    .attr("font-size", "11px" )
    .style("fill", "#000000")
    .text("Current Value:" + this.data.chartData[0].filter(d => d.latest)[0].value);

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
      .append("rect")
              .attr("x", 41+x_position)
              .attr("y", h-60 )
              .attr("width", "15px")
              .attr("height", "15px")
              .style("text-anchor", "start")
              .style("fill", "#207a46");
              // .style("text-anchor", "start");
              imgs.enter().append("text")
              .attr("x", 60 )
              .attr("y", h-47 )
              .attr("width", "12")
              .attr("height", "8")
              .style("font-size", "12").text("Target")
            }
   
              imgs.enter()
              .append("rect")
              .attr("x", 110+x_position)
              .attr("y", h-60 )
              .attr("width", "15px")
              .attr("height", "15px")
              .style("text-anchor", "start")
              .style("fill", "#e9692e");
              imgs.enter().append("text")
              .attr("x", 130 )
              .attr("y", h-47 )
              .attr("width", "12")
              .attr("height", "8")
              .style("font-size", "12").text("Achieved")
            
     
              imgs.enter()
              .append("rect")
              .attr("x", 200+x_position)
              .attr("y", h-60 )
              .attr("width", "15px")
              .attr("height", "15px")
              .style("text-anchor", "start")
              .style("fill", "#ff9666");

              imgs.enter().append("text")
              .attr("x", 220 +x_position)
              .attr("y", h-47)
              .attr("width", "12")
              .attr("height", "8")
              .style("font-size", "12").text("Projected");
  
    svg.append("g").attr("class", "x axis").attr("transform",
        "translate(0," + height + ")").call(xAxis)
        .selectAll("text").style("text-anchor", "middle")
        .attr("class",  function(d,i){return  "evmtext"+i})
        .attr("dx", "-.2em").attr("dy", ".70em");
      d3.selectAll(".x.axis .tick text").attr("dx", "-10px").attr("dy",
      "3").attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    // svg.append("text").attr("class", "x axis").attr("transform",
    //     "translate(0," + height + ")").attr(
    //     "x", width / 2).attr("y", margin.bottom).attr("dx",
    //     "1em").style("text-anchor", "middle").text(
    //     "Time Period");
   
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle").
      style("font-size","10px")
      .text(data[0][0].unit); 
      // .text(data[0][0].unit.replace(new RegExp("[ ]+","g"), "")); 
    var yAxis = d3.axisLeft().scale(y).ticks(5);; 
        
    svg.append("g").attr("class", "y axis").call(yAxis)

  
    function transitionGrouped() {
      // y.domain([ 0, max ]);
  
      rect.transition().duration(500).delay(function(d, i) {
        return i * 10;
      }).attr("x", function(d, i, j) {
        return x(d.axis) + x.bandwidth() / n * d.y0; // function(d)     
      }).attr("width", x.bandwidth() / n - 1).transition().attr(
          "y", function(d) {
            return y(d.value);
          }).attr("height", function(d) {
        return height - y(d.value);
      });
    }
  
    transitionGrouped();
    function removePopovers() {
      $('.popover').each(function() {
        $(this).remove();
      });
    }
    function showPopover(d) {
      $(this).popover(
          {
            title : '',
            placement : 'top',
            container : 'body',
            trigger : 'manual',
            html : true,
            animation: false,
            content : function() {
              if(d.axis != "")
              return "Score : " + d.value + "<br>Timeperiod : " + d.axis;
              else
                return "<div style='color: #257ab6;'> Average: " + d.value + "%</div>" ;
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
  }

}
  