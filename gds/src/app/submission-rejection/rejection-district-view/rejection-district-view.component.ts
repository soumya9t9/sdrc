import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SubmissionRejectionService } from '../submission-rejection.service';
import { MatDialog } from '@angular/material';
import { ConformationDialogComponent } from '../dialog/conformation-dialog/conformation-dialog.component';
import { ToastService } from '@src/app/service/toast.service';
import { ModalMessageComponent } from '../modal-message/modal-message.component';
declare var $: any;
@Component({
  selector: 'app-rejection-district-view',
  templateUrl: './rejection-district-view.component.html',
  styleUrls: ['./rejection-district-view.component.scss']
})
export class RejectionDistrictViewComponent implements OnInit {

  selectedDepartment: any;
  selectedDistrict: any;
  rawForm: FormGroup;
  submissionRejectionService:SubmissionRejectionService;
  allDepartments:any;
  allDistricts:any;
  districtRejectionTableData:any;
  areaId:number;
  selectedDistrictId:number;
  districts:any;
  selectedChecked:string;
  rejectedDistrictData:any;
  Message:string;
  districtTableColumns: string[];
  excludedColumns: string[] = ['Indicator Id', 'Area', 'TimeperiodId', 'SourceId', 'Id', 'isChecked', 'Message']

  @ViewChild('rawFormData') rawFormData: NgForm;
  constructor(private fb: FormBuilder, private dialog: MatDialog, private submissionRejectionProvider: SubmissionRejectionService) { 
    this.submissionRejectionService = this.submissionRejectionProvider;
  }

  ngOnInit() {
    this.rawForm = this.fb.group({
      department: new FormControl('', [Validators.required]),
      district: new FormControl('', [Validators.required]),
    });
    this.submissionRejectionService.getDepartment().subscribe(data =>{
      this.allDepartments = data;
    })
    this.submissionRejectionService.getDistrict().subscribe(data =>{
      this.allDistricts = data;
      this.districts = this.allDistricts.filter(d=>d.areaId != 2)
    })
  }
  selectDepartment(){
    
  }
  selectDistrict(selectedDistrict){
    this.selectedDistrictId = selectedDistrict.areaId;
  }
  getIndicators() {
    
  }
  showRejectionList(departmentId,areaId){
    this.submissionRejectionService.getRejectionTableDistrictWise(this.selectedDepartment.id, this.selectedDistrictId).subscribe(data=>{
      (data as Array<any>).forEach(element => {
        element.isChecked = false;
      });
      this.districtRejectionTableData = data;
      if(this.districtRejectionTableData.length)
        this.districtTableColumns = this.removeExtraKeys(Object.keys(data[0]), this.excludedColumns);
    });
  }

  removeExtraKeys(allKeys:string[], objextraKeys: string[]):string[] {
    objextraKeys.forEach(el => {
      if(allKeys.indexOf(el) != -1)
      allKeys.splice(allKeys.indexOf(el), 1)
    });
    return allKeys
  }
  CheckBoxClicked(data){
    this.selectedChecked = data.Id;
  }
  submitData(){
    for (let i = 0; i < this.districtRejectionTableData.length; i++) {
      const element = this.districtRejectionTableData[i];

      if(element.isChecked && !element.Message){
        const dialogRef = this.dialog.open(ModalMessageComponent,
          { width: '400px', disableClose: true, data: { msg: 'Please provide remark for all indicators to be rejected', header: 'Error', button: 'Ok' } });
        return false
      }
    }
    let rejectedRows = []
    this.districtRejectionTableData.forEach(element => {
        if(element.isChecked){
          let model = {
            "id": element.Id,
            "msg": element.Message
          }
          rejectedRows.push(model)
        }
    });
      this.submissionRejectionService.rejectDistricts(rejectedRows).subscribe(res=>{
        this.rejectedDistrictData = res;
        // this.resetAllChecked();
        this.showRejectionList(this.selectedDepartment, this.selectedDistrict)
        const dialogRef = this.dialog.open(ConformationDialogComponent,
          { width: '400px', disableClose: true, data: { msg: 'Rejected Successfully', button: 'Ok' } });
      }, err =>{
        const dialogRef = this.dialog.open(ConformationDialogComponent,
          { width: '400px', disableClose: true, data: { msg: 'Rejected failed', button: 'Ok' } });
      })
    
  }
  resetcheck(){
    this.districtRejectionTableData.message=null;
  }
  getCheckedElements() {
    let allCheckedElements = [];
    this.districtRejectionTableData.forEach(element => {
      if(element.isChecked){
        allCheckedElements.push(element)
      }
  });
    return allCheckedElements;
  }

  resetAllChecked() {
    this.districtRejectionTableData.forEach(element => {
      if(element.isChecked){
        element.isChecked = false;
      }
      element.Message = "";
  });
  }


}
