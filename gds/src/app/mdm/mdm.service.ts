import { Injectable } from '@angular/core';
import { Constants } from '../constants';
import { HttpService, Payload } from '../service/http.service';
import { toastTypeEnum } from '../service/toast.service';

@Injectable({
  providedIn: 'root'
})
export class MdmService {

  headers;
  constructor(
    private httpService: HttpService
  ) { }

  /*****************************/
  /******* INDICATOR MANAGMENT START ******/
  /***************************/
  getIndicators(sectorKey) {
    let httpPayload: Payload = {
      url: Constants.API_URL + "v1/dashboard/indicators",
      method: "GET",
      params: {
        sector: sectorKey
      }
    }
    return this.httpService.doApiCall(httpPayload);
  }

  getIndicatorsFields() {
    let httpPayload: Payload = {
      url: "assets/json/getIndicatorFields.json",
      method: "GET",
    }
    return this.httpService.doApiCall(httpPayload);
  }



  saveAllIndicators(data) {
    let httpPayload: Payload = {
      url: Constants.API_URL + "v1/indicator/updateBulkTargetValues",
      method: "POST",
      body: data
    }
    return this.httpService.doApiCall(httpPayload);
  }

  /******* INDICATOR MANAGMENT END ******/

  /*****************************/
  /******* ROLE MANAGMENT ******/
  /***************************/

  getAllPermissions() {
    let httpPayload: Payload = {
      url: Constants.API_URL + "v1/rolesPermissions/findAllPermissions",
      method: "GET",
    }
    return this.httpService.doApiCall(httpPayload);
  }

  getAllRoles() {
    let httpPayload: Payload = {
      url: Constants.API_URL + "v1/rolesPermissions/findAllRoles",
      method: "GET",
    };
    return this.httpService.doApiCall(httpPayload);
  }

  /** Save role details links */
  createRole(payload) {
    let url = payload.params.roleId ? "v1/rolesPermissions/editRole" : 'v1/rolesPermissions/createRole';
    let httpPayload: Payload = {
      params: payload.params,
      url: Constants.API_URL + url,
      method: "POST",
    }
    return this.httpService.doApiCall(httpPayload);
  }

  doEnableOrDisableRole(payload) {
    let httpPayload: Payload = {
      params: payload.params,
      url: Constants.API_URL + 'v1/rolesPermissions/enableDisable',
      method: "POST",
      errorToastType: toastTypeEnum.MODAL
    }
    return this.httpService.doApiCall(httpPayload);
  }

  getAllData(url?, q?, body?) {
    let httpPayload: Payload = {
      url: Constants.API_URL + url,
      method: "GET",
    };
    q ? httpPayload['params'] = q : '';
    return this.httpService.doApiCall(httpPayload);
  }

  /******* ROLE MANAGMENT END ******/
}
