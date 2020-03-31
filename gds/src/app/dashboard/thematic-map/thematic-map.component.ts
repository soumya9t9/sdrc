import { Component, ElementRef, Input, OnChanges, Output, EventEmitter, OnInit } from '@angular/core';
import * as d3 from 'd3v4';
import * as topojson from 'topojson';
import { DashboardService } from '../dashboard.service';
import * as html2canvas from 'html2canvas';
import saveAs from 'save-as';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
declare var  $:any;

@Component({
  selector: 'app-thematic-map',
  templateUrl: './thematic-map.component.html',
  styleUrls: ['./thematic-map.component.scss']
})
export class ThematicMapComponent implements OnChanges {

  width;
  height;
  projection;
  path;
  svg;
  g: any;
  mapContainerDiv;
  thematicData: any;
  legends: any;
  thematicDropDownList: any;
  ngContentId:any;
  mapDataConvertedToMap = {}
  dashboardService: DashboardService;
  centered: any;
  subunits: any;
  mapPolygonJson: any;
  areaName:string;
  lineChartVisible:boolean=false;
  indicatorModels: any;
  lineChartData: any;
  selectedGoalId:any;
  mapJson:any;

  @Input() districtLineData: any;
  @Input() selectedIndicator: any;
  @Input() mapData: any;
  @Input() areaCode:any;
  @Input() unitVal: any;
  @Input() color: any;
  @Output() onAreaSelection: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectedArea:any;
  constructor(private hostRef: ElementRef, private dashboardServiceProvider: DashboardService) {
    this.dashboardService = dashboardServiceProvider;
  }

   createMapLayout() {
    // this.hostRef.nativeElement.innerHTML = "";
    // d3.select("#map svg").remove();
     $(".activeclick").removeClass("activeclick")
    this.ngContentId = '_ngcontent-' + this.hostRef.nativeElement.attributes[1].name.substr(8);
    // if(this.mapData)
    this.dashboardService.isMapLoading = true;
           
      
      if(!this.mapPolygonJson)
      d3.json(this.dashboardService.getMapJson().subscribe(data => {
        this.drawSVG();
        this.mapPolygonJson = data;
        let boundary = this.centerZoom(data);
        this.subunits = this.drawSubUnits(data);
        if(this.mapData)
        this.colorSubunits(this.subunits, data);
        this.drawOuterBoundary(data, boundary);     
      }));
      else{
        // if(this.mapData)
        this.colorSubunits(this.subunits, this.mapPolygonJson);
        // else
        // this.drawSubUnits(this.mapPolygonJson)
      }     
													

  }

  ngOnInit() {
    this.mapDataConvertedToMap = {}
    this.createMapLayout();
    if(this.mapData && this.mapData.length) {
      this.mapData.forEach(element => {
        this.mapDataConvertedToMap[element.areaCode] = element;
      });
    }
  }
  

  ngOnChanges(changes){
    if(changes.mapData) {
    this.mapData = changes.mapData.currentValue;
      this.mapDataConvertedToMap = {}
    // console.log(changes)
    if(changes.mapData.currentValue && changes.mapData.currentValue != changes.mapData.previousValue){
      
      this.mapData.forEach(element => {
        this.mapDataConvertedToMap[element.areaCode] = element;
      });
      
    }
    if(!this.dashboardService.isEqual(changes.mapData.currentValue, changes.mapData.previousValue))
    this.createMapLayout();
  }
  
  }


  centerZoom(data) {
    let o = topojson.mesh(data, data.objects.layer1, (a, b) => {
      return a === b;
    });

    this.projection
      .scale(1)
      .translate([0, 0]);

    let b = this.path.bounds(o),
      s = 1 / Math.max((b[1][0] - b[0][0]) / this.width, (b[1][1] - b[0][1]) / this.height),
      t = [(this.width - s * (b[1][0] + b[0][0])) / 2, (this.height - s * (b[1][1] + b[0][1])) / 2];

    let p = this.projection
      .scale(s)
      .translate(t);
    //console.log(o);    
    return o;
  }

  drawOuterBoundary(data, boundary) {
    this.g.append("path")
      .datum(boundary)
      .attr("d", this.path)
      .attr("class", "subunit-boundary")
      .attr("fill", "none")
      .attr("stroke", "#000000");
  }
  drawSVG(){
    this.width = $(this.hostRef.nativeElement).parent().width();
      this.height = 450;
      this.projection = d3.geoMercator();
      this.path = d3.geoPath()
        .projection(this.projection)
        .pointRadius(2);
        d3.select("#map").selectAll("svg").remove();
    this.svg = d3.select("#map").append("svg")
        .attr("width", this.width)
      .attr("height", this.height).attr("class", "svg").attr("id",
        "thematicMap")
      this.g = this.svg.append("g")
      .style('margin-left', '2px')
  }
  drawSubUnits(data) {

    let subunits = this.g.selectAll(".subunit")
      .data(topojson.feature(data, data.objects.layer1).features)
      .enter().append("path")
      .attr("class", "subunit")
      .attr("d", this.path)
      .on("mouseover", this.onover)            
      .on("mouseout", this.onmouseout)
      .on("mousemove", this.onmousemove)
      // .on("click", this.getTrendChart)
      .style("stroke", "#000000")
      .style('fill', '#9e9e9e')
      .style("stroke-width", "1px").attr(this.ngContentId, "");
      

    return subunits;
  }

