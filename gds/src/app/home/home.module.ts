import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { GoalIconNamePipe } from './pipes/goal-icon-name.pipe';
import { SvgWheelComponent } from './svg-wheel/svg-wheel.component';
import { DashboardLineChartComponent } from './line-chart/line-chart.component';
import { DashedBarchartComponent } from './dashed-barchart/dashed-barchart.component';
import { MatFormFieldModule, MatInputModule, MatSelectModule, MatTooltipModule, MatDialogModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipeGoalOrderPipe } from './pipes/pipe-goal-order.pipe';
import { RemoveIndexPipe } from './pipes/remove-index.pipe';
import { ModalMessageComponent } from './modal-message/modal-message.component';

@NgModule({
  entryComponents: [ModalMessageComponent],
  declarations: [HomeComponent, BarChartComponent, GoalIconNamePipe, SvgWheelComponent, DashboardLineChartComponent, DashedBarchartComponent, PipeGoalOrderPipe, RemoveIndexPipe, ModalMessageComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatDialogModule
  ]
})
export class HomeModule { }
