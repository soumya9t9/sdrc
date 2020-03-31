import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Constants } from '../constants';
import { Button } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  toastSubject: Subject<any>;

  constructor() {
    this.toastSubject = new Subject();
  }

  getToastSubject(): Subject<any> {
    return this.toastSubject = new Subject();
  }

  showToast(message: string, status: string) {
    let that = this;
    this.toastSubject.next({ show: true, message: message, status, toastType: Constants.toastType.NOTIFICATION });
    setTimeout(this.clearToast.bind(that), 15000);
  }

  error(message) {
    this.showToast(message, Constants.toastStatus.ERROR);
  }

  success(message) {
    this.showToast(message, Constants.toastStatus.SUCCESS);
  }

  showModal(data: ModalPopup) {
    let that = this;
    this.toastSubject.next({ show: true, data: data, toastType: Constants.toastType.MODAL });
    // setTimeout(this.hideModal.bind(that), 5000);
  }

  errorModal(message: string, heading?) {
    let modalData: ModalPopup = {
      type: Constants.modalPopupConst.ERROR,
      message: message,
      heading: heading || null,
      buttons: [{ label: "Ok", buttonType: Constants.buttonTypeConst.POSITIVE, callback: this.hideModal.bind(this), args: null }]
    };
    this.showModal(modalData);
  }

  successModal(message: string, heading?) {
    let modalData: ModalPopup = {
      type: Constants.modalPopupConst.SUCCESS,
      message: message,
      heading: heading || null,
      buttons: [{ label: "Ok", buttonType: Constants.buttonTypeConst.POSITIVE, callback: this.hideModal.bind(this), args: null }]
    }
    this.showModal(modalData);
  }


  hideModal() {
    this.toastSubject.next({ show: false, toastType: Constants.toastType.MODAL });
  }

  clearToast() {
    this.toastSubject.next({ show: false, toastType: Constants.toastType.NOTIFICATION });
  }
}

export interface ModalPopup {
  show?: boolean;
  message: string;
  heading?: string;
  buttons: Button[];
  type: string | `success` | 'error' | 'confirm';
}

export enum toastTypeEnum {
  MODAL = "MODAL",
  NOTIFICATION = "NOTIFICATION"
}