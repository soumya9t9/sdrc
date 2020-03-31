import { Component, OnInit } from '@angular/core';
import { ToastService, ModalPopup, toastTypeEnum } from 'src/app/service/toast.service';
import { Constants } from 'src/app/constants';
declare var $: any;


@Component({
  selector: 'app-toaster-modal',
  templateUrl: './toaster-modal.component.html',
  styleUrls: ['./toaster-modal.component.scss']
})
export class ToasterModalComponent implements OnInit {

  modalData: ModalPopup;
  toastData;

  constructor(private toastService: ToastService) {
    this.handleToastService();
    this.setModalData();
    this.setToastData();
  }

  ngOnInit() { }

  closeModal() {
    $('#modal-popup-11').modal('hide');
    document.body.style.overflowY = 'auto';
    this.setModalData();
  }
  colseToast() {
    // $('#toast').toast('hide');
    $('#toast-wrapper').addClass('zi-negative')
    $('#toast').removeClass('fade show');
    $('#toast').addClass('hide');
    this.setToastData();
  }

  showToast() {
    // $('#toast').toast('show');
    $('#toast-wrapper').removeClass('zi-negative');
    $('#toast').removeClass('hide');
    $('#toast').addClass('fade show');
  }

  setModalData() {
    this.modalData = {
      type: Constants.modalPopupConst.SUCCESS || Constants.modalPopupConst.ERROR || Constants.modalPopupConst.CONFIRM,
      message: "",
      heading: "!",
      buttons: [{ label: "Ok", buttonType: Constants.buttonTypeConst.POSITIVE, callback: this.closeModal.bind(this), args: null }]
    }
  }

  setToastData() {
    this.toastData = {
      message: "",
      status: "",
      class: ""
    }
  }

  handleToastService() {
    this.toastService.getToastSubject().subscribe(res => {
      if (!res || !res.show) {
        // HIDE CASE
        res.toastType == toastTypeEnum.MODAL ? this.closeModal() : this.colseToast();
      } else {
        // SHOW CASE
        if (res.toastType == toastTypeEnum.MODAL) {
          let data = res.data;
          this.modalData = data;
          this.modalData.message = data.message;
          if (data.message) {
            $('#modal-popup-11').modal('show');
            document.body.style.overflowY = 'hidden';
          }
        } else { //(res.toastType == toastTypeEnum.NOTIFICATION)
          this.toastData.message = res.message;
          this.toastData.status = res.status;
          this.toastData.class = res.status == Constants.toastStatus.ERROR ? "danger" : "success";
          this.toastData.message && this.toastData.message.length ? this.showToast() : '';
        }
      }

    })
  }


}
