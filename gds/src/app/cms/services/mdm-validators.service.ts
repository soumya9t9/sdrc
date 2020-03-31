import { Injectable } from '@angular/core';
import { Validators, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class MdmValidatorsService extends Validators {

  constructor() {
    super();
  }

  public static schemeValidate(fg: FormGroup): any {
    let value = fg.value || {};
    let isASubScheme = value.subScheme;
    let parentSchemeIdFC = fg.get('parentSchemeId')
    if (isASubScheme && parentSchemeIdFC) {
      parentSchemeIdFC.enable();
      parentSchemeIdFC.setValidators(Validators.required);
    } else if (parentSchemeIdFC) {
      parentSchemeIdFC.reset();
      parentSchemeIdFC.clearValidators();
      parentSchemeIdFC.disable()
    }
  }

  public static frequencyValidate(fg: FormGroup): any {
    let value = fg.value || {};
    let dataRejectionDays = value.dataRejectionDays;
    let dataCollectionDays = value.dataCollectionDays;
    let sum = parseInt(dataCollectionDays) + parseInt(dataRejectionDays);
    let error = null;
    if (!(sum && !isNaN(sum) && sum < 28)) {
      error = { sum: true };
      fg.setErrors(error);
      return error;
    }
    return null;
  }

  public static userValidate(fg: FormGroup): any {
    let value = fg.value || {};
    let password = value.password;
    let confirmPassword = value.confirmPassword;
    let confirmPasswordFC = fg.get("confirmPassword");
    let error = (password != confirmPassword);
    // value.id === 1 ? fg.get("departmentId").disable() : fg.get("departmentId").enable();
    if (confirmPasswordFC) {
      error && !confirmPasswordFC.hasError("password") ? confirmPasswordFC.setErrors({ passwordMatch: true }) : confirmPasswordFC.clearValidators();;
    }
    return error && confirmPasswordFC && !confirmPasswordFC.hasError("password") ? { passwordMatch: true } : null;
  }

  public static resetPasswordValidate(fg: FormGroup): any {
    let value = fg.value || {};
    let password = value.newPassword;
    let confirmPassword = value.confirmPassword;
    let confirmPasswordFC = fg.get("confirmPassword");
    let error = (password != confirmPassword);
    if (confirmPasswordFC) {
      error && !confirmPasswordFC.hasError("password") ? confirmPasswordFC.setErrors({ passwordMatch: true }) : confirmPasswordFC.setErrors(null);
    }
    return error && confirmPasswordFC && !confirmPasswordFC.hasError("newPassword") ? { passwordMatch: true } : null;
  }
}
