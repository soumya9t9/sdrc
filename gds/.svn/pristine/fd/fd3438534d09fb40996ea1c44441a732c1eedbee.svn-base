import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CmsViewComponent } from './cms-view/cms-view.component';
import { MdmFrequencyComponent } from './mdm-frequency/mdm-frequency.component';
import { MdmUserComponent } from './mdm-user/mdm-user.component'
import { MdmRoleComponent } from './mdm-role/mdm-role.component';
import { MdmIndicatorComponent } from './mdm-indicator/mdm-indicator.component';
import { MdmUnitComponent } from './mdm-unit/mdm-unit.component';
import { MdmSourceComponent } from './mdm-source/mdm-source.component';
import { MdmSchemeComponent } from './mdm-scheme/mdm-scheme.component';
import { MdmTargetComponent } from './mdm-target/mdm-target.component';
import { MdmDepartmentComponent } from './mdm-department/mdm-department.component';
import { MdmDistrictComponent } from './mdm-district/mdm-district.component';
import { MdmTargetValueComponent } from './mdm-target-value/mdm-target-value.component';

const routes: Routes = [
  // { path: ':mdmType', component: MdmUserComponent, pathMatch: 'full' },

  { path: '', component: MdmTargetValueComponent, pathMatch: 'full' },
  { path: 'user', component: MdmUserComponent, pathMatch: 'full' },
  { path: 'frequency', component: MdmFrequencyComponent, pathMatch: 'full' },
  { path: 'role', component: MdmRoleComponent, pathMatch: 'full' },
  { path: 'indicator', component: MdmIndicatorComponent, pathMatch: 'full' },
  { path: 'unit', component: MdmUnitComponent, pathMatch: 'full' },
  { path: 'source', component: MdmSourceComponent, pathMatch: 'full' },
  { path: 'scheme', component: MdmSchemeComponent, pathMatch: 'full' },
  { path: 'sdg-target', component: MdmTargetComponent, pathMatch: 'full' },
  { path: 'department', component: MdmDepartmentComponent, pathMatch: 'full' },
  { path: 'district', component: MdmDistrictComponent, pathMatch: 'full' },
  { path: 'target-value', component: MdmTargetValueComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CmsRoutingModule { }
