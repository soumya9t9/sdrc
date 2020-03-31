import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RejectionComponent } from './rejection/rejection.component';
import { RoleGuardGuard } from '../guard/role-guard.guard';

const routes: Routes = [
  {
    path: '',
    component: RejectionComponent,
    canActivate: [RoleGuardGuard],
    data: {
      expectedRoles: ["REJECT_DATA"]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubmissionRejectionRoutingModule { }
