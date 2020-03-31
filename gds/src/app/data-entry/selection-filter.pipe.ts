import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'selectionFilter'
})
export class SelectionFilterPipe implements PipeTransform {

  transform(arr: any[], selectedGoal: string, selectedTarget: string, selectedFrequency: string): any {
    return arr.filter(d => 
        (selectedGoal =='All' || (selectedGoal && d.Goal == selectedGoal))
        && (selectedTarget == 'All' || (selectedTarget && d.Target == selectedTarget))
        && (selectedFrequency == 'All' || (selectedFrequency && d.Frequency == selectedFrequency))
      );
  }

}
