import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { ValidatorService } from '../../services/validator.service';
import { HttpService, ApiParams } from '../../services/http.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss']
})
export class AddStudentComponent implements OnInit {

  formConfig: any;
  formGroup: FormGroup;
  isFormSubmitAttempted: boolean = false;
  studentId;
  isEditable;

  constructor(private formBuilder: FormBuilder, private httpService: HttpService, 
    private route:ActivatedRoute,
    private router:Router
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.studentId = params.get('id');
      if(this.studentId) {
        this.getUserData();
      }
    });
    this.createForm();
  }

  createForm() {
    this.formConfig = {
      id: ['', ],
      name: ['', Validators.required],
      mobile: ['', Validators.compose([Validators.required, ValidatorService.verifyMobile])],
      email: ['', Validators.compose([Validators.required, ValidatorService.verifyEmail])],
      dob: ['', Validators.compose([Validators.required, ValidatorService.verifyPastDates])],
      rollNumber: ['', Validators.compose([Validators.required, ValidatorService.verifyNotEmptySpace])],
      class: ['', Validators.compose([Validators.required, ValidatorService.verifyNotEmptySpace])],
    }
    this.formGroup = this.formBuilder.group(this.formConfig);
  }

  autoPopulateForm(studentData) {
    // let studentData: any = {};
    let setValueData = {
      id:this.studentId,
      name: studentData.name,
      mobile: parseInt(studentData.mobile),
      email: studentData.email,
      dob: studentData.dob ? new Date(studentData.dob) : null,
      rollNumber: studentData.rollNumber,
      class: studentData.class
    }
    this.formGroup.patchValue(setValueData);
    this.formGroup.updateValueAndValidity();
  }

  submitForm() {
    this.isFormSubmitAttempted = true;
    this.updateValueAndValidity();
    console.log("fg", this.formGroup);
    if (this.formGroup.valid) {
      //TODO: do api call

      if(!this.studentId) {
        let apiParams: ApiParams = {
          url: "add-student",
          method:"post",
          body: this.formGroup.value,
        }
        this.httpService.apiCall(apiParams).subscribe(res => {
          console.log(res);
          if (res.status === "success") {
            this.router.navigate(['students'])
          }
        });
      } else {
        let apiParams: ApiParams = {
          url: "student/edit",
          method:"post",
          body: this.formGroup.value,
        }
        this.httpService.apiCall(apiParams).subscribe(res => {
          console.log(res);
          if(res.status === "success") {
            this.router.navigate(["students"]);
          }
        })
      }
    }
  }

  updateValueAndValidity(){
    Object.keys(this.formGroup.controls).forEach(eachControl => {
      this.formGroup.get(eachControl).updateValueAndValidity();
    });
  }

  getUserData() {
    let apiParams: ApiParams = {
      url: `student/${this.studentId}`,
      method:"post",
      body:{id:this.studentId}
    }
    this.httpService.apiCall(apiParams).subscribe((res) => {
      console.log(res);
      this.autoPopulateForm(res.data[0]);
    });
  }
}
