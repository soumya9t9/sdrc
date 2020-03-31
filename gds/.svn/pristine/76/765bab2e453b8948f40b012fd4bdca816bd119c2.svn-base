import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'targetFilterOptions'
})
export class TargetFilterOptionsPipe implements PipeTransform {

  transform(arr: any, selectedGoal, goalList, allGoals): any {
    let targetArr
    if(arr)
    targetArr = JSON.parse(JSON.stringify(arr))
    let allTargets = ["All"];
    if(selectedGoal == "All") {
      allTargets = []
      for (let i = 0; i < goalList.length; i++) {
        const goal = goalList[i];
        if(goal != "All")
        allTargets = allGoals[goal].concat(allTargets)
        allTargets.sort()
      }
      allTargets.unshift("All")
    } else {
      if(targetArr && targetArr.length) {
        targetArr.unshift("All");
        allTargets = targetArr;
      }
    }
    return allTargets;
  }

}
