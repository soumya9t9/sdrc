import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Exception404Component } from './exception404/exception404.component';
import { LoginComponent } from './login/login.component';
import { LoggedinGuard } from './guard/loggedin.guard';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { AboutSdgComponent } from './about-sdg/about-sdg.component';
import { ForgotpassComponent } from './forgotpass/forgotpass.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AuthGuard, AccessGuard, isDeptDistDisabled } from './guard/auth.guard';
// import { ChangePasswordComponent } from './change-password/change-password.component';
const routes: Routes = [

  {
    path: '',
    loadChildren: './home/home.module#HomeModule',
  },
  {
    path: 'resources',
    loadChildren: './resource/resource.module#ResourceModule',
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoggedinGuard],
    pathMatch: 'full'
  },
  {
    path: 'error',
    component: Exception404Component,
    pathMatch: 'full'
  },
  {
    path: 'exception',
    component: Exception404Component,
    pathMatch: 'full'
  }
  ,
  {
    path: 'dashboard',
    canActivate:[AccessGuard],
    loadChildren: './dashboard/dashboard.module#DashboardModule',
  },
  {
    path: 'data-entry',
    canActivate: [isDeptDistDisabled],
    loadChildren: './data-entry/data-entry.module#DataEntryModule',
  },
  {
    path: 'mdm-backup',
    loadChildren: './mdm/mdm.module#MdmModule',
  },
  {
    path: 'mdm',
    loadChildren: './cms/cms.module#CmsModule',
  },
  {
    path: 'submission-rejection',
    canActivate: [isDeptDistDisabled],
    loadChildren: './submission-rejection/submission-rejection.module#SubmissionRejectionModule',
  },
  {
    path: 'about-sdg',
    component: AboutSdgComponent,
    pathMatch: 'full'
  },
  {
    path: 'contact-us',
    component: ContactUsComponent,
    pathMatch: 'full'
  },
  {
    path: 'login/forgotpass',
    component: ForgotpassComponent,
    pathMatch: 'full'
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
