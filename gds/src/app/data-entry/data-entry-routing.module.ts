import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataEntryViewComponent } from './data-entry-view/data-entry-view.component';
import { RoleGuardGuard } from '../guard/role-guard.guard';
import { DataEntryWebComponent } from './data-entry-web/data-entry-web.component';

const routes: Routes = [
  {
    path: 'data-entry-view',
    pathMatch: 'full',
    component: DataEntryViewComponent,
    canActivate: [RoleGuardGuard],
    data: {
      expectedRoles: ["COLLECT_DATA"]
    }
  },
  {
    path: 'data-entry-web',
    pathMatch: 'full',
    component: DataEntryWebComponent,
    canActivate: [RoleGuardGuard],
    data: {
      expectedRoles: ["COLLECT_DATA"]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataEntryRoutingModule { }
