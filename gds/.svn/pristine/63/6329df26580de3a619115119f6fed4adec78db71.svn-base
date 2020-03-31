import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Constants } from '../constants';
import { Observable } from 'rxjs';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class DataentryService {

  constructor(private httpClient: HttpClient) { }

  getFramework(){
    // return this.httpClient.get('/assets/json/timePeriod.json');
    return this.httpClient.get( Constants.HOME_URL + 'api/v1/template/templateNames');
  }
  downloadTemplate(framework){
    return this.httpClient.get(Constants.HOME_URL + "api/v1/template/downloadDataEntryTemplates", { responseType: 'text'});
    // return this.httpClient.get(Constants.HOME_URL + "api/v1/template/downloadDataEntryTemplates", { observe: 'response',
    // responseType: 'blob' as 'json'});
  }

  uploadDataentryTemplate( details){
    return this.httpClient.post(Constants.HOME_URL + "api/v1/template/uploadDataEntryTemplate", details, {responseType: 'text'} )
  }

  getIndicatorsForWebEntry() {
    return this.httpClient.get(Constants.HOME_URL + 'api/v1/datacollection/getIndicators')
  }

  getAllGoals() {
    return this.httpClient.get(Constants.HOME_URL + "api/v1/dashboard/sectors");
  }

  saveData(data) {
    return this.httpClient.post(Constants.HOME_URL + "api/v1/datacollection/saveIndicators", data, {responseType:"text"})
  }

  // uploadDataentryTemplate(file: File): Observable<HttpEvent<{}>> {
  //   const formdata: FormData = new FormData();
  //   formdata.append('file', file);

  //   const req = new HttpRequest('POST', Constants.HOME_URL + 'api/v1/template/downloadTemplates', formdata, {
  //     reportProgress: true,
  //     responseType: 'text'
  //   });

  //   return this.httpClient.request(req);
  // }

  download(data) {
    if (data) {
      //data can be string of parameters or array/object
      data = typeof data == 'string' ? data : $.param(data);
      //split params into form inputs
      var inputs = '';
      let url = Constants.HOME_URL + 'downloadReport';
      $.each(data.split('&'), function () {
        var pair = this.split('=');
        inputs += '<input type="hidden" name="' + pair[0] + '" value="' + pair[1] + '" />';
      });
      //send request
      $('<form action="' + url + '" method="post">' + inputs + '</form>')
        .appendTo('body').submit().remove();
    };
  }
}
