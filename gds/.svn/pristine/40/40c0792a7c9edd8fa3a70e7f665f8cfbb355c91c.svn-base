import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../constants';
import { Indicator } from '../models/indicator';
import { Observable } from 'rxjs';
import { Timeperiod } from '../models/timeformats';
import { Sector } from '../models/sector';
import { Source } from '../models/sources';
import { Data } from '../models/data';

@Injectable()
export class DashboardService {

  isMapLoading: boolean;
  sources: any;
  selectedIndicator:string;
  selectedIndicatorId:number;
  constructor(private httpClient: HttpClient) { }

  getSector(){
  // return this.httpClient.get('assets/json/goall.json');
    return this.httpClient.get(Constants.HOME_URL + 'api/v1/dashboard/sectors');
  }
  getTimperiods(){
    return this.httpClient.get('assets/json/timePeriod.json');
  }
  getIndicators(sectorKey){
    // return this.httpClient.get('assets/json/indicator.json');
    return this.httpClient.get(Constants.HOME_URL + 'api/v1/dashboard/indicators?sector='+sectorKey);
  }
  getThematicMapData(){
    // return this.httpClient.get('assets/json/IND020.json');
  }
  getDashoardData(indicatorId,sourceNid,parentAreaCode){
    // return this.httpClient.get('assets/json/dashboardDataValue.json'); 
    return this.httpClient.get(Constants.HOME_URL + 'api/v1/dashboard/data?indicatorId='+(indicatorId?indicatorId:null) +'&sourceNid='+(sourceNid?sourceNid:null) +'&parentAreaCode='+parentAreaCode);
  }
  getbarChartData(){
    return this.httpClient.get('assets/json/bar-chat.json');
  }
  getThematicMapLegends(){
    return this.httpClient.get('assets/json/legend.json');
  }

  getLineChartData(data){
    return this.httpClient.post(Constants.HOME_URL+'api/v1/dashboard/lineData', data);
  }
  getSnapshotLineBarChartData(){
    return this.httpClient.get('assets/json/trendchart.json');
  }
  exportData(data){
    return this.httpClient.post(Constants.HOME_URL + 'api/v1/export/exportData', data, {responseType: "blob"});
  }
 getSource(iusnid){
   return this.httpClient.get(Constants.HOME_URL + 'api/v1/dashboard/sources?iusnid='+iusnid)
 }

 goalIndexesIusMappings() {
   return this.httpClient.post(Constants.HOME_URL + "api/v1/dashboard/goalIndexesIusMappings", {})
 }

 getDistrict(){
   return this.httpClient.get(Constants.HOME_URL+ 'api/v1/district/findAllAreas');
 }

getDistrictLineData(model){
  const httpOptions = {
    headers: new HttpHeaders({
    'Content-Type': 'application/json'
    }),
};
  return this.httpClient.post(Constants.HOME_URL + 'api/v1/data/lineDataOfIus', model );
} 

  getKeys(obj){
    return Object.keys(obj);
  }

  getMapJson(){
    return this.httpClient.get(Constants.HOME_URL+'api/v1/district/downloadMapJson');
  }



  isEqual(value, other) {

    // Get the value type
    const type = Object.prototype.toString.call(value);

    // If the two objects are not the same type, return false
    if (type !== Object.prototype.toString.call(other)){ return false; }

    // If items are not an object or array, return false
    if (['[object Array]', '[object Object]'].indexOf(type) < 0) { return false;}

    // Compare the length of the length of the two items
    const valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
    let otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
    if (valueLen !== otherLen) return false;

    // Compare two items
    var compare = (item1, item2) => {

      // Get the object type
      var itemType = Object.prototype.toString.call(item1);

      // If an object or array, compare recursively
      if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
        if (!this.isEqual(item1, item2)) return false;
      }

      // Otherwise, do a simple comparison
      else {

        // If the two items are not the same type, return false
        if (itemType !== Object.prototype.toString.call(item2)) return false;

        // Else if it's a function, convert to a string and compare
        // Otherwise, just compare
        if (itemType === '[object Function]') {
          if (item1.toString() !== item2.toString()) return false;
        } else {
          if (item1 !== item2) return false;
        }

      }
    };

    // Compare properties
    if (type === '[object Array]') {
      for (var i = 0; i < valueLen; i++) {
        if (compare(value[i], other[i]) === false) return false;
      }
    } else {
      for (var key in value) {
        if (value.hasOwnProperty(key)) {
          if (compare(value[key], other[key]) === false){ return false;};
        }
      }
    }

    // If nothing failed, return true
    return true;

  };










}
