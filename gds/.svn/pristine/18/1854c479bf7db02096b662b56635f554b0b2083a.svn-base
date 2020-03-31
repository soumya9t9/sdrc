/* MODULES */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdmRoutingModule } from './mdm-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatSelectModule, MatInputModule, MatTooltipModule, MatSlideToggleModule, MatCardModule, MatDatepickerModule, MAT_DATE_LOCALE, MatNativeDateModule, MatIconModule, MatButtonModule, MatChipsModule } from '@angular/material';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';

/* COMPONENTS */
import { ManageRole } from './manage-role/manage-role.component';
import { LinksSideMenuComponent } from './links-side-menu/links-side-menu.component';
import { SearchPipePipe } from './search-pipe.pipe';
import { ReversePipe } from './reverse.pipe';

/* SERVICES */
import { DashboardService } from '../dashboard/dashboard.service';
import { MdmService } from '@mdm/mdm.service';

var COMPONENTS = [
  ManageRole,
  LinksSideMenuComponent,
];

var PIPES = [SearchPipePipe, ReversePipe]
var IMPORTS = [
  CommonModule,
  MdmRoutingModule,
  FormsModule,
  ReactiveFormsModule,
  MatFormFieldModule,
  MatSelectModule,
  MatInputModule,
  MatTooltipModule,
  NgxPaginationModule,
  MatSlideToggleModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatCardModule,
  NgxPaginationModule,
  Ng2SearchPipeModule,
  PDFExportModule,
  MatIconModule,
  MatTooltipModule,
  MatSelectModule,
  MatButtonModule,
  MatCardModule,
  MatChipsModule, 
  MatSlideToggleModule,
]
@NgModule({
  declarations: [...COMPONENTS, ...PIPES],
  imports: IMPORTS,
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'en-US'},
    DashboardService, MdmService],
  exports: COMPONENTS
})
export class MdmModule { }