  colorSubunits(subunits, data) {
     
    let mapDataTemp = []
    subunits
      // .attr("class",  (d, i) =>{
      //   let selectedArea = this.mapDataConvertedToMap[d.properties.ID_];
        
      //   if(selectedArea)
      //    return selectedArea.cssClass;
      //    else
      //    return "fifthslices";
         
      // })
      .style("fill", (d, i) => {
        let selectedArea = this.mapDataConvertedToMap[d.properties.ID_];
        if(selectedArea){
          return selectedArea.cssClass == 'firstslices'? '#C0504D': selectedArea.cssClass == 'secondslices' ? '#FFC000': selectedArea.cssClass == 'thirdslices' ? '#4BACC6': selectedArea.cssClass == 'fourthslices' ? '#009900': '#a5a7a9'
        } else
           return "#a5a7a9";
 
        
     })

      .style("opacity", ".8")
      .style("cursor", "pointer")
      .on("mouseout",(d)=>this.onmouseout())
      .on("mouseover", (d) =>
        this.onover(d, event)
      ).on("click", (d) => this.clicked(d, subunits, event))

      // name of area added and with value
      $("#map svg").find("text").remove()
      let el = this.g.selectAll("text")
													.data(topojson.feature(data,data.objects.layer1).features)
													.enter().append("svg:text").style("fill","#333")
      el.append("tspan").attr("x",(d) => {
          return this.path.centroid(d)[0];
      })
      .attr("y",(d) => {
          return this.path.centroid(d)[1];
      })
      .attr("class", "area-text")
      .on("mouseout",(d)=>this.onmouseout())
      .on("mouseover", (d) =>
        this.onover(d, event)
      )
      .on("mousemove", this.onmousemove)
      .style("font-size", "10px")
      .style("text-anchor", "middle")
      .attr("class","shortName")
      .style("cursor", "pointer")
      .text((d) => {
        if(this.mapDataConvertedToMap[d.properties.ID_])
        return this.mapDataConvertedToMap[d.properties.ID_].areaName 
      })
      
    //   el.append("tspan").attr("x",(d) => {
    //     return this.path.centroid(d)[0];
    // })
    // .attr("y",(d) => {
    //     return this.path.centroid(d)[1] + 5;
    // })
    // .attr("class", "area-text")
    // .on("mouseout",(d)=>this.onmouseout())
    // .on("mouseover", (d) =>
    //   this.onover(d, event)
    // ).on("click", (d) => this.clicked(d, subunits, event))
    // .style("font-size", "10px")
    // .style("text-anchor", "middle")
    // .style("cursor", "pointer")
    // .text((d) => {
    //   if(this.mapDataConvertedToMap[d.properties.ID_])
    //     return this.mapDataConvertedToMap[d.properties.ID_].value
    //   else
    //     return null 
    // })
    this.dashboardService.isMapLoading = false;                                                                                                                                                                                                                                                                                                                                                                                                                                                  
  }
  onover(d, event){    
    d3.selectAll(".activehover").classed("activehover",
                  false);

      let datavalue; 
      let selectedArea = this.mapDataConvertedToMap[d.properties.ID_];
      if(selectedArea){
        datavalue = this.unitVal=='Percentage' ? selectedArea.value + ' %':  selectedArea.value;
      }
      else{
        datavalue = "NA";
      }
      d3.select(".map_popover_content").html(
       "<strong>Area Name:</strong> <span >"
          + d.properties.NAME1_ + "</span><br/><strong>Data Value:</strong> <span >"
          + datavalue );

  }
  onmousemove(d) {
    d3.select(".map_popover")
      .style("display", "block")
      .style("left", (d3.event.pageX - 330) + "px")
      .style("top", (d3.event.pageY - 250) + "px")
      .style("opacity", "1")
      .style("padding", "5px 7px")
      .style("font-size","13px");
  }
  onmouseout() {
    d3.select(".map_popover").style("display", "none");
    d3.selectAll(".activehover").classed("activehover",
    false);
  }
  

  clicked(d, subunits, event) {

    if (d && this.mapDataConvertedToMap[d.properties.ID_]){

      $(".activeclick").removeClass("activeclick")
      subunits
        .attr("class", function (area, i) {

          if (d.properties.ID_ == area.properties.ID_) {
            return d3.select(this).attr("class") + " activeclick";
          }

          else {
            return d3.select(this).attr("class")
          }

        }, true)

    if (this.mapDataConvertedToMap[d.properties.ID_]){
      this.onAreaSelection.emit({
        selectedArea: this.mapDataConvertedToMap[d.properties.ID_]
      });
  }
}
    if(this.selectedIndicator){
      let selectedArea = this.mapDataConvertedToMap[d.properties.ID_];
      this.areaName=selectedArea.areaName;   
      var areaClickId = d.properties.ID_;
     let model= {
        "areaCode": areaClickId,
        "iusid": this.selectedIndicator
      }
      this.dashboardService.getDistrictLineData(model).subscribe(data=>{
        
        this.lineChartData = data;
        this.indicatorModels = this.lineChartData; 
        if(data!=null || data!=undefined){
          this.lineChartVisible=true;
        }
      })
    }
 
    
  }
  closeViz(){
    this.lineChartVisible=false;
  }
  convertToLineChartFormat(chartData) {
    for (let i = 0; i < chartData.length; i++) {
      const el = chartData[i];
      el.timeperiod = el.axis ? el.axis : el.timeperiod;
    }
    return chartData;
  }


}
