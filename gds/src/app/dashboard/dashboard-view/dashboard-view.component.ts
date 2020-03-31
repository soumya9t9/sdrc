import { Component, ElementRef, Input, OnChanges, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
import * as d3 from 'd3v4';
import * as topojson from 'topojson';
import { DashboardService } from '../dashboard.service';
import * as html2canvas from 'html2canvas';
import saveAs from 'save-as';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LineChartPointModel } from 'src/app/models/linechart-point.model';
import { Constants } from 'src/app/constants';
import { animation } from '@angular/animations';
import { log } from 'util';
declare var $: any;
@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss'],
  animations: [Constants.SlideDownAnimation]
})
export class DashboardViewComponent implements OnInit {

  @Input()
  width;
  height;
  projection;
  path;
  svg;
  g: any;
  thematicData: any;
  thematicDropDownList: any;
  legendData: any;
  ngContentId: any;
  selectedGoalId: number;
  ariaExpanded: boolean
  selectedArea:any;

  mapNameData: any;
  thematicKeys: any;
  clicks: number = 0;
  myDate = new Date();
  requestedForMapData: boolean;
  mapData: any = [];
  dashboardServices: DashboardService;
  lineChartData: any;
  barChartData: any;
  selectedRowNumber: number;
  lineChartVisible:boolean=false;
  thematicViewVisible:boolean=true;
  barChartVisible:boolean=true;
  indicatorVisible:boolean = false;
  areaId: string;
  sideAreaName: string = 'uttarakhand';
  areaName: string;
  primary_url: any;
  selectedTarget: any;
  selectedIndicator: any;
  selectedIndicatorId: number;
  selectedTargetId: number;
  selectedDistrictId:number;
  selectedDepartment: string;
  departmentListFromLineData: string[];
  allIndicators: any;
  allDistricts:any;
  allSectors: any;
  indicatorId: number;
  dashboardService: DashboardService;
  mapPolygonJson: any;
  subunits: any;
  mapDataConvertedToMap = {}
  thematicMapDataModels: any[] = [];
  units: any;
  name: any;
  tableViewData: any[];
  allData: any;
  dashboardView: string = 'map'; //map or bar or table
  subsectorData:any;
  goalName: any;
  cardsToDownload: any[] = [];
  // goalSource: any;

  goalIcon: any;
  allGoals: any[];
  selectedGoalName: any;
  sourceNid: number;
  parentAreaCode: string = "IND005";
  imagePath: any;
  targets: any;
  sectorkey: any[];
  source: any;
  isMapDataAvailable: boolean;
  color = Constants.goalColours;
  selectedColor: { color1: string, color2: string, color3: string, color4: string };
  goalIndexesIusMappings: any;
  selectedGoalIndexMapping: any;
  goalSourceNid: number;
  goalIusNid: number;
  indicatorModels: any;
  indicatorChartOfATarget:any[];
  thematicdataModel;
  mapdataModel;
  tableviewData;
  selectedGoalImage:any;
  isShow: boolean;
  topPosToStartShowing = 100;
  departmentName:any;
  avg: any={};
  timePeriod: number;
  areaCode:number;
  areaModels:any[]=[];
  districtLineChartRequestModel:any;
  goalShortName = Constants.goalShortNames;
  goalDescription = Constants.goalDescriptions;
  selectedAreaName:any;
  areaIdUttarakhand: any;
  areaIdUttarkhandId:number;
  selectedDistrictName:any;
  selectedWheelGoal: any;
  lineChartSource:any;
  starMark:any;
  selectedWheelGoalNeme:any;
  currentValue:number;
  allGoalsName:any;
  barChartArrayData:any;
  selectedGoalCode: string;
  achieverCount:number;
  runnerCount:number;
  performerCount:number;
  aspirantCount:number;
  targetWiseChart:any;
  singlelineChartData:any;

  @HostListener("window:scroll", []) onWindowScroll() {
    this.scrollFunction();
  }
  constructor(private hostRef: ElementRef, private dashboardServiceProvider: DashboardService) {
    this.dashboardService = dashboardServiceProvider;
  }

