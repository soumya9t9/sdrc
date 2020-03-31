import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipeGoalOrder'
})
export class PipeGoalOrderPipe implements PipeTransform {

  transform(goals: any[]): any {
    // let goals = layoutGoals.filter(g => g.national_sdmx_code != "GOAL_0");
    let sortedData = goals.sort(function (a, b) {
      let goalNoA = a.national_sdmx_code.split("_")[1];
      let goalNoB = b.national_sdmx_code.split("_")[1];
          if (parseInt(goalNoA) < parseInt(goalNoB)) {
              return -1 
          }
          else if (parseInt(goalNoA) > parseInt(goalNoB)) {
              return 1;
          }
          else {
              return 0;
          }
    });
    return sortedData;
  }

}
