import { Component, OnInit } from '@angular/core';
import { FormGroup, NgForm, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { AppService } from '@app/app.service';
import { Cookie } from 'ng2-cookies';
import { Constants } from '../constants';
import { CustomValidatorsService } from '../service/custom-validators.service';
declare var $: any;

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup;
  formFields: any;
  sdrcForm: FormGroup;

  validationMsg: any;
  btnDisable: boolean = false;
  UserForm: FormGroup;

  userName: string;
  password: string;
  newPassword: string;
  confirmPassword: string;
  passwordRegx = Constants.regularExp.passwordRegx;
  usernameRegx = Constants.regularExp.usernameRegx;
  ERROR_MESSAGE: IMessages = Constants.message;

  constructor(private http: HttpClient, private router: Router, private appService: AppService) { }

  ngOnInit() {
    this.userName = this.appService.getUsername();
    if (localStorage.getItem('user_details')) {
      var token = JSON.parse(localStorage.getItem('user_details'));
      !this.userName ? this.userName = token.user_name : '';
    }

    if ((window.innerWidth) <= 767) {
      $(".left-list").attr("style", "display: none !important");
      $('.mob-left-list').attr("style", "display: block !important");
    }
  }
  /**
   * Change password for individual user
   * @param form 
   */
  changePasswordForm(form: NgForm) {
    let passDetails = {
      'userName': this.userName,
      'oldPassword': this.password,
      'newPassword': this.newPassword,
      'confirmPassword': this.confirmPassword
    };
    if (this.password != this.newPassword && this.newPassword == this.confirmPassword) {
      this.http.post(Constants.HOME_URL + 'changePassword', passDetails).subscribe((data) => {
        this.validationMsg = data;
        // $("#successMatch").modal('show');
        form.resetForm();
      }, err => {
        // $("#passNotMatch").modal('show');
        if (err.status == 409)
          this.validationMsg = err.error.message;
        else
          this.validationMsg = err.error.message;
      });
    }
  }
  successModal() {
    $("#successMatch").modal('hide');
    $("#passNotMatch").modal('hide');
    this.appService.logout();
    // this.router.navigateByUrl('/login');   
  }
  showLists() {
    $(".left-list").attr("style", "display: block !important");
    $('.mob-left-list').attr("style", "display: none !important");
  }
  validatePassword(f: NgForm, password) {
    let passwordControl = f.form.get(password) as FormControl;
    if (CustomValidatorsService.password(passwordControl)) {
      passwordControl.setErrors({ 'pattern': true })
    };
  }

  ngAfterViewInit() {
    $("input, textarea, .select-dropdown").focus(function () {
      $(this).closest(".input-holder").parent().find("> label").css({ "color": "#4285F4" })
    })
    $("input, textarea, .select-dropdown").blur(function () {
      $(this).closest(".input-holder").parent().find("> label").css({ "color": "#333" })
    })
    $('body,html').click(function (e) {
      if ((window.innerWidth) <= 767) {
        if (e.target.className == "mob-left-list") {
          return;
        } else {
          $(".left-list").attr("style", "display: none !important");
          $('.mob-left-list').attr("style", "display: block !important");
        }
      }
    });
  }
}
