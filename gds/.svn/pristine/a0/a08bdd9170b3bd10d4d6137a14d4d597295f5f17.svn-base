import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'goalIconName'
})
export class GoalIconNamePipe implements PipeTransform {

  transform(goal: any): any {
    let goalIndex = goal.national_sdmx_code.split("_")[1]
    return 'assets/goals/Goal_' + goalIndex.toString() + (goal.trend == "improved"? '_Up.svg': goal.trend == "dropped"? '_Down.svg': goal.trend == "noChange"? '_Same.svg':'_No data.svg');
  }

}
