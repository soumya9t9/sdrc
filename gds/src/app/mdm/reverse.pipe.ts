import { Pipe, PipeTransform } from '@angular/core';
import { isArray } from 'util';

@Pipe({
  name: 'reverse'
})
export class ReversePipe implements PipeTransform {

  transform(input: any): any {

    if (input) {
      let obj = [];
      let reverseObj = input;
      for (let index = 0; index < reverseObj.length; index++) {
        const element = reverseObj[index];
        obj.push({
          sl_No: index + 1,
          id: reverseObj[index].id,
          roleName: reverseObj[index].name,
          code: reverseObj[index].code,
          isEnabled: reverseObj[index].status,
          permissionsValue: reverseObj[index].authorityList,
          permissions: this.getAllPermissions(reverseObj[index].authorityList) ,
          isApprove: reverseObj[index].isApprove,
          updatedOn: reverseObj[index].updatedOn,
        })
      }
      return obj;
    }
    return [];
  }

  /** 
   * 
    */
  getAllPermissions(permissions) {
    if(!isArray(permissions)) {
      return "";
    }
    return permissions.reduce((result, eachPermission) => {
      return result + eachPermission.description + ", ";
    },"");
  }
}
