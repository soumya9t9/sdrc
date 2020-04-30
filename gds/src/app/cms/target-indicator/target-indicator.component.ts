import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { isArray } from 'util';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MdmService } from '@mdm/mdm.service';
import { Constants } from 'src/app/constants';
import { CustomValidatorsService } from 'src/app/service/custom-validators.service';
import { FormService } from 'src/app/service/form.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-target-indicator',
  templateUrl: './target-indicator.component.html',
  styleUrls: ['./target-indicator.component.scss', '../../dashboard/dashboard-view/dashboard-view.component.scss']
})
export class TargetIndicatorComponent implements OnInit, OnChanges {

  @Input() indicatorsFG: FormGroup;
  @Input() indicatorsFormConfig: any[];
  @Input() indicatorWiseTargetValue;
  @Output() valueChanged: EventEmitter<any> = new EventEmitter<any>();
  timeOut;
  areaDropdown = {
    selectedValue: ['ALL'],
    list: [],
    defaultValue: {
      areaId: 'ALL',
      areaName: "Select/UnSelect All"
    }
  }

  constructor() { }

  ngOnInit() {
    // this.areaDropdown.selectedValue = [this.areaDropdown.defaultValue.areaId]
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.indicatorWiseTargetValue) {
      let list = !isArray(this.indicatorWiseTargetValue.areaWiseYearTargets) ? [] : this.indicatorWiseTargetValue.areaWiseYearTargets.map(eachArea => { return { areaId: eachArea.areaId, areaName: eachArea.areaName } });
      this.areaDropdown.list = list.length> 1 ? [this.areaDropdown.defaultValue, ...list]: [...list];
      this.areaDropdown.selectedValue = this.areaDropdown.list.map(e => e.areaId);
    }
  }

  projectValue(indicatorIndex, areaIndex, yearIndex, eachYearItem) {
    this.timeOut ? clearTimeout(this.timeOut) : '';
    this.timeOut = setTimeout(() => {
      let data = this.indicatorsFG.value[indicatorIndex];
      let performanceType = data["performanceType"] === "Positive" ? 1 : -1;
      data['areaWiseYearTargets'].some((eachArea, eachAreaIndex) => {
        if (eachAreaIndex === areaIndex) {
          let lastYearIndexWithValidValue = 0;
          let lastValidValue;
          eachArea["yearWiseTargets"].some((eachYear, eachYearIndex) => {

            if (eachYear.target !== null && eachYear.target !== "" && eachYear.target !== false && !isNaN(eachYear.target) && lastValidValue != null) {
              lastValidValue = eachArea["yearWiseTargets"][lastYearIndexWithValidValue].target;
              let missedYearCount = eachYearIndex - lastYearIndexWithValidValue;
              let valueToBeAdded = (eachYear.target - lastValidValue) / (missedYearCount) || 0;
              if (missedYearCount > 1) {
                for (let i = 1; i < missedYearCount; i++) {
                  let projectedValue = this.precisionRound(lastValidValue + (i * valueToBeAdded) || 0, 2);
                  let areaWiseFG = ((this.indicatorsFG.controls[indicatorIndex + ''] as FormGroup).controls['areaWiseYearTargets'] as FormArray).controls[areaIndex + ''] as FormGroup;
                  let yearWiseFG = areaWiseFG.controls['yearWiseTargets'] as FormArray;
                  yearWiseFG.controls[i + lastYearIndexWithValidValue + ''].get('target').setValue(projectedValue);
                  eachArea["yearWiseTargets"][i + lastYearIndexWithValidValue].target = projectedValue;
                }
              }
            }
            if (eachYear.target) {
              lastYearIndexWithValidValue = eachYearIndex;
              lastValidValue = eachYear.target;
            }
            return false;
          });
        }
      });
      clearTimeout(this.timeOut);
    }, 300)
  }

  precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }

  areaChanged(selectedValue) {
    let value = [JSON.parse(JSON.stringify(this.indicatorWiseTargetValue))];
    // if (!this.areaDropdown.selectedValue.length) this.areaDropdown.selectedValue = ['ALL'];
    if (selectedValue == "ALL") {
      this.areaDropdown.selectedValue = !this.areaDropdown.selectedValue.includes("ALL") ? [] : this.areaDropdown.selectedValue = this.areaDropdown.list.map(e => e.areaId);
      if(!this.areaDropdown.selectedValue.length) {
        return null;
      }
    } else {
      this.areaDropdown.selectedValue.includes("ALL") ? this.areaDropdown.selectedValue.splice(this.areaDropdown.selectedValue.findIndex(e => e == "ALL"), 1) : '';
       /* if all the options are selected then auto select ALL option */
       this.areaDropdown.selectedValue = (this.areaDropdown.selectedValue.length == this.areaDropdown.list.length -1) ?  this.areaDropdown.list.map(e => e.areaId) : [...this.areaDropdown.selectedValue];
    }

    /* create form for the selected area */
    let allAreas = [...value[0].areaWiseYearTargets];
    allAreas.forEach((eachArea, areaIndex) => {
      let itemIndexInValueObj = value[0].areaWiseYearTargets.findIndex(item => item.areaId == eachArea.areaId);
      if (this.areaDropdown.selectedValue.includes(eachArea.areaId)) {
        let areaWithUserEnteredValue = this.indicatorsFG.value[0].areaWiseYearTargets.find(item => item.areaId == eachArea.areaId)
        value[0].areaWiseYearTargets.splice(itemIndexInValueObj, 1, areaWithUserEnteredValue ? areaWithUserEnteredValue : eachArea);
      } else {
        value[0].areaWiseYearTargets.splice(itemIndexInValueObj, 1);
      }
    });
    this.valueChanged.emit({ value: value })
    console.log(value);
    console.log(this.indicatorsFG.value);
  }

}