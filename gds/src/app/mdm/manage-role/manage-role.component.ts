import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl } from '@angular/forms';
import { MdmService } from '../mdm.service';
import { AppService } from 'src/app/app.service';
import { isArray } from 'util';
import { Constants } from '../../constants'
import { ToastService, ModalPopup } from 'src/app/service/toast.service';
import { Button } from 'src/app/service/interfaces';
declare var $;

@Component({
  selector: 'app-manage-role',
  templateUrl: './manage-role.component.html',
  styleUrls: ['./manage-role.component.scss']
})
export class ManageRole implements OnInit {

  color = "#207A46"
  CONSTATNTS = Constants
  allPermissions: any = []
  selectionsValue: any = {};
  itemsPerPage: number = 5;
  p: number = 1;
  searchFilter: string;
  tableColumn: any = [
    "sl_No#Sl. No.",
    "roleName#Role Name",
    "permissions#Permissions"
  ];
  tableData: any = [];
  selectedItemId: number;
  editModeOn: boolean = false;
  validationMsg: any;
  app: AppService;
  urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  modalData: ModalPopup = {
    type: Constants.modalPopupConst.SUCCESS || Constants.modalPopupConst.ERROR || Constants.modalPopupConst.CONFIRM,
    message: "",
    heading: "!SUCCESS",
    buttons: []
  }

  date;
  serializedDate
  constructor(
    private service: MdmService,
    private toastService: ToastService
  ) {
  }

  ngOnInit() {
    this.getAllPermissions();
    this.getAllRoles();
    this.date = new FormControl(new Date());
    this.serializedDate = new FormControl((new Date()).toISOString());
  }

  getAllPermissions() {
    this.service.getAllPermissions().subscribe(res => {
      this.allPermissions = res;
      console.log(res)
    });
  }

  getAllRoles() {
    this.service.getAllRoles()
      .subscribe(res => {
        let data = res;
        this.tableData = data || [];
        this.tableData.forEach((element, index) => {
          element.sl_No = index + 1;
          element.roleName = element.name;
          element.isEnabled = element.enabled;
          element.permissionsValue = element.authorityList;
          element.permissions = this.getIndividualPermissions(element.authorityList);
        });
      });
  }

  getIndividualPermissions(permissions) {
    if (!isArray(permissions)) {
      return "";
    }
    return permissions.reduce((result, eachPermission) => {
      return result + eachPermission.description + ", ";
    }, "");
  }

  editRole(roleDetails) {
    this.selectedItemId = roleDetails.id;
    this.selectionsValue.roleName = roleDetails.roleName;
    this.selectionsValue.permissions = roleDetails.permissionsValue;
    this.selectionsValue.id = roleDetails.id;
    this.allPermissions.forEach(eachOption => {
      eachOption.selected = roleDetails.permissions.includes(eachOption.description);
    })
    this.editModeOn = true;
  }

  comparer(o1: any, o2: any): boolean {
    // if possible compare by object's id property - and not by reference.
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  resetForm(form: NgForm) {
    form.resetForm();
    this.editModeOn = false;
    this.p = 1;
    this.selectionsValue = {};
  }

  openModalOnClick(roleDetails) {
    this.selectedItemId = roleDetails.id;
    this.modalData.type = Constants.modalPopupConst.CONFIRM;
    this.modalData.heading = "!INFO";
    this.modalData.message = `Do you want to ${!roleDetails.isEnabled ? 'Disable' : 'Enable'} the user `;
    this.modalData.buttons = [];
    let enableButton: Button = { label: "Enable", buttonType: Constants.buttonTypeConst.POSITIVE, callback: this.doEnableOrDisableRole.bind(this), args: roleDetails };
    let disableButton: Button = { label: "Disable", buttonType: Constants.buttonTypeConst.NEGATIVE, callback: this.doEnableOrDisableRole.bind(this), args: roleDetails };
    let cancelButton = { label: "CANCEL", buttonType: Constants.buttonTypeConst.NEUTRAL, callback: this.cancelRoleEnableDisable.bind(this), args: roleDetails };
    this.modalData.buttons.push(roleDetails.isEnabled ? enableButton : disableButton);
    this.modalData.buttons.push(cancelButton);
    this.toastService.showModal(this.modalData);
  }

  publishData(form: NgForm) {
    if (!form.valid) {
      return null;
    }
    let formValue = form.value;
    let params = {
      roleName: formValue.roleName,
      authoritiesIds: formValue.permissions.map(eachPermission => eachPermission.id) || []
    }
    this.selectionsValue.id ? params["roleId"] = formValue.id : '';
    let payload = {
      params: params,
      body: null
    }
    this.service.createRole(payload).subscribe(res => {
      $('#publishedSuccess').modal('show');
      form.resetForm();
      this.getAllRoles();
    })
  }


  clearSearchText() {
    this.searchFilter = "";
  }

  cancelRoleEnableDisable(roleDetails) {
    roleDetails.isEnabled = !roleDetails.isEnabled;
    this.hideModal();
  }

  doEnableOrDisableRole(roleDetails) {
    let payload = {
      params: {
        roleId: roleDetails.id,
        enableDisable: roleDetails.isEnabled ? true : false
      }
    }
    this.service.doEnableOrDisableRole(payload).subscribe(res => {
      this.hideModal();
      this.getAllRoles();
    });
  }

  hideModal() {
    this.toastService.hideModal();
  }

}
