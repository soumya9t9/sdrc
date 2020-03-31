import { Component, OnInit, HostBinding, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../app.service';
import { AccessAndAuthorities, HighLevelAuthoritiesKey, HighLevelAuthorityType, LowerLevelAuthorityTyeps } from '@src/app/service/authorities.service';
import { ToastService } from '@src/app/service/toast.service';
import { Constants } from '@src/app/constants';
import { MatDialog } from '@angular/material';
import { ModalMessageComponent } from '../modal-message/modal-message.component';
declare var $: any;
@Component({
  selector: 'app-sidebar-component',
  templateUrl: './sidebar-component.component.html',
  styleUrls: ['./sidebar-component.component.scss']
})
export class SidebarComponentComponent implements OnInit {
  // menuslist = [1, 2, 3, 4, 5, 6, 7, 8];

  @HostBinding('class.active') isMenuOpen: boolean = false;
  router: Router;
  app: any;
  userName: string;
  HighLevelAuthoritiesKey = HighLevelAuthoritiesKey;
  constructor(
    router: Router,
    private appService: AppService,
    private authorities: AccessAndAuthorities,
    private toaster:ToastService,
    private dialog: MatDialog,
  ) {
    this.router = router;
    this.app = appService;
  }

  menuItemClickHandler(e, index?) {
    e.stopPropagation();
    // something magical  🧙‍♂️✨
    console.log(index);
    this.toggle(e);
  }
  @HostListener('click', ['$event']) click(e) {
    e.stopPropagation();

  }
  @HostListener("document:click") resetToggle() {
    this.isMenuOpen = false;
  }

  toggle(e) {
    e.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  ngOnInit() {
  }
  setFontSize(fontSize) {
    $("#bodyMain :not(svg, polygon, g, path, line, text)").css("font-size", fontSize + "px");

  }
  checkUserAuthorization(route) {

    const expectedRoles = route;
    if (localStorage.getItem('access_token')) {
      var token = JSON.parse(localStorage.getItem('access_token'));
      this.app.userName = token.username;
    }
    let flag = false;
    if (this.appService.checkLoggedIn()) {
      expectedRoles.forEach(expectedRole => {
        if (token.roles[0] == expectedRole) {
          flag = true;
        }
      });
    }
    return flag;
  }


  logout() {
    this.appService.logout();
    this.app.userName = "";
    this.toaster.success(Constants.message.loggedOut);
  }

  checkForAccess(highLevelAuth) {
    return this.authorities.hasAccess(highLevelAuth, HighLevelAuthorityType.any, null, null);
  }

  checkDeptStatus() {
    let userDetails = JSON.parse(localStorage.getItem("user_details"));
    return userDetails && userDetails.sessionMap && userDetails.sessionMap.deptStatus;
  }

  checkDistStatus() {
    let userDetails = JSON.parse(localStorage.getItem("user_details"));
    return userDetails && userDetails.sessionMap && userDetails.sessionMap.areaStatus;
    // return JSON.parse(localStorage.getItem("user_details")).sessionMap.areaStatus
  }

  showDialogLinkDisabled() {
    let message: string = ""
    if(!this.checkDeptStatus() && !this.checkDistStatus()) {
      message = "District and Department of this user has been disabled. Please contact to administrator."
    } else if(!this.checkDeptStatus()) {
      message = "Department of this user has been disabled. Please contact to administrator."
    } else if(!this.checkDistStatus()) {
      message = "District of this user has been disabled. Please contact to administrator."
    } else {
      message = "Please contact to administrator."
    }
    const dialogRef = this.dialog.open(ModalMessageComponent,
      { width: '400px', disableClose: true, data: { header: 'Error', msg: message, button: 'Ok' } });
  }
}
