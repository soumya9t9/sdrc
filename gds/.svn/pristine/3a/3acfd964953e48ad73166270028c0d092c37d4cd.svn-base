import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ToastService, toastTypeEnum, ModalPopup } from './toast.service';
import { Constants } from '../constants';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { isArray } from 'util';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  assignedToastType = [];

  constructor(
    private http: HttpClient,
    private toastService: ToastService
  ) { }

  doApiCall(payload:Payload) {
    let httpOptions = {
      params: payload.params,
      body: payload.body
    }
    this.assignedToastType.push({url:payload.url, toastType: payload.errorToastType});
    return this.http.request(payload.method || "GET", payload.url, httpOptions)
      .pipe(map(res => {
        return res;
      }))
      // .pipe(
      //   catchError(this.handleApiError.bind(this))
      // );
  }

  private handleApiError(error: HttpErrorResponse) {
    let message = "";
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      // console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
    //   console.error(
    //     `Backend returned code ${error.status}, ` +
    //     `body was: ${error.error.error_description}`);
    }
    // return an observable with a user-facing error message
    //show error message
    let toastTypeObj:any = error && isArray(error.url) ? this.assignedToastType.find(eachItem => error.url.includes(eachItem.url)) : {toastType: null};
    if (toastTypeObj.toastType == toastTypeEnum.MODAL) {
      let modalData:ModalPopup = {
        type: Constants.modalPopupConst.ERROR || "Something went worng, please try again later",
        message: error.message,
        buttons: [{ label: "Ok", buttonType: Constants.buttonTypeConst.POSITIVE, callback: this.toastService.hideModal.bind(this), args: null }]
      }
      this.toastService.showModal(modalData);
    } else {
      let option = {
        message: error.message || "Something went worng, please try again later",
        status: Constants.toastStatus.ERROR,
      }
      this.toastService.showToast(option.message, option.status);
    }
    return of(null);
    // throwError(
    //'Something bad happened; please try again later.');     
    // error.error.error_description);
  };

}

export interface Payload {
  method?: "GET" | "POST" | "DELETE";
  url:string;
  headers?: HttpHeaders,
  params?: any;
  body?: any;
  errorToastType?: toastTypeEnum
}