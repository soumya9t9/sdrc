import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { CmsRoutingModule } from './cms-routing.module';
import { CmsViewComponent } from './cms-view/cms-view.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule, MatFormFieldModule, MatSelectModule, MatChipsModule, MatIconModule, MatTooltipModule, MAT_DATE_LOCALE, MatDialogModule, MatListModule, MatRadioModule, MatNativeDateModule, MatDatepickerModule, MatCheckboxModule, MatCardModule } from '@angular/material';
import { ConfirmationDailogComponent } from './dailog/confirmation-dailog/confirmation-dailog.component';
import { InformationDailogComponent } from './dailog/information-dailog/information-dailog.component';
import { OptionFilterPipe } from './option-filter.pipe';
import { SearchPipePipe } from './search-pipe.pipe';
import { SafePipe } from './safe.pipe';
import { CmsSideMenuComponent } from './cms-side-menu/cms-side-menu.component';
import { TableModule } from 'lib-table/public_api';
import { MdmValidatorsService } from './services/mdm-validators.service';
import { TargetIndicatorComponent } from './target-indicator/target-indicator.component';
import { DisableOptionsPipe } from './services/disable-options.pipe';
import { MdmDistrictComponent } from './mdm-district/mdm-district.component';
import { MdmDepartmentComponent } from './mdm-department/mdm-department.component';
import { MdmTargetComponent } from './mdm-target/mdm-target.component';
import { MdmSchemeComponent } from './mdm-scheme/mdm-scheme.component';
import { MdmSourceComponent } from './mdm-source/mdm-source.component';
import { MdmFrequencyComponent } from './mdm-frequency/mdm-frequency.component';
import { MdmUnitComponent } from './mdm-unit/mdm-unit.component';
import { MdmIndicatorComponent } from './mdm-indicator/mdm-indicator.component';
import { MdmRoleComponent } from './mdm-role/mdm-role.component';
import { MdmUserComponent } from './mdm-user/mdm-user.component';
import { MdmTargetValueComponent } from './mdm-target-value/mdm-target-value.component';
import { ExcelOperationComponent } from './excel-operation/excel-operation.component';
import { OnlyNumberDirective } from './only-number.directive';
import { AreaFilterPipe } from './area-filter.pipe';

@NgModule({
  entryComponents: [InformationDailogComponent, ConfirmationDailogComponent],
  declarations: [
    /* COMPONENTS */
    ConfirmationDailogComponent,
    InformationDailogComponent,
    CmsSideMenuComponent,
    TargetIndicatorComponent,
    ExcelOperationComponent,
    CmsViewComponent,
    MdmDistrictComponent,
    MdmDepartmentComponent,
    MdmTargetComponent,
    MdmSchemeComponent,
    MdmSourceComponent,
    MdmFrequencyComponent,
    MdmUnitComponent,
    MdmIndicatorComponent,
    MdmRoleComponent,
    MdmUserComponent,
    MdmTargetValueComponent,
    /* PIPES */
    DisableOptionsPipe,
    OptionFilterPipe,
    SearchPipePipe,
    SafePipe,
    AreaFilterPipe,
    
    /*Directives  */
    OnlyNumberDirective
  ],
  imports: [
    CommonModule,
    CmsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatCheckboxModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatListModule,
    MatCardModule,
    MatTooltipModule,
    TableModule,
    // EditorModule,
    // ToastrModule
  ], providers: [
    DatePipe,
    MdmValidatorsService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CmsModule { }
