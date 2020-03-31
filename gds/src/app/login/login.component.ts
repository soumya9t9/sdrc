import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../constants';
import { ToastsManager } from 'ng6-toastr';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidatorsService } from '../service/custom-validators.service';
import { FormService } from '../service/form.service';
declare var $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  credentials: FormGroup;
  otpSendError: boolean = false;
  forgotpassEmailId: string;
  forgotpassOTP: string;
  otpSentMessage: any;
  updateMessage: any;
  otpSent: boolean = false;;
  otpVerified: boolean = false;
  newpassword: string;
  passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*_ ])[a-zA-Z0-9!@#$%^&*_ ]/;
  usernameRegex = /^[_ A-Za-z0-9]+(?:[A-Za-z0-9]+)*$/;


  constructor(
    public app: AppService,
    private router: Router,
    private http: HttpClient,
    public toastr: ToastsManager,
    public formService: FormService,
    public formBuilder: FormBuilder) {

  }

  ngOnInit() {
    let config = {
      username: ['', [Validators.required, CustomValidatorsService.isEmpty]],
      password: ['', [Validators.required]]
    }
    this.credentials = this.formBuilder.group(config);
  }

  login(event) {
    event.stopPropagation();
    event.preventDefault();
    this.formService.validateForm(this.credentials);
    this.app.validationMsg = "";
    if (!this.credentials.valid) {
      if (!this.credentials.get('username').valid) {
        this.app.validationMsg = "Please Enter Valid User Name";
      }
      return null;
    }
    let formValue = this.credentials.value;
    this.app.authenticate(formValue, () => {
      if (this.app.authenticated === true) {
        if (this.app.getUserDetails()) {
          const userDetails = this.app.getUserDetails();
          if (userDetails.designations[0] === 'ADMIN') {
            this.router.navigateByUrl('/dashboard/dashboard-view');
          }
          else {
            this.router.navigateByUrl('/data-entry/data-entry-view');
          }
        }
      }
      else {
        this.app.validationMsg = "The Username/Password you have entered is incorrect."
      }
    });
    return false;
  }


  clearInput() {
    this.forgotpassEmailId = '';
    this.forgotpassOTP = '';
    this.otpSent = false;
    this.otpSentMessage = '';
  }

  sendOTP(emailId) {
    this.otpSent = false;
    this.http.get(Constants.HOME_URL + "bypass/sendOtp?userName=" + emailId + "&valueType=uName").subscribe(res => {
      this.otpSent = true;
      this.otpSentMessage = res;
    }, err => {
      this.otpSentMessage = err.error;
    })
  }

  isValidOtp() {
    if (this.forgotpassOTP && this.forgotpassOTP.length == 6) {
      this.http.get(Constants.HOME_URL + "bypass/validateOtp?userName=" + this.forgotpassEmailId + "&valueType=uName" + "&otp=" + this.forgotpassOTP).subscribe(res => {
        this.otpSent = true;
        this.otpSentMessage = res;
      }, err => {
        this.otpSentMessage = err.error;
      })
    }
  }

  setPass() {
    let data = {
      emailId: this.forgotpassEmailId,
      otp: this.forgotpassOTP,
      newPassword: this.newpassword,
      confirmPassword: this.newpassword,
      valueType: 'uName'
    }
    this.http.post(Constants.HOME_URL + "bypass/forgotPassword", data).subscribe(res => {
      this.updateMessage = res;
    }, err => {
      this.updateMessage = err.error;
    })
  }
}
