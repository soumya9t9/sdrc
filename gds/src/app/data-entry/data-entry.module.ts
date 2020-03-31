import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatSelectModule, MatInputModule, MatTooltipModule, MatSlideToggleModule, MatCardModule, MatDialogModule } from '@angular/material';
import { NgxPaginationModule } from 'ngx-pagination';
import { DataEntryRoutingModule } from './data-entry-routing.module';

import { DataEntryViewComponent } from './data-entry-view/data-entry-view.component';

/* SERVICES */
import { DashboardService } from '@dashboard/dashboard.service';
import { MdmService } from '@mdm/mdm.service';
import { DataEntryWebComponent } from './data-entry-web/data-entry-web.component';
import { SelectionFilterPipe } from './selection-filter.pipe';
import { TableModule } from 'entry-table/public_api';
import { ModalMessageComponent } from './modal-message/modal-message.component';
import { TargetFilterOptionsPipe } from './target-filter-options.pipe';

@NgModule({
  entryComponents: [ModalMessageComponent],
  declarations: [DataEntryViewComponent, DataEntryWebComponent, SelectionFilterPipe, ModalMessageComponent, TargetFilterOptionsPipe],
  providers: [DashboardService, MdmService],
  imports: [
    DataEntryRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatTooltipModule,
    NgxPaginationModule,
    MatSlideToggleModule,
    MatCardModule,
    TableModule,
    MatDialogModule
  ]
})
export class DataEntryModule { }
