import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../constants';
import { detachProjectedView } from '@angular/core/src/view/view_attach';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private httpClient: HttpClient) {
   }

  getAllGoals() {
    return this.httpClient.get(Constants.HOME_URL + "api/v1/dashboard/sectors");
  }

  getTargetIdicatorDepartmentList(goalCode) {
    return this.httpClient.get(Constants.HOME_URL + "api/v1/home/getIndicatorTargetDepartmentsList" +  (goalCode != 'GOAL_0' ? "?goalCode=" + goalCode: ''));
  }


  getGoalDataDistrictWise(goalCode, timperiodId) {
    return this.httpClient.get(Constants.HOME_URL + "api/v1/home/stackChartData?goal="+ goalCode + "&timeperiodId="+timperiodId)
  }


  getIndicatorTableData(areaCode, timeperiodId, goalCode) {
    return this.httpClient.get(Constants.HOME_URL + "api/v1/home/goalIndicatorsWithTrend?areaCode=" + areaCode
     + "&timeperiodId=" + timeperiodId + "&goalCode=" + goalCode);
  }

  getGoalsTrend(area, timeperiodId) {
    return this.httpClient.get(Constants.HOME_URL + "api/v1/home/goalTrends?area=" + area + "&timeperiodId=" + timeperiodId)
  }

  getAllTimeperiods() {
    return this.httpClient.get(Constants.HOME_URL + 'api/v1/timperiod/getYearlyTpHavingData')
  }

  getDeptIndicatorCounts() {
    return this.httpClient.get( Constants.HOME_URL+'api/v1/home/getIndicatorTargetDepartments')
  }

}