  ngOnInit() {
    this.areaId = 'IND005';
    this.dashboardService.getSector().subscribe(res => {
      this.allSectors = res;
      this.allGoals = this.allSectors.filter(d => d.desc == -1);
      this.allGoalsName = this.allGoals[0].national_sdmx_code;
      this.imagePath = "assets/images/";

      this.getGoalIndexesIusMappings();
      // this.sectorkey = this.allSectors[0].key;
    })
    this.mapDataConvertedToMap = {}
    this.getAllDistricts();
  }

  getGoalIndexesIusMappings() {
    this.dashboardService.goalIndexesIusMappings().subscribe(res => {
      this.goalIndexesIusMappings = res;
      this.selectGoal(this.allGoals[0]);
    })
  }

  changeLabelName() {
    // this.name = this.allGoals.name;
  }

  showLineBarChart() {
    
  }



  convertToLineChartFormat(chartParam) {
    let chart = JSON.parse(JSON.stringify(chartParam))
    for (let i = 0; i < chart.chartData[0].length; i++) {
      const el = chart.chartData[0][i];
      el.timeperiod = el.axis ? el.axis : el.timeperiod;
    }
    return chart;
  }

  convertToBarChartFormat(chartParam, index){
    // console.log(this.lineChartData[index]);
    let chart = JSON.parse(JSON.stringify(chartParam))
    let achieved = [];
    let target = [];
    let chartData = chart.chartData[0]

    for (let i = 0; i < chartData.length; i++) {
      const element = chartData[i];
      if(element.key == 'completed' || element.key == 'projected'){
        achieved.push(element);
      }
      if(element.key == 'target') {
        target.push(element);
      }
      
    }
    if(target.length) {
      chart.chartData = [achieved, target]
    } else {
      chart.chartData = [achieved]
    }
    return chart

   

  }

  selectGoal(opt) {
    this.lineChartData=[];
    this.indicatorModels = [];
    this.allIndicators = [];
    this.avg = {};
    this.selectedGoalCode = opt.national_sdmx_code;
    this.selectedDepartment = undefined;
    this.selectedDistrictName= undefined;
    this.selectedDistrictId = undefined;
    this.selectedGoalName = opt.value;
    this.selectedWheelGoalNeme = opt.value.split(':');
    this.selectedTargetId = undefined;
    this.selectedIndicatorId = undefined;
    this.selectedTarget = undefined;
    this.selectedGoalImage = this.imagePath + (opt.value.split(':')[0])+'.jpg';
    this.selectedIndicator = undefined;
    this.indicatorChartOfATarget = undefined;
    this.selectedColor = this.color[opt.value.split(':')[0]];
    this.selectedGoalId = opt.key;
    this.allGoalsName = opt.national_sdmx_code;
    this.selectedGoalIndexMapping = this.goalIndexesIusMappings.filter(goalIndex => goalIndex.key == this.selectedGoalId)[0]
    this.source = this.selectedGoalIndexMapping.sources.filter(source => source.value == 'SDG_COMPUTED_SOURCE')[0]
    // this.source = JSON.parse(JSON.stringify(this.source))
    // this.selectedWheelGoal = this.allGoals.filter(goal => goal.national_sdmx_code == this.selectedWheelGoalNeme[0]);
    if (this.source) {
      this.goalSourceNid = this.source.desc;
    } else {
      this.goalSourceNid = undefined;
    }

    this.goalIusNid = this.selectedGoalIndexMapping.desc;
    this.targets = this.allSectors.filter(d => d.desc == opt.key);
    if (this.goalSourceNid) {
      this.sourceNid = this.goalSourceNid
      this.barChartData = undefined;
      this.getMapData(this.goalIusNid, this.goalSourceNid, this.parentAreaCode);
    } else {
      this.mapData = [];
      // this.lineChartData=[];
      this.barChartData = undefined;
    }
    this.getLineData()
    // this.selectedTarget = this.targets[0];
    // this.selectedTargetId = this.targets[0].key;
    // this.getIndicatorByTargetId(this.selectedGoalId);
    this.districtLineChartRequestModel ={
      areaCode: this.areaId,
      sectorId: this.selectedGoalId
    }
    this.dashboardView="map";
    this.thematicViewVisible = true;
    this.mapData =[];
    window.scrollTo(0, 0);

  }

