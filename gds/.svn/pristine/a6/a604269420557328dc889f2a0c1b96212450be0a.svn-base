import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubmissionRejectionRoutingModule } from './submission-rejection-routing.module';
import { RejectionDistrictViewComponent } from './rejection-district-view/rejection-district-view.component';
import { RejectionIndicatorViewComponent } from './rejection-indicator-view/rejection-indicator-view.component';
import { RejectionComponent } from './rejection/rejection.component';
import { MatTabsModule, MatSelectModule, MatDialogModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'rejection-table/public_api';
import { ConformationDialogComponent } from './dialog/conformation-dialog/conformation-dialog.component';
import { ModalMessageComponent } from './modal-message/modal-message.component';


@NgModule({
  entryComponents: [ConformationDialogComponent, ModalMessageComponent],
  declarations: [RejectionDistrictViewComponent, RejectionIndicatorViewComponent, RejectionComponent, ConformationDialogComponent, ModalMessageComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SubmissionRejectionRoutingModule,
    MatTabsModule,
    MatSelectModule,
    TableModule,
    MatDialogModule
  ]
})
export class SubmissionRejectionModule { }
