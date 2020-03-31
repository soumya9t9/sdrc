import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeIndex'
})
export class RemoveIndexPipe implements PipeTransform {

  transform(goals: any, args?: any): any {
    return goals.filter(g => g.goalId != "GOAL_0");
  }

}
