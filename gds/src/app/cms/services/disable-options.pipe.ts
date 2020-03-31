import { Pipe, PipeTransform } from '@angular/core';
import { isArray } from 'util';

@Pipe({
  name: 'disableOptions'
})
export class DisableOptionsPipe implements PipeTransform {

  statusItems = {
    "active": { positive: true, negative: false },
    "isActive": { positive: true, negative: false },
    "live": { positive: true, negative: false },
    "enabled": { positive: true, negative: false },
    "status": { positive: "Active", negative: "Inactive" },
    "indStatus": { positive: true, negative: false },
  }
  transform(options: any, args?: any): any {
    if (isArray(options)) {
      options.forEach(eachItem => {
        if (eachItem && typeof eachItem === "object") {
          Object.keys(this.statusItems).some(eachStatusKey => {
            if (eachItem.hasOwnProperty(eachStatusKey)) {
              eachItem["disableOption"] = eachItem[eachStatusKey] != this.statusItems[eachStatusKey].positive;
              return true;
            }
          });

          !eachItem.hasOwnProperty("disableOption") ? eachItem["disableOption"] = false : '';
        }
      })
    }
    return options;
  }

}
