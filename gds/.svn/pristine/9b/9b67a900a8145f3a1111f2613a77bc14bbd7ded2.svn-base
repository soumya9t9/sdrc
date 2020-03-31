import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CmsServiceService } from '../services/cms-service.service';
import { Router } from '@angular/router';
import { LowerLevelAuthorityTyeps, AccessAndAuthorities, HighLevelAuthoritiesKey, HighLevelAuthorityType } from '@src/app/service/authorities.service';
declare var $: any;
@Component({
  selector: 'app-cms-side-menu',
  templateUrl: './cms-side-menu.component.html',
  styleUrls: ['./cms-side-menu.component.scss']
})
export class CmsSideMenuComponent implements OnInit {
  cmsServices: CmsServiceService;
  router: Router;
  showPlus: boolean;
  showMinus: any = false;

  @Input()
  menu: any;

  @Input()
  submenu: any;

  @Input()
  leftmenu: any[] = [];

  @Input() tempLeftMenu: any[] = [];

  selectedMenu: any;
  leftsubmenu: any;
  selectedSection: any;
  mainSelectedSection: any;
  savedLeftMenuArray: any[] = [];
  @Output()
  selectedSectionEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    router: Router,
    private cmsService: CmsServiceService,
    private authorities: AccessAndAuthorities
  ) {
    this.router = router;
    this.cmsServices = cmsService;
  }

  ngOnInit() {
    this.savedLeftMenuArray = JSON.parse(JSON.stringify(this.leftmenu));
    this.mainSelectedSection = this.savedLeftMenuArray.filter(obj => obj.leftmenuName == this.menu)[0];
    this.getPageContentData(this.mainSelectedSection, this.selectedSection);

  }

  ngOnChanges(changes) {
    this.savedLeftMenuArray = JSON.parse(JSON.stringify(this.leftmenu));
    this.leftmenu.forEach(obj => {
      obj.leftsubmenu = obj.leftsubmenu.filter(eachSubMenuItem => {
        return this.authorities.hasAccess(HighLevelAuthoritiesKey.MDM, HighLevelAuthorityType.specified, (eachSubMenuItem.leftsubmenuName || "").toString(), LowerLevelAuthorityTyeps.any);
      });
    });
    if (changes.submenu && this.leftmenu.length && this.submenu) {
      // this.mainSelectedSection = this.leftmenu[this.leftmenu.findIndex(d => d.leftmenuName === this.mainSelectedSection.leftmenuName)]
      // this.selectedSection = this.mainSelectedSection.leftsubmenu[this.mainSelectedSection.leftsubmenu.findIndex(d => d.leftmenuId === this.selectedSection.leftmenuId)]
      this.mainSelectedSection = this.leftmenu.filter(obj => obj.leftmenuName == this.menu)[0];
      this.selectedSection = this.mainSelectedSection.leftsubmenu.filter(obj => obj.leftsubmenuName == this.submenu)[0];
      // this.selectedSectionEmitter.emit(this.selectedSection);
      this.cmsService.selectedMenu = this.selectedSection.leftsubmenuName;
      console.log("leftmenu", this.leftmenu);
      console.log("selectedSection", this.mainSelectedSection);
    }
    else {
      // this.mainSelectedSection = this.leftmenu[0];
      // this.selectedSection = this.leftmenu[0].leftsubmenu[0]
      // this.selectedSectionEmitter.emit(this.selectedSection)
    }
  }

  getPageContentData(menu, submenu) {
    //if (menu.leftmenuId != this.selectedSection.leftmenuId) {
    this.mainSelectedSection = menu;
    this.selectedSection = submenu;
    // this.selectedSection.questions.forEach(element => {
    //   element.value="";
    // });
    this.selectedSectionEmitter.emit(submenu);
    this.cmsService.selectedMenu = this.selectedSection.leftsubmenuName
    //}
  }

  navigateTo(menu, submenu) {
    this.router.navigate(['mdm', submenu.leftsubmenuName.toLowerCase()]);
  }






}
