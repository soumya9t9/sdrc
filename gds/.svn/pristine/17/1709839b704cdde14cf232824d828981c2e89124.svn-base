import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './fragments/header/header.component';
import { FooterComponent } from './fragments/footer/footer.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { XhrInterceptorService } from './service/xhr-interceptor.service';
import { AppService } from './app.service';
import { UserService } from './service/user/user.service';
import { AuthGuard, AccessGuard } from './guard/auth.guard';
import { SessionCheckService } from './service/session-check.service';
import { Exception404Component } from './exception404/exception404.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSidenavModule, MatExpansionModule, MatListModule, MatSnackBarModule, MatToolbarModule, MatDialogModule } from '@angular/material'
import { StaticHomeService } from './service/static-home.service';
import { RoleGuardGuard } from './guard/role-guard.guard';
import { LoggedinGuard } from './guard/loggedin.guard';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SdrcLoaderModule } from 'sdrc-loader';
import { DatePipe } from '@angular/common';
import { ToastModule } from 'ng6-toastr';
import { WorkinProgressComponent } from './workin-progress/workin-progress.component';
import { AboutSdgComponent } from './about-sdg/about-sdg.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ForgotpassComponent } from './forgotpass/forgotpass.component';
import { FormService } from './service/form.service';
import { CustomValidatorsService } from './service/custom-validators.service';
import { ToastService } from './service/toast.service';
import { ToasterModalComponent } from './core/components/toaster-modal/toaster-modal.component';
import { HttpService } from './service/http.service';
import { CoreModule } from './core/core.module';
import { SidebarComponentComponent } from './fragments/sidebar-component/sidebar-component.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { TargetIndicatorComponent } from './cms/target-indicator/target-indicator.component';
import { AccessAndAuthorities } from './service/authorities.service';
import { DisableOptionsPipe } from './cms/services/disable-options.pipe';
import { ModalMessageComponent } from './fragments/modal-message/modal-message.component';
@NgModule({
  entryComponents: [ModalMessageComponent],
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    Exception404Component,
    LoginComponent,
    ChangePasswordComponent,
    WorkinProgressComponent,
    AboutSdgComponent,
    ContactUsComponent,
    ForgotpassComponent,
    ToasterModalComponent,
    SidebarComponentComponent,
    ModalMessageComponent

    // DisableOptionsPipe,
    // TargetIndicatorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule, ToastModule.forRoot(),
    SdrcLoaderModule,
    MatIconModule,
    CoreModule,
    MatSidenavModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatListModule,
    MatToolbarModule,
    MatDialogModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: XhrInterceptorService, multi: true },
    // [{ provide: DEFAULT_TIMEOUT, useValue: 30000 }],
    AppService,
    UserService,
    AuthGuard,
    RoleGuardGuard,
    LoggedinGuard,
    AccessGuard,
    SessionCheckService,
    StaticHomeService,
    DatePipe,
    FormService,
    CustomValidatorsService,
    ToastService,
    HttpService,
    AccessAndAuthorities
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