  getIndicatorByTargetId(parentId) {
    this.dashboardService.getIndicators(parentId).subscribe(res => {
      this.allIndicators = res;
      this.departmentName = this.allIndicators[0].reportingSource;
      this.indicatorChartOfATarget = this.indicatorModels = this.lineChartData.filter((eachIndicatorChart) => {
        return this.allIndicators.some(eachIndicator => { 
          return eachIndicator.value.split("(unit:")[0].trim() === eachIndicatorChart.indicatorName.trim();
        });
      });
      // this.selectedIndicator = this.allIndicators[0];
      // this.selectedIndicatorId= this.selectedIndicator.key;
      // this.getSourceByIndicatorId(this.selectedGoalId);

    })
  }
  getSourceByIndicatorId(selectedIndicatorId) {
    this.dashboardService.getSource(selectedIndicatorId).subscribe(data => {
      // this.isMapDataAvailable = true;
      this.source = data;
      // this.mapLoad();
      if (this.source.length) {
        this.sourceNid = this.source[0].desc;
        this.barChartData = undefined;
        this.getMapData(this.selectedIndicatorId, this.sourceNid, this.parentAreaCode);
      } else {
        this.mapData = [];
        this.barChartData = undefined;
      }

    }, error => {
      // this.isMapDataAvailable = false;
      // this.requestedForMapData = true;
    })
  }

  selectIndicator() {
    this.selectedDistrictName = undefined;
    let selectedIndArr = this.allIndicators.filter(ind => ind.key == this.selectedIndicatorId);
    if (selectedIndArr.length) {
      this.dashboardView ="bar";
      this.thematicViewVisible = false;
      this.selectedIndicator = selectedIndArr[0];
      this.indicatorModels = this.indicatorChartOfATarget.filter(indicatorChart => indicatorChart.indicatorName.toString().trim() == this.selectedIndicator.value.toString().trim())
      this.getSourceByIndicatorId(this.selectedIndicatorId);
    }
    // this.indicatorVisible=true;
  }

  selectTarget() {
    let selectedTarArr = this.targets.filter(tar => tar.key == this.selectedTargetId);
    if (selectedTarArr.length) {
      this.selectedTarget = selectedTarArr[0];
    }
    this.selectedDistrictName="";
    this.selectedIndicatorId=undefined;
    this.selectedIndicator= null;
    this.getIndicatorByTargetId(this.selectedTargetId);
    this.dashboardView="map";
    this.thematicViewVisible=true;
    // this.indicatorVisible=false;
    this.getMapData(this.goalIusNid, this.goalSourceNid, this.parentAreaCode);
    $(".activeclick").removeClass("activeclick");
   
  }

  selectDistrict(){
    if(this.selectedIndicator){
      this.selectedAreaName = this.selectedDistrictName;
      this.areaCode = this.selectedAreaName.areaCode;
      this.areaName = this.selectedAreaName.areaName;
      let model= {
        "areaCode": this.areaCode,
        "iusid": this.selectedIndicator.key
      }
      this.dashboardService.getDistrictLineData(model).subscribe(data=>{
        // this.spinner.hide();
        this.singlelineChartData = data;
        this.indicatorModels = this.lineChartData; 
        if(data!=null || data!=undefined){
          this.lineChartVisible=true;
        }
      })
    }
  
  }

  getLineData() {
    let snapshotLineChartRequestModel = {
      areaCode: this.areaId,
      sectorId: this.selectedGoalId
    }
    this.dashboardService.getLineChartData(snapshotLineChartRequestModel).subscribe(data => {
      this.lineChartData = data;
      this.indicatorModels = this.lineChartData;
      this.setDepartmentList();
      // let tempData = this.lineChartData[0].filter(data => data.key == 'completed');
      // this.lineChartSource = this.indicatorModels[0].reportSource;
      // this.starMark =  this.indicatorModels[0].takenInIndexCal;
      // setTimeout(() => {
      //   this.cardsReadyForDownload()
      // },100)
    })
  }

