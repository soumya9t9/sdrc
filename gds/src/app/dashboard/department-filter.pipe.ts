import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'departmentFilter'
})
export class DepartmentFilterPipe implements PipeTransform {

  transform(arr: any[], selectedDepartment: any): any {
    if(selectedDepartment)
    return arr.filter(d => d.reportSource == selectedDepartment);
    else
    return arr;
  }

}
