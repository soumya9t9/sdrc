import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class SubmissionRejectionService {

  constructor(private httpClient:HttpClient) { }

  getIndicators() {
    
  }

  getDistrictValuesIndicatorwise() {
     return this.httpClient.get(Constants.HOME_URL + "getDistrictValuesIndicatorwise");
  }
  getDepartment(){
    return this.httpClient.get(Constants.HOME_URL+ 'api/v1/department/getAssignedDepartment');
  }
  getRejectionTableList(departmentId,indicatorId){
    return this.httpClient.get(Constants.HOME_URL+'api/v1/review/getReviewDataIndicatorWise?departmentId='+departmentId +'&indicatorId='+indicatorId);
  }
  getDistrict(){
    return this.httpClient.get(Constants.HOME_URL+ 'api/v1/district/findAllAreas');
  }
  getRejectionTableDistrictWise(departmentId,areaId){
    return this.httpClient.get(Constants.HOME_URL + 'api/v1/review/getReviewDataDistrictWise?departmentId='+departmentId +'&areaId='+areaId);
  }
  rejectIndicators(model){
    return this.httpClient.post(Constants.HOME_URL+'api/v1/review/rejectIndicators',model, {responseType: 'text'});
  }
  rejectDistricts(model){
    return this.httpClient.post(Constants.HOME_URL+'api/v1/review/rejectIndicators',model, {responseType: 'text'});
  }
}
