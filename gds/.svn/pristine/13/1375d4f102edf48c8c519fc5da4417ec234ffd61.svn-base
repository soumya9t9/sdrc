import { Pipe, PipeTransform } from '@angular/core';
import { isArray } from 'util';

@Pipe({
  name: 'areaFilter'
})
export class AreaFilterPipe implements PipeTransform {

  transform(allArea: any[], selectedAreas: any[]): any[] {
    if (!allArea) return [];
    if (isArray(selectedAreas) && (selectedAreas.includes("ALL") || selectedAreas.length == 0)) return allArea;
    return allArea.filter(eachArea => {
      if (eachArea.extraData && eachArea.extraData.areaId) return selectedAreas.includes(eachArea.extraData.areaId);
      else return false;
    });
  }
}

