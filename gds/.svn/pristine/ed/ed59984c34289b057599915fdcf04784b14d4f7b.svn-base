import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { HomeService } from '../home.service';
import { $ } from 'protractor';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Constants } from 'src/app/constants';


@Component({
  selector: 'app-svg-wheel',
  templateUrl: './svg-wheel.component.html',
  styleUrls: ['./svg-wheel.component.scss'],
  animations: [Constants.fadeAnimation]
})
export class SvgWheelComponent implements OnInit {

  goalData: any;
  homeService: HomeService;
  selectedGoalCode: string;
  @Input() selectedWheelGoal: any;
  @Output() allGoalData: EventEmitter<any> = new EventEmitter<any>();
  constructor(private homeProvider: HomeService) {
    this.homeService = homeProvider;
   }


  ngOnInit() {
  }

  ngOnChanges() {
    if(this.selectedWheelGoal && this.selectedWheelGoal.national_sdmx_code){
      this.selectedGoalCode = this.selectedWheelGoal.national_sdmx_code;
    }

  }

  getDataForGoal(goalCode) {
    let sdmxCode = "GOAL_"+ goalCode
    let data = {
      areaCode: "IND005",
      sectorCode: sdmxCode
    }
    // this.homeService.getGoalDataDistrictWise().subscribe(res => {
    //   this.goalData = res;
    //   this.goalWheelClicked(goalId);
    // })
    this.goalWheelClicked(sdmxCode);
  }

  public goalWheelClicked(sdmxCode) {
    this.allGoalData.emit({
      goalData: this.goalData,
      selectedGoalCode: sdmxCode
    })

    this.selectedGoalCode = sdmxCode;
  }

}
