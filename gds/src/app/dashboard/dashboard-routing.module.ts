import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuardGuard } from '../guard/role-guard.guard';
import { ThematicMapComponent } from './thematic-map/thematic-map.component';
import { DashboardViewComponent } from './dashboard-view/dashboard-view.component';

const routes: Routes = [
 
  {
    path: 'dashboard-view', 
    pathMatch: 'full', 
    component: DashboardViewComponent
    //  canActivate: [RoleGuardGuard],
    //     data: { 
    //       expectedRoles: ["DASHBOARD_VIEW"]
    //     }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