  setDepartmentList() {
    this.departmentListFromLineData = [];
    this.lineChartData.forEach(chart => {
      if(!this.departmentListFromLineData.includes(chart.reportSource)) {
        this.departmentListFromLineData.push(chart.reportSource)
      }
    });
    console.log(this.departmentListFromLineData)
  }
  getMapData(indicatorId, sourceNid, parentAreaCode) {
    this.dashboardService.getDashoardData(indicatorId, sourceNid, parentAreaCode).subscribe(res => {
      this.mapData = res;
      this.convertDataToBarChartFormat(this.mapData);
      this.avg = this.mapData['avg'];
      this.timePeriod = this.mapData['dataCollection'][0].timeperiod;
      this.legendData = this.mapData['legends'];
      this.thematicdataModel = res;
      this.mapdataModel = this.thematicdataModel['dataCollection'];
      this.tableviewData = this.thematicdataModel['dataCollection'];
      this.achieverCount = this.mapData['dataCollection'].filter(d=>d.value > 99).length;
      this.runnerCount= this.mapData['dataCollection'].filter(d=>d.value >= 65 && d.value < 99).length;
      this.performerCount = this.mapData['dataCollection'].filter(d=>d.value >=50 && d.value < 65).length;
      this.aspirantCount = this.mapData['dataCollection'].filter(d=>d.value >=0 && d.value < 50).length;

    })
  }

  convertDataToBarChartFormat(data) {
    this.barChartData = []
    let tempData = data.dataCollection.sort((obj, nextObj) => { parseInt(obj.rank) - parseInt(nextObj.rank) }).reverse();
    this.barChartData.push(tempData);
  }



  downloadChartToImage(el, key, IndicatorName) {
    $('.linchart-download .download').css('display', 'none');
    html2canvas(document.getElementById(key), { logging: false }).then((canvas) => {
      canvas.toBlob((blob) => {
        saveAs(blob, this.selectedAreaName ? this.selectedAreaName + "_" +  IndicatorName + ".jpg":  IndicatorName + ".jpg");
        $('.linchart-download .download').css('display', 'block');
      });
    });

  }


