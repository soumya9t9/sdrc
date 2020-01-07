import { Injectable } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService extends Validators {

  constructor() {
    super();
  }

  static verifyMobile(control: FormControl): any {
    var mobileNumber = control.value;
    var mobRegEx = RegExp(`[1-9]{1}[0-9]{9}`);
    let isValid = mobRegEx.test(mobileNumber) && mobileNumber.toString().length == 10;
    return isValid ? null : { "mobile": true };
  }

  static verifyEmail(control: FormControl): any {
    var mobileNumber = control.value;
    var mobRegEx = RegExp(`[a-zA-z1-9]{1,}[@][a-zA-z1-9]{1,}[\.][a-zA-z1-9]{2,4}`)
    let isValid = mobRegEx.test(mobileNumber);
    return isValid ? null : { "email": true };
  }

  static verifyPastDates(control: FormControl): any {
    var userDate = control.value;
    if (!userDate) {
      return { "past-date": true }
    }
    var currentDate = new Date();
    userDate = new Date(userDate);
    let isValid = currentDate.getTime() > userDate.getTime();
    return isValid ? null : { "past-date": true };
  }

  static verifyNotEmptySpace(control: FormControl): any {
    var inputValue = control.value;
    if (!inputValue) {
      return { "empty": true }
    }
    let isValid = inputValue.toString().trim().length > 0;
    return isValid ? null : { "empty": true };
  }

}
