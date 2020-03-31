import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from 'src/app/constants';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CmsServiceService {


  selectedMenu: string;

  constructor(private httpClient: HttpClient) { }


  getCMSleftData(): any {
    // return this.httpClient.get(Constants.HOME_URL +'getCMSData');
    return this.httpClient.get('assets/json/getCms.json');

  }
  getCMSRightData() {
    return this.httpClient.get('assets/json/cmscontent.json');
  }

  uploadFile(file, url): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    const req = new HttpRequest('POST', Constants.HOME_URL + url, formdata, {
      reportProgress: true
    });

    return this.httpClient.request(req);
  }

  uploadFileData(formData, url): Observable<HttpEvent<{}>> {
    const req = new HttpRequest('POST', Constants.HOME_URL + url, formData, {
      reportProgress: true
    });

    return this.httpClient.request(req);
  }

  saveUpdateData(payload, url): Observable<any> {
    let apiUrl = Constants.API_URL + url;
    ["resetPassword", "updateUser", "createUser"].includes(url) ? apiUrl = Constants.HOME_URL + url : '';
    return this.httpClient.request("POST", apiUrl, payload)
  }

  deleteData(data): Observable<any> {
    return this.httpClient.post(Constants.HOME_URL + 'deleteData', data)
  }
  approveData(data): Observable<any> {
    return this.httpClient.post(Constants.HOME_URL + 'approveData', data)
  }
  enableDisableData(payload, url): Observable<any> {
    return this.httpClient.request("POST", Constants.API_URL + url, payload)
  }

  fetchAllData(url: string): Observable<any> {
    return this.httpClient.get(Constants.API_URL + url);
  }

  getDataWithHeaders(url, payload?): Observable<any> {
    payload ? '' : payload = {};
    payload['observe'] = 'response'; /* N.B - To get headers in the response */
    return this.httpClient.request<HttpResponse<Object>>("GET", Constants.API_URL + url, payload).pipe(
      tap(resp => console.log('response', resp))
    );
  }

  getApiData(url, payload?): Observable<any> {
    payload ? '' : payload = {};
    return this.httpClient.request("GET", Constants.API_URL + url, payload).pipe(
      tap(resp => console.log('response', resp))
    );
  }

  getRandomInt(max = 99) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  downloadTemplate(url, queryParam) {
    return this.httpClient.get(Constants.HOME_URL + url, {
      observe: 'response',
      params: queryParam
    });
  }

  uploadDataentryTemplate(url, payload, queryParam) {
    return this.httpClient.post(Constants.HOME_URL + url, payload, { params: queryParam })
  }


}

export enum MDMViewType {
  Excel = "Excel",
  Web = "Web"
}
