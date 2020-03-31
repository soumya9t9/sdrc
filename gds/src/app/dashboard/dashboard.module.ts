import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ThematicMapComponent } from './thematic-map/thematic-map.component';
import { DashboardService } from './dashboard.service';
import { MatFormFieldModule, MatSelectModule, MAT_SELECT_SCROLL_STRATEGY, MatTabsModule, MatIconModule, MatTooltipModule, MatTableModule, MatSortModule, MatInputModule, MatCardModule, MatSlideToggleModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SingleBarChartComponent } from './single-bar-chart/bar-chart.component';
import { Overlay, BlockScrollStrategy } from '@angular/cdk/overlay';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SearchValuePipe } from './pipes/search-value.pipe';
import { DashboardLineChartComponent } from './line-chart/dashboard-line-chart.component';
import { DashboardViewComponent } from './dashboard-view/dashboard-view.component'
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { DepartmentFilterPipe } from './department-filter.pipe';

@NgModule({
  declarations: [ ThematicMapComponent, BarChartComponent,SingleBarChartComponent, SearchValuePipe, DashboardLineChartComponent, DashboardViewComponent, DepartmentFilterPipe],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatTabsModule,
    NgxMatSelectSearchModule,
    MatIconModule,
    MatTooltipModule,MatTableModule,MatSortModule,MatCardModule, MatSlideToggleModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [DashboardService, { provide: MAT_SELECT_SCROLL_STRATEGY, useFactory: scrollFactory, deps: [Overlay] }]
})
export class DashboardModule { }
export function scrollFactory(overlay: Overlay): () => BlockScrollStrategy {
  return () => overlay.scrollStrategies.block();
}