import { Component, OnInit } from '@angular/core';
import { DataentryService } from '../dataentry.service';
import { ModalMessageComponent } from '../modal-message/modal-message.component';
import { MatDialog } from '@angular/material';
import { Constants } from '@src/app/constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-data-entry-web',
  templateUrl: './data-entry-web.component.html',
  styleUrls: ['./data-entry-web.component.scss']
})
export class DataEntryWebComponent implements OnInit {

  allIndicatorData: any;
  dataEntryService: DataentryService;
  indTableColumns: string[];
  p =1 ;
  availableGoals: any;
  goalList: string[] = ["All"];
  availableFrquecies: string[];
  selectedFrequency: string = "All";
  selectedGoal: string = "All";
  selectedTarget: string = "All";
  excludedColumns: string[] = ['Indicator Id', 'SourceId', 'TimeperiodId', 'Goal', 'Target', 'Frequency', 'Message']
  TOOL_TIP = Constants.toolTip;
  currentView: string


tableColumns = ["name", "age", "action"]
  
  constructor(private daEnPro: DataentryService, private dialog: MatDialog, private router: Router) { 
    this.dataEntryService = daEnPro;
  }

  ngOnInit() {
    this.getAllIndicatorsForWebEntry()
  }

  getAllIndicatorsForWebEntry() {
    this.dataEntryService.getIndicatorsForWebEntry().subscribe(res => {
      this.allIndicatorData = res;
      this.indTableColumns = this.removeExtraKeys(Object.keys(this.allIndicatorData[0]), this.excludedColumns)
      this.availableGoals = this.getAvailableGoals(this.allIndicatorData);
      this.goalList = Object.keys(this.availableGoals);
      this.goalList.unshift("All")
      this.availableFrquecies = this.getAvailableFrquencies(this.allIndicatorData)
      this.availableFrquecies.unshift("All")
      console.log(this.allIndicatorData)
    })
  }

  removeExtraKeys(allKeys:string[], objextraKeys: string[]):string[] {
    objextraKeys.forEach(el => {
      if(allKeys.indexOf(el) != -1)
      allKeys.splice(allKeys.indexOf(el), 1)
    });
    return allKeys
  }

  redirectToExcelView() {
    this.router.navigateByUrl("data-entry/data-entry-view")
  }

  getAvailableGoals(allIndicators) {
    let goals = {};
    allIndicators.forEach(obj => {
      if(goals[obj.Goal])
      goals[obj.Goal].indexOf(obj.Target) == -1 ? goals[obj.Goal].push(obj.Target): ''
      else
      goals[obj.Goal] = [obj.Target]
    });
    return goals;
  }

  getAvailableFrquencies(allIndicators) {
    let frquencies = [];
    allIndicators.forEach(obj => {
      if(frquencies.indexOf(obj.Frequency) == -1)
      frquencies.push(obj.Frequency)
    });
    return frquencies;
  }

  openRemarkModal(event) {
    const dialogRef = this.dialog.open(ModalMessageComponent,
      { width: '400px', disableClose: true, data: { header: 'Remark', msg: event.remark, button: 'Ok' } });
  }

  resetFilters() {
    this.selectedGoal = undefined;
    this.selectedTarget = undefined;
    this.selectedFrequency = undefined;
  }

  saveIndicatorData(event) {
    // for (let i = 0; i < event.indicators.length; i++) {
    //   const element = event.indicators[i];
    //   element["TimeperiodId"] = element["Timeperiod Id"]
    // }
    let data = {
      "data": event.indicators
    }
    this.dataEntryService.saveData(data).subscribe(res => {
      const dialogRef = this.dialog.open(ModalMessageComponent,
        { width: '400px', disableClose: true, data: { header: 'Success', msg: 'Data has been submitted successfully.', button: 'Ok' } });
    }, err => {
      const dialogRef = this.dialog.open(ModalMessageComponent,
        { width: '400px', disableClose: true, data: { header: 'Error', msg: 'Some server issue occured, try after sometime.', button: 'Ok' } });
    })
  }

}