  async downloadExcelPDF(exportType) {
    d3.selectAll("svg").attr("version", 1.1).attr("xmlns", "http://www.w3.org/2000/svg");
    let svgDocuments = document.getElementsByTagName("svg");
    let tableAvailable: boolean = (exportType == 'pdf' ? false : true)
    let exprotModel=
      { selection: '', charts: [], exportType: exportType, selectedGoalCode: this.selectedGoalCode};
    let j=0;
    $(".download-space").css("visibility", "hidden")
    for (let i = 0; i < svgDocuments.length; i++) {

      if (svgDocuments.item(i).id == 'thematicMap') {
        let chartModel: ChartModels;
        // $('.icon-hide').css('display','none');
        await html2canvas(document.getElementById("thematic-map-main-div"), { logging: false, backgroundColor: null }).then((canvas) => {
          // $('.icon-hide').css('display','block');
          let base64 = (canvas.toDataURL("image/png", 1));
          // $('.group-icon').css('display', 'inline-flex')
          // $('.mat-select-arrow').css('color', 'rgba(0,0,0,.54)');


         chartModel={
          chartType:'thematicMap',
          chartData: this.mapdataModel,
          chartDivision:1,
           chartImageType:'base64',
          extraImage: [], 
           chartImage: base64,
          tableAvailable:true,
          chartSelection: (this.selectedGoalName !='INDEX' ?this.selectedGoalName:'Overall SDG Index'),
           axisName: "Area"
        }
        });

        exprotModel.charts.push(chartModel);
        $(".download-space").css("visibility", "visible")

      }
      else if (svgDocuments.item(i).id == 'columnbarChart') {
        let chartModel: ChartModels;
        await html2canvas(document.getElementById("thematic-map-main-div"), { logging: false, backgroundColor: null }).then((canvas) => {
          let base64 = (canvas.toDataURL("image/png", 1));

         chartModel={
          chartType:'columnbarChart',
          chartData: (exportType == 'pdf'?[]:this.mapdataModel),
          chartDivision:1,
           chartImageType:'svg',
          extraImage: [], 
           chartImage: svgDocuments.item(i).outerHTML,
          tableAvailable:true,
          chartSelection: (this.selectedGoalName !='INDEX' ?this.selectedGoalName:'Overall SDG Index') + '   ---- Uttarakhand Average:'+ (this.mapData.avg?this.avg.Uttarakhand:this.avg.Uttarakhand==""?'':'NA'),
           axisName: "Area"
        }
        });

        exprotModel.charts.push(chartModel);
    
      }
      else {
        let chartModel: ChartModels = {
          chartType: this.indicatorModels[j].chartsAvailable[0],
          chartData: this.indicatorModels[j].chartData,
          chartDivision: 1,
          chartImageType: 'svg',
          chartImage: svgDocuments.item(i).outerHTML,
          chartSelection: '',
          tableAvailable: tableAvailable,
          axisName: this.indicatorModels[j].axisName
          }
        exprotModel.charts.push(chartModel);
        j++;
      }
      
    }
     if (this.dashboardView == 'table') {

      let chartModel: ChartModels;
       chartModel={
        chartType:'table',
        chartData: this.tableviewData,
        chartDivision:1,
        chartImageType:"",
        extraImage: [], 
        chartImage: "",
        tableAvailable:true,
        chartSelection: (this.selectedGoalName !='INDEX'?this.selectedGoalName:'Overall SDG Index'),
         axisName: "Area"
      }
      exprotModel.charts.unshift(chartModel);

    }
    $(".download-space").css("visibility", "visible")
    let fileName="dashboard-view";
    this.dashboardService.exportData(exprotModel).pipe(
      map((res: Blob) => res),
      catchError((res: Blob) => throwError(res))
    ).subscribe(data => {
      let ext: string = exportType=='pdf'?'pdf':'xlsx';
      saveAs(data, fileName + "_" + new Date().getTime().toString() + "." + ext, { autoBom: true });
    },
      error => {
        // this.toastr.error(Constants.SERVER_ERROR_MESSAGE, "Error")
      });

  }

  getAllDistricts(){
    this.dashboardService.getDistrict().subscribe(data => {
      this.allDistricts = data;

    })
  }
  onAreaSelection(event){
    $('html, body').animate({
      scrollTop: $("#all-indicator-container").offset().top-150
    }, 2000);
    this.selectedArea = event.selectedArea;
    this.areaId = this.selectedArea.areaCode;
    this.selectedDistrictName =  this.selectedArea.areaName;
    this.selectedDistrictId = event.selectedArea.areaNid;
    this.getLineData();

  }
  showTrendChart(){
    if(this.selectedIndicator){
      this.selectedDistrictId= undefined;
      this.areaName = undefined;
      this.areaIdUttarakhand = this.allDistricts[0];
      this.areaIdUttarkhandId = this.areaIdUttarakhand.areaCode;
      let model= {
        "areaCode": this.areaIdUttarkhandId,
        "iusid": this.selectedIndicator.key
      }
      this.dashboardService.getDistrictLineData(model).subscribe(data=>{
        // this.spinner.hide();
        
        this.lineChartData = data;
        this.indicatorModels = this.lineChartData; 
        if(data!=null || data!=undefined){
          this.lineChartVisible=true;
        }
      })
    }else{
      this.selectedDistrictName= undefined;
      $(".activeclick").removeClass("activeclick");
      this.getLineData();
    }
   
  }

  scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("myBtn").style.display = "block";
    } else {
        document.getElementById("myBtn").style.display = "none";
    }
}
topFunction() {
  $('html, body').animate({
    scrollTop:0
  }, 2000);
} 

  closeViz(){
    this.lineChartVisible=false;
   this.targetWiseChart = this.indicatorModels;
  }

  toggleCardChartView(chart, i) {
    if(chart.chartsAvailable[0] == "trend")
      chart.chartsAvailable = ["bar"]
    else
      chart.chartsAvailable = ["trend"]
  
  }
  

}
