import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageRole } from './manage-role/manage-role.component';

const routes: Routes = [

  {
    path: 'manage-role',
    pathMatch: 'full',
    component: ManageRole,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MdmRoutingModule { }
