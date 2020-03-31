import { Component, OnInit, OnChanges, ElementRef, ViewChild, Output, EventEmitter, Inject, ChangeDetectorRef } from '@angular/core';
import { ErrorStateMatcher, MatDialog, MatChipInputEvent } from '@angular/material';
import { FormGroupDirective, NgForm, FormControl, FormGroup, FormBuilder, Validators, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Constants } from '@app/constants';
import { CmsServiceService } from '@cms/services/cms-service.service';
import { DomSanitizer } from '@angular/platform-browser';
// import { LoadingBarService } from '@ngx-loading-bar/core';
import { DatePipe } from '@angular/common';
// import { ToastrService } from 'ngx-toastr';
import { InformationDailogComponent } from '../dailog/information-dailog/information-dailog.component';
import { HttpEventType, HttpResponse, HttpHeaders } from '@angular/common/http';
import { ConfirmationDailogComponent } from '../dailog/confirmation-dailog/confirmation-dailog.component';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { AppService } from '@app/app.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { IQuestion } from '@src/app/models/question';
declare var $: any;

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { Moment } from 'moment';
import { isArray } from 'util';
import { ToastService } from '@src/app/service/toast.service';
// import { MdmValidatorsService } from '../services/mdm-validators.service';
import { of, Observable, forkJoin, throwError } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { CustomValidatorsService } from '@src/app/service/custom-validators.service';
import { FormService } from '@src/app/service/form.service';
import { LowerLevelAuthorityTyeps, AccessAndAuthorities, HighLevelAuthoritiesKey, HighLevelAuthorityType } from '@src/app/service/authorities.service';
import { MdmValidatorsService } from '../services/mdm-validators.service';
const moment = _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/

export const YEAR_MODE_FORMATS = {
    parse: {
        dateInput: 'YYYY',
    },
    display: {
        dateInput: 'YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};


@Component({
  selector: 'app-mdm-source',
  templateUrl: './mdm-source.component.html',
  styleUrls: ['../scss/mdm_common.scss', './mdm-source.component.scss']
})

export class MdmSourceComponent implements OnChanges, OnInit {

  cmsServices: CmsServiceService
  questionArray: IQuestion[] = [];
  tempSectionData: any[] = [];
  questionUIArray: IQuestion[] = [];
  sectionData: any[] = [];
  photoContent: any;
  fileExtension: string[] = [];
  fileExtensionError: boolean = false;
  fileExtensionMessage: any;
  fileExtensionValidationMessage: string;
  photoForm: FormGroup;
  questionMapByColumnName: any;
  questionColumnMap: Map<String, IQuestion> = new Map();
  selectedFiles: any[] = [];
  numberOfColumn: any;
  uploadedFileExt: any;
  @ViewChild('inputFile') myInputVariable: ElementRef;

  @ViewChild('f') form;
  update: boolean = false;
  index: number = 0;

  beginSeletor: number;
  sdrcForm: FormGroup;
  confirmValidParentMatcher = new ConfirmValidParentMatcher();
  toppings = new FormControl();
  @Output() onSubmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onButtonClicked: EventEmitter<any> = new EventEmitter<any>();
  passwordRegx = Constants.regularExp.passwordRegx;
  usernameRegx = Constants.regularExp.usernameRegx;
  url: any;
  title: string;
  extNameMessage: string;
  fileExtValidationMessage: any;

  ERROR_MESSAGE: IMessages = Constants.message;
  private units = [
      'bytes',
      'KB',
      'MB',
      'GB',
      'TB',
      'PB'
  ];

  // locationPicker: LocationPicker;

  //tag properties started    
  /**
   * This property will keep all the tags
   */
  tags: Tag[] = [];
  selectable = true;
  removable = true;
  addOnBlur = true;

  selectedSectionData: any;
  /**
   *
   * Enter key and comma will separate the tags
   * 
   */
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  firstIntanceQuestion: any;
  progress: { percentage: number } = { percentage: 0 };
  currentFileUpload: boolean;
  srcfiles: any = 'assets/img/photo.png';
  srcFile: any;
  apiGateway: string = Constants.HOME_URL;
  selectedMenu: string;
  selectedSubmenu: string;
  routedParam;
  that;
  changePassword = {
      display: false,
      userId: null,
      newPassword: null,
      confirmPassword: null,
      maxLength: 13,
      minLength: 8,
  };

  //tag property ended
  @Inject(Window) private window: Window;

  config = {
      toolbarGroups: [
          //   { name: 'document', groups: ['mode', 'document'] },		
          { name: 'clipboard', groups: ['clipboard', 'undo'] },
          { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
      ],
      removePlugins: 'elementspath'
  }
  showForm: boolean = false;
  changePasswordForm: FormGroup;
  indicatorsFormConfig: any;
  indicatorsFG: any;
  indicatorWiseTargetValue: any;
  AuthoritiesTyeps = LowerLevelAuthorityTyeps;
  constructor(
      private formBuilder: FormBuilder,
      private cdRef: ChangeDetectorRef,
      private route: ActivatedRoute,
      private router: Router,
      private cmsService: CmsServiceService,
      public datepipe: DatePipe,
      private dialog: MatDialog,
      public domSanizitizer: DomSanitizer,
      public app: AppService,
      private location: Location,
      private toaster: ToastService,
      private formService: FormService,
      private authorities: AccessAndAuthorities
      //  private loader: LoadingBarService,
      // private toastr: ToastrService, 
  ) {
      this.sdrcForm = new FormGroup({});
      this.cmsServices = cmsService;
      this.app.cmsSubmenu = null;
      this.that = this;
      this.getUrlParams();
      console.log(this);
      this.resetChangePassword();
      this.changePasswordForm = this.formBuilder.group({
          userId: ['', [Validators.required]],
          newPassword: ['', [CustomValidatorsService.password, Validators.required]],
          confirmPassword: ['', [CustomValidatorsService.password, Validators.required]]
      }, { validators: [MdmValidatorsService.resetPasswordValidate] })
  }

  resetChangePassword() {
      this.changePassword = {
          display: false,
          userId: null,
          newPassword: null,
          confirmPassword: null,
          maxLength: 13,
          minLength: 8,
      }
  }

  ngOnInit() {
      // this.getUrlParams();
  }

  datePickerType(controlType) {
      let res = ['datepicker', 'yearpicker'].includes(controlType)
      return res ? controlType : 'datepicker';
  }

  getOptions(field) {
      if (field.controlType === "multiSelect" && field.optionsApi && field.options == null) {
          field.options = [];
          this.cmsService.getApiData(field.optionsApi).subscribe((res: any) => {
              field.options = isArray(res) ? res : [];
              return field.options
          });
      }
      // return field.options || [];
  }

  comparer(o1: any, o2: any): boolean {
      // if possible compare by object's id property - and not by reference.
      return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  checkIfSelected(field: any, item) {
      return field.map(item => item['id']).includes(item.id);
  }

  multiSelectOnChange(field: any) {

      if (field.columnName === "areaLevelIds") {
          this.questionUIArray.some(eachQuestion => {
              if (eachQuestion.columnName === "takeInIndexCalculation") {
                  let show = field.value.includes(3);
                  eachQuestion.controlType = show ? "radio" : "hidden";
                  eachQuestion.required = show;
                  eachQuestion.value = show ? true : '';
                  this.sdrcForm.get(eachQuestion.columnName).setValue(eachQuestion.value);
              } else if (eachQuestion.columnName === "toBeAggregated") {
                  let show = field.value.includes(2) && field.value.includes(3);
                  eachQuestion.controlType = show ? "radio" : "hidden";
                  eachQuestion.required = show;
                  eachQuestion.value = show ? true : '';
                  this.sdrcForm.get(eachQuestion.columnName).setValue(eachQuestion.value);
              }
              return false;
          })

      } else if (field.columnName === "designationIds" && field.value && field.value.length) {
          let show = field.value;
          this.questionUIArray.some(eachQuestion => {
              if (eachQuestion.columnName === "permissions") {
                  eachQuestion.controlType = show ? "info" : "hidden";
                  eachQuestion.required = show;
                  if (show) {
                      let selectedRoles = this.selectedSectionData.extras['roles'].filter(eachRole => field.value.includes(eachRole.id));
                      let selectedPermissions = selectedRoles.map(eachRoles => eachRoles.authorityList).flat();
                      eachQuestion.value = selectedPermissions.reduce((selectedAuthorities, eachPermisssion, permissionIndex) => {
                          selectedAuthorities += eachPermisssion.description + ((permissionIndex != selectedPermissions.length - 1) ? ", " : "")
                          return selectedAuthorities;
                      }, "");
                  }
              }
              return false;
          })
      }

  }


  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>, field) {
      // startView = "multi-year" || "month" || "year" || "multi-year";
      if (!this.isYearEnabled(normalizedYear.year(), field)) {
          datepicker.close();
          // moment.stopPropagation();
          // moment.preventDefault();
          return;
      }
      if (field.startView === "multi-year") {
          const control = this.sdrcForm.get(field.columnName);
          const ctrlValue = moment(new Date(control.value));
          ctrlValue.year(normalizedYear.year());
          control.setValue(ctrlValue);
          datepicker.close();
      }
  }

  /** Whether the given year is enabled. */
  private isYearEnabled(year: number, field) {
      // disable if the year is greater than maxDate lower than minDate
      let _max = field.max ? moment(new Date(field.max)) : null;
      let _min = field.min ? moment(new Date(field.min)) : null;
      if (year === undefined || year === null ||
          (_max && year > _max.year()) ||
          (_min && year < _min.year())
      ) {
          return false;
      }

      return true;
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>, field) {
      if (field.startView === "multi-year") {
          const control = this.sdrcForm.get(field.columnName);
          const ctrlValue = moment(new Date(control.value));
          ctrlValue.month(normalizedMonth.month());
          control.setValue(ctrlValue);
          datepicker.close();
      }
  }

  getMenuAndFormData() {
      this.cmsService.getCMSleftData().subscribe(d => {
          // this.app.cmsSubmenu = null;
          let hasAccessToOne = false;
          d.forEach(obj => {
              obj.leftsubmenu = obj.leftsubmenu.filter(eachSubMenuItem => {
                  let hasAccess = this.authorities.hasAccess(HighLevelAuthoritiesKey.MDM, HighLevelAuthorityType.specified, (eachSubMenuItem.leftsubmenuName || "").toString(), LowerLevelAuthorityTyeps.any);
                  hasAccessToOne = hasAccessToOne || hasAccess;
                  return hasAccess;
              });
          });

          if (!hasAccessToOne) {
              this.router.navigate(['/exception']);
              return false;
          }
          this.sectionData = d;
          this.app.cmsMenu = this.sectionData[0].leftmenuName;
          this.sectionData[0].leftsubmenu.find(eachSubMenu => {
              if (this.routedParam && eachSubMenu.leftsubmenuName.toLowerCase() == this.routedParam) {
                  this.app.cmsSubmenu = eachSubMenu.leftsubmenuName;
              }
          });
          !this.app.cmsSubmenu ? this.app.cmsSubmenu = this.sectionData[0].leftsubmenu[0].leftsubmenuName : '';
          this.tempSectionData = JSON.parse(JSON.stringify(d));
      })
  }
  getUrlParams() {
      // this.router.parseUrl.
    //   this.routedParam = null;
    //   this.router.events.subscribe((event) => {
    //       console.log("event", event);
    //   });

    //   this.route.paramMap.subscribe(params => {
          this.routedParam = "source";
          this.getMenuAndFormData();
    //   });
  }

  onSubMenuClick($event, f: NgForm) {
      if ($event && $event.leftsubmenuName) {
          this.toggleAndResetForm(false);
          this.selectedDepartment = null;
          let tempUrls = this.router.url.split("/");
          this.app.cmsSubmenu != $event.leftsubmenuName ? this.app.cmsSubmenu = $event.leftsubmenuName : '';
          tempUrls.length < 3 ? tempUrls.push($event.leftsubmenuName) : '';
          tempUrls.splice(-1, 1, $event.leftsubmenuName.toLowerCase());
          const url = this
              .router
              .createUrlTree(tempUrls, { relativeTo: this.route })
              .toString();
          this.location.replaceState(url);
          this.fileExtValidationMessage = "";
          $event.extras = null;
          this.selectedSectionData = $event;

          this.fetchAllData($event);
          this.questionArray = JSON.parse(JSON.stringify($event.questions));
          this.createForm();
          this.convertQuestionarrayToMap();

          this.update = false;
          this.index = 0;
          this.sdrcForm.markAsUntouched();
          this.sdrcForm.markAsPristine();

      }
  }

  /** 
 * 
  */
  getAllPermissions(permissions) {
      if (!isArray(permissions)) {
          return "";
      }
      return permissions.reduce((result, eachPermission, permissionIndex) => {
          let comma = permissionIndex !== (permissions.length - 1) ? ", " : "";
          return result + eachPermission.description + comma;
      }, "");
  }

  fetchAllData($event) {
      if ($event.apis && $event.apis.fetchAll) {
          this.toggleAndResetForm(false);
          this.cmsService.fetchAllData($event.apis.fetchAll).subscribe(response => {
              let tableBody: any[] = isArray(response) ? response : [];
              /* sort by lat updated date(decending) : latest at the top */
              tableBody = tableBody.sort((itemA, itemB) => {
                  if (itemA.updated && itemB.updated) {
                      return new Date(itemA.updated) > new Date(itemA.updated) ? 1 : -1;
                  } else if (itemA.hasOwnProperty("goalPosition") || itemB.hasOwnProperty("goalPosition")) {
                      return itemA.goalPosition - itemB.goalPosition;
                  }
                  return -1;
              });

              /* handel different senarios in individual cases */
              switch ($event.leftsubmenuName) {
                  case "SDG-Target":
                      tableBody = this.massageSDGTargetList(tableBody, $event);
                      break;
                  case "Indicator":
                      !$event.extras ? $event.extras = {} : '';
                      this.getAllIndicatorDependencies($event);
                      tableBody = this.massageIndicatorList(tableBody, $event);
                      break;
                  case "Scheme":
                      this.cmsService.getApiData("v1/indicator/findAllIndicators").subscribe(res => {
                          let data = res;
                          let innerTableData: any = {};
                          innerTableData['extras'] = {}
                          this.massageIndicatorList(data, innerTableData);
                          innerTableData['indicators'] = innerTableData['extras']['indicators'].map((eachColumn, index) => {
                              eachColumn['isSelected'] = false;
                              eachColumn["action"] = [
                                  {
                                      "controlType": "checkbox",
                                      "value": "",
                                      "type": "checkbox",
                                      "class": "btn btn-submit enableDisable",
                                      "tooltip": "",
                                      "activeLabel": "Select",
                                      "inactiveLabel": "Unselect",
                                      "mappedKey": "isSelected",
                                      "activeValue": true,
                                      "inactiveValue": false,
                                      "queryParamMap": [],
                                      "icon": "fa-trash fa-lg"
                                  }
                              ];
                              return { "slNo": index + 1, ...eachColumn };
                          });
                          this.innerSchemeTableBody = innerTableData.indicators || [];
                      });
                      break;
                  case "User":
                      !$event.extras ? $event.extras = {} : '';
                      this.getAllUserDependencies($event, tableBody);
                      break;
                  case "Target-Value":
                      !$event.extras ? $event.extras = {} : '';
                      this.massageIndicatorList(tableBody, $event);
                      let departmentWiseIndicators = Object.values($event["extras"]["departmentWiseIndicators"]) || []
                      tableBody = departmentWiseIndicators[0] as Array<any>;
                      if (departmentWiseIndicators.length) {
                          this.departmentList = $event["extras"].departmentIds;
                          this.selectedDepartment = this.departmentList[0].departmentId;
                      }
                      break;
              }

              /* add additional column to show in the table or manipulate the existing columns */
              tableBody = tableBody.map((eachColumn, index) => {
                  eachColumn['authorityList'] ? eachColumn["permissions"] = this.getAllPermissions(eachColumn['authorityList']) : '';
                  $event.action = $event.action.filter(eachAction => {
                      return this.hasUserAccessToMDM(eachAction.authorityType, $event.leftsubmenuName);
                  });
                  $event.action.length > 0 ? eachColumn["action"] = $event.action : '';
                  return { "slNo": index + 1, ...eachColumn };
              });
              $event.action.length < 1 ? $event.tableColumns = $event.tableColumns.filter(e => e != "action") : '';
              this.selectedSectionData = $event;
              this.selectedSectionData["tableBody"] = tableBody;
              this.selectedSectionData["tableColumns"] = this.selectedSectionData.tableColumns || Object.keys(tableBody[0] || []);
          });
      }
  }

  massageSDGTargetList(tableBody, $event) {
      let tempTargetList = []
      tableBody.map((eachGoal, goalIndex) => {
          let allTargetsOfThisGoal = eachGoal.targets.map(eachTarget => {
              eachTarget['target'] = eachTarget.name;
              eachTarget['goalName'] = eachGoal.name;
              eachTarget['goalId'] = eachGoal.id;
              eachTarget['goalIndex'] = goalIndex;
              eachTarget['status'] = true;
              return eachTarget;
          })
          tempTargetList = [...tempTargetList, ...allTargetsOfThisGoal];
          return allTargetsOfThisGoal
      });
      tableBody = tempTargetList;
      return tableBody;
  }

  massageIndicatorList(tableBody, $event) {
      let tempGoalWiseTargets = {};
      let tempGoalWiseIndicators = {};
      let tempGoals = [];
      let tempIndicators = [];
      /* only for target-value */
      let departmentWiseIndicators = {
      };
      let departmentIds = []
      tempGoals = tableBody.map((eachGoal, goalIndex) => {
          let allTargetsOfThisGoal = eachGoal.targets.map((eachTarget, targetIndex) => {
              /* agreegate all indicators */
              let allIndicatorsOfThisTarget = eachTarget.indicators.map(eachIndicator => {
                  eachIndicator['goalName'] = eachGoal.goalName;
                  eachIndicator['goalId'] = eachGoal.goalId;
                  eachIndicator['goalIndex'] = goalIndex;
                  eachIndicator['targetName'] = eachTarget.targetName;
                  eachIndicator['targetId'] = eachTarget.targetId;
                  eachIndicator['targetIndex'] = targetIndex;
                  // eachIndicator['status'] = true;
                  eachIndicator['indicatorName'] = eachIndicator.indName;
                  eachIndicator['indicatorId'] = eachIndicator.indId;
                  eachIndicator['name'] = eachIndicator.indName;
                  eachIndicator['id'] = eachIndicator.indId;
                  eachIndicator.departmentId = eachIndicator.deptId || this.cmsService.getRandomInt(6);
                  eachIndicator.departmentName = eachIndicator.deptName || 'DEPT' + eachIndicator.departmentId;
                  if (eachIndicator.departmentId) {
                      let departmentId = eachIndicator.departmentId;
                      if (departmentWiseIndicators[departmentId] && isArray(departmentWiseIndicators[departmentId])) {
                          departmentWiseIndicators[departmentId].push(eachIndicator);
                      } else {
                          departmentWiseIndicators[departmentId] = [eachIndicator];
                          departmentIds.push({ departmentId, departmentName: eachIndicator.departmentName, dIndex: departmentIds.length });
                      }
                  }
                  return eachIndicator;
              });
              tempGoalWiseIndicators[eachGoal.goalId] = allIndicatorsOfThisTarget
              /* merge indicators of this target with all indicators */
              tempIndicators = [...tempIndicators, ...allIndicatorsOfThisTarget];

              return { "id": eachTarget.targetId, "name": eachTarget.targetName }
          })
          /* merge targets of this goal with all targets */

          tempGoalWiseTargets[eachGoal.goalId] = allTargetsOfThisGoal;
          return { "id": eachGoal.goalId, "name": eachGoal.goalName }
      });
      $event.extras["goals"] = tempGoals;
      $event.extras["goalWisetargets"] = tempGoalWiseTargets;
      $event.extras["indicators"] = tableBody = tempIndicators;
      $event.extras["goalWiseIndicators"] = tempGoalWiseIndicators;
      $event.extras["departmentWiseIndicators"] = departmentWiseIndicators;
      $event.extras["departmentIds"] = departmentIds;
      this.questionArray.forEach((eachQuestion: any) => {
          eachQuestion["columnName"] === "goalId" ? eachQuestion.options = tempGoals : '';
          eachQuestion["columnName"] === "sdgTargetId" ? eachQuestion.options = [] : '';
          eachQuestion["columnName"] === "proxyIndicatorIds" ? eachQuestion.options = tempIndicators : '';
      })
      console.log("dddd", $event)
      return tableBody;
  }

  massageUserList(tableBody, $event) {
      tableBody.forEach(eachUser => {
          let selectedAreaLevel = this.getAreaLevelById(eachUser.areaLevelId);
          // eachUser["areaLevel"] = eachUser.;
          eachUser["areaLevel"] = selectedAreaLevel ? selectedAreaLevel["name"] : null;
          eachUser["department"] = this.getDepartmentById(eachUser.departmentId, $event["extras"]["departments"]);
          eachUser["role"] = this.getUserRoleById(eachUser.designationIds, $event["extras"]["roles"]);
      });
  }

  getAllIndicatorDependencies($event) {
      let reqItems = ["sources", "departments", "units", "frequencies"];
      let defaultValue = {
          "departments": 4,
          "units": 1,
          "frequencies": 3,
      }
      let observableBatch = [];
      reqItems.forEach(eachItem => {
          if (!($event["extras"] && $event["extras"][eachItem])) {
              observableBatch.push(
                  this.cmsService.getApiData($event.apis[eachItem]).map(res => res).pipe(catchError(() => { return of([]) }))
              );
          }
      });

      forkJoin(observableBatch).subscribe(responses => {
          reqItems.forEach((eachItem, itemIndex) => {
              $event["extras"][eachItem] = responses[itemIndex];
              this.questionArray.some((eachQuestion: any) => {
                  let result = eachQuestion["key"] == eachItem;
                  if (result) {
                      eachQuestion.options = responses[itemIndex] || [];
                      // defaultValue[eachItem] ? eachQuestion.value = responses.find(e => e[e.optionKey] == defaultValue[eachItem]) : '';
                      defaultValue[eachItem] ? eachQuestion.value = defaultValue[eachItem] : '';
                      this.sdrcForm.get(eachQuestion.columnName).setValue(eachQuestion.value);
                      this.dependenciesChecking(eachQuestion);
                  }
                  return result;
              })
          });
      });
  }

  getAllUserDependencies($event, tableBody) {
      let reqItems = ["districts", "departments", "roles", "permissions"];

      let observableBatch = [];
      reqItems.forEach(eachItem => {
          if (!($event["extras"] && $event["extras"][eachItem])) {
              observableBatch.push(
                  this.cmsService.getApiData($event.apis[eachItem]).map(res => res).pipe(catchError(() => { return of([]) }))
              );
          }
      });

      forkJoin(observableBatch).subscribe(responses => {
          reqItems.forEach((eachItem, itemIndex) => {
              $event["extras"][eachItem] = responses[itemIndex];
              this.questionArray.some((eachQuestion: any) => {
                  let result = eachQuestion["key"] == eachItem;
                  if (result) {
                      eachQuestion.options = responses[itemIndex] || [];
                  }
                  return result;
              })
          });
          this.massageUserList(this.selectedSectionData.tableBody, $event)
      });

      observableBatch.length === 0 ? this.massageUserList(tableBody, $event) : '';
  }

  mapper = {};

  getAreaLevelById(id) {
      return AREA_LEVEL_ID.filter(eachAreaLevel => eachAreaLevel.id == id)[0];
  }
  getUserRoleById(ids: any[] = [], list: any[]) {
      let idCount = 0;
      if (!this.mapper["roleIdAndRoleNameMapper"]) {
          this.mapper["roleIdAndRoleNameMapper"] = {};
          list.forEach((eachRole) => {
              this.mapper["roleIdAndRoleNameMapper"][eachRole.id] = eachRole.name;
          })
      }
      return ids.reduce((allRoles, eachRoleId, roleIndex) => allRoles + (roleIndex != 0 ? ', ' : '') + this.mapper["roleIdAndRoleNameMapper"][eachRoleId], "");
  }

  getDepartmentById(id: string | number, list: any[]) {
      let idCount = 0;
      if (!this.mapper["deptIdAndDeptNameMapper"]) {
          this.mapper["deptIdAndDeptNameMapper"] = {};
          list.forEach((eachRole) => {
              this.mapper["deptIdAndDeptNameMapper"][eachRole.id] = eachRole.name;
          })
      }
      return this.mapper["deptIdAndDeptNameMapper"][id];
  }

  scrollToError(): void {
      const firstElementWithError = document.querySelector('form .ng-invalid');
      this.scrollTo(firstElementWithError);
  }

  scrollTo(el: Element) {
      if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
      }
  }

  async scrollIfFormHasErrors(form: FormGroup): Promise<any> {
      await form.invalid;
      this.scrollToError();
  }

  transform(bytes: number = 0, precision: number = 2): string {
      if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes)) return '?';

      let unit = 0;

      while (bytes >= 1024) {
          bytes /= 1024;
          unit++;
      }
      return bytes.toFixed(+ precision) + ' ' + this.units[unit];
  }

  ngOnChanges() {
      if (this.questionArray) {
          this.createForm();
          this.convertQuestionarrayToMap();
      }
  }

  submit(f, b) {
      let errorKey = {
          error: null
      };

      if (this.validateForm(f, errorKey)) {
          this.submitClicked(f);
      } else {
          let errorMessage = typeof errorKey['error'] === "string" ? errorMessages[errorKey['error']] || "Something went wrong" : errorMessages["form"];
          this.toaster.error(errorMessage);
      }
  }
  validateForm(f, errorKey) {
      switch (this.selectedSectionData.leftsubmenuName) {
          case "Frequency":
              errorKey['error'] = this.frequencyValidationCheck(f, errorKey);
              break;
      }

      return typeof errorKey['error'] !== "string" && f.valid;
  }
  frequencyValidationCheck(fg, errorKey) {
      let value = fg.value || {};
      let dataRejectionDays = value.dataRejectionDays;
      let dataCollectionDays = value.dataCollectionDays;
      let sum = parseInt(dataCollectionDays) + parseInt(dataRejectionDays);
      if (!(sum && !isNaN(sum) && sum < 28)) {
          errorKey = "frequency";
      }
      return errorKey;
  }
  clickInfo(infoMsg) {
      const dialogRef = this.dialog.open(InformationDailogComponent,
          { width: '400px', data: { msg: infoMsg } });
  }
  whiteSpaceValidator(control: FormControl) {
      if (control.value && control.value.trim() === "") {
          return {
              whiteSpace: true
          };
      }
      return null;
  }
  errors = errorMessages;

  createForm() {
      // this.intializePicker();

      let formBuilderJson: any = {};
      this.sdrcForm = this.formBuilder.group(formBuilderJson);
      this.questionArray.forEach(el => {
          if (el.columnName && !["btn-group", "table"].includes(el.columnName) && el.controlType) {
              let validators = !el.validators ? [] : el.validators.map(eachValidator => {
                  return CustomValidatorsService[eachValidator] || null;
              }).filter(eachValidator => eachValidator);

              let getValidators = !el.getValidators ? [] : el.getValidators.map(eachValidator => {
                  let r = CustomValidatorsService;
                  return CustomValidatorsService[eachValidator.func](...eachValidator.args) || null;
              }).filter(eachValidator => eachValidator);

              validators = [...validators, ...getValidators];
              formBuilderJson[el.columnName] = [{ value: el.value == 0 ? el.value.toString() : el.value, disabled: el.disabled }, validators];
              if (el.required) {
                  formBuilderJson[el.columnName][1].push(CustomValidatorsService.isEmpty)
              }
              if (el.minLength || el.minLength == 0) {
                  formBuilderJson[el.columnName][1].push(Validators.minLength(el.minLength))
              }
              if (el.maxLength) {
                  formBuilderJson[el.columnName][1].push(Validators.maxLength(el.maxLength))
              }
              if (el.pattern || regExps[el.type] != null) {
                  formBuilderJson[el.columnName][1].push(Validators.pattern(regExps[el.type]))
              }
              if (el.type === 'text') {
                  formBuilderJson[el.columnName][1].push(this.whiteSpaceValidator)
              }
              // if (el.type === 'textFiledRegex') {
              //     formBuilderJson[el.columnName][1].push(CustomValidatorsService.validateNoWhiteSpace);
              // }
              if (el.type === 'number') {
                  formBuilderJson[el.columnName][1].push(Validators.min(0))
              }
              if (el.max > 0) {
                  formBuilderJson[el.columnName][1].push(Validators.max(el.max))
              }
              if (el.min > -1) {
                  formBuilderJson[el.columnName][1].push(Validators.min(el.min))
              }


              if (el.controlType === 'beginRepeat' || el.controlType === 'beginRepeatImageRow') {
                  let k = 0;
                  el.childQuestionModels.forEach(element => {

                      element.forEach(el2 => {
                          formBuilderJson[el2.indexNumberTrack] = [{ value: '', disabled: el2.disabled }, []];
                          if (el2.required) {
                              formBuilderJson[el2.indexNumberTrack][1].push(Validators.required)
                          }
                          if (el2.minLength || el2.minLength == 0) {
                              formBuilderJson[el2.indexNumberTrack][1].push(Validators.minLength(el2.minLength))
                          }
                          if (el2.maxLength) {
                              formBuilderJson[el2.indexNumberTrack][1].push(Validators.maxLength(el2.maxLength))
                          }
                          if (el2.pattern || regExps[el2.type] != null) {
                              formBuilderJson[el2.indexNumberTrack][1].push(Validators.pattern(regExps[el2.type]))
                          }
                          if (el2.type === 'text') {
                              formBuilderJson[el2.indexNumberTrack][1].push(this.whiteSpaceValidator)
                          }

                          if (el2.type === 'number') {
                              formBuilderJson[el2.indexNumberTrack][1].push(Validators.min(0))
                          }

                          if (el2.max > 0) {
                              formBuilderJson[el2.indexNumberTrack][1].push(Validators.max(el2.max))
                          }
                          //code for set chips predefined values start
                          if (el.controlType === "chips") {
                              let values: string[] = el.value
                              this.tags = []
                              values.forEach(value => {
                                  this.tags.push({ name: value })
                              })
                          }
                      });
                      k++;

                  });
                  this.beginSeletor = k;
              }
          }
          //code for set chips predefined values end
      });
      let validators = [];
      switch (this.app.cmsSubmenu) {
          case "Scheme":
              // validators = [MdmValidatorsService.schemeValidate];
              break;
          case "Frequency":
              // validators = [MdmValidatorsService.frequencyValidate];
              break;
          case "User":
              validators = [MdmValidatorsService.userValidate];
              break;
      }
      this.sdrcForm = this.formBuilder.group(formBuilderJson, { validator: validators });
      this.questionUIArray = this.cloneObject([...this.questionArray]);
      this.questionUIArray.forEach(eachQ => {
          this.dependenciesChecking(eachQ);
      })
      this.cdRef.detectChanges();
      //   this.form.resetForm();
  }

  register(): void {
      // API call to register your user
  }

  convertExtToAcceptString(exten: string[]): string {
      let acceptString: string = "";
      exten.forEach(element => {
          acceptString += ".".concat(element + ",")
      });
      return acceptString.substring(0, acceptString.length - 1);
  }

  getUrl(feild) {
      return this.domSanizitizer.bypassSecurityTrustResourceUrl(feild.value)
  }
  viewFile(tag) {
      this.srcFile = null;
      this.srcFile = this.domSanizitizer.bypassSecurityTrustResourceUrl(Constants.HOME_URL + 'bypass/doc?fileId=' + tag.attachmentId);
      if (this.srcFile != null) {
          //   const dialogRef = this.dialog.open(ModalBoxComponent,
          //       { width: '100%', height: '100%', data: { msg: this.srcFile } });
          //$('#myModal').modal('show');
      }
  }
  /*file uploading -----------------------------------------------------------------------------------------------------------------*/
  fileUpload(event, extension, field: IQuestion, fieldSize, f?: NgForm): any {
      var file = event.target.files;
      var allowedExtensions = extension;
      let extensionNames: string = "";
      field.fileExtensionValidationMessage = "";
      this.fileExtValidationMessage = "";

      let uploadFlag: boolean = false;
      let uploadImgExt = ["jpg", "JPG", "jpeg", "JPEG", "png", "PNG"];
      for (var i = 0; i < file.length; i++) {
          if ((uploadImgExt).includes(file[i].name.split('.').pop())) {
              uploadFlag = this.checkSize(file, 512000);
              this.uploadedFileExt = true;
          } else {
              this.uploadedFileExt = false;
          }
      }
      if (uploadFlag == false) {
          field.fileValues = [];
          this.fileExtension = [];

          for (var i = 0; i < file.length; i++) {
              this.fileExtension.push(file[i].name.split('.').pop());
          }

          if (allowedExtensions && allowedExtensions.length > 1) {
              extensionNames = "("
              allowedExtensions.forEach(element => {
                  extensionNames += element + '/';
              });
              extensionNames = extensionNames.substring(0, extensionNames.length - 1) + ")"
          } else if (allowedExtensions) {
              extensionNames = allowedExtensions[0];
          }
          if (allowedExtensions && this.isInArray(allowedExtensions, this.fileExtension)) {
              this.fileExtensionMessage = ""
              this.fileExtensionValidationMessage = "";
          } else {
              //   this.reset();
              if (field.multiple) {
                  field.fileExtensionValidationMessage = "(only " + extensionNames + " files are accepted.)";
                  //this.fileExtValidationMessage =  "(only " + extensionNames + " files are accepted.)"
              } else {
                  field.fileExtensionValidationMessage = "(" + extensionNames + ")";
                  // this.fileExtValidationMessage =  "(" + extensionNames + ")";
              }
              if (!field.multiple)
                  field.value = null;
              this.sdrcForm.controls[field.columnName].markAsTouched();
              this.sdrcForm.controls[field.columnName].setErrors({ 'required': true });
              return;
          }

          if (file && !this.checkSize(file, fieldSize)) {
              if (this.isInArray(allowedExtensions, this.fileExtension)) {

                  this.currentFileUpload = true;
                  for (let f of file) {
                      f["originalName"] = f.name;
                      field.fileValues.push(f);

                      // this.cmsService.uploadFile(f).subscribe(events => {
                      //     // this.loader.stop();
                      //     if (events.type === HttpEventType.UploadProgress) {
                      //         this.progress.percentage = Math.round(
                      //             (100 * events.loaded) / events.total
                      //         );
                      //     } else if (events instanceof HttpResponse) {
                      //         this.currentFileUpload = false;
                      //         if (field.value && field.multiple) {
                      //             field.value.push(events.body)
                      //         }
                      //         else {
                      //             if (!field.multiple && field.value && field.value.length > 0) {
                      //                 if (field.deletedFileValue) {
                      //                     field.value.forEach(element => {
                      //                         field.deletedFileValue.push(element)
                      //                     })
                      //                 }
                      //                 else {
                      //                     field.deletedFileValue = [];
                      //                     field.value.forEach(element => {
                      //                         field.deletedFileValue.push(element)
                      //                     })
                      //                 }
                      //             }
                      //             field.value = [];
                      //             field.value.push(events.body)
                      //         }
                      //         //this.validateResponse = null;
                      //         //this.validated = false;
                      //         //this.finalUpload = events.body;
                      //         this.sdrcForm.controls[field.columnName].setValue(field.value)
                      //         this.progress.percentage = 0;
                      //     }
                      //     event.srcElement.value = null;
                      // }, error => {
                      //     event.srcElement.value = null;
                      //     this.currentFileUpload = false;

                      //     //this.validateResponse = null;
                      //     //this.validated = false;
                      //     this.progress.percentage = 0;
                      //     // this.errorMessage = Constants.SERVER_ERROR_MESSAGE;
                      // });
                  }
                  // const reader = new FileReader();
                  // const selectedFile = event.target.files[0];
                  // reader.readAsDataURL(selectedFile);
                  // reader.onload = () => {
                  //     this.sdrcForm.get(field.columnName).setValue(reader.result);
                  //     field.value = reader.result;
                  // }
                  field.value = file;
                  this.sdrcForm.get(field.columnName).setValue(field.value);

                  field.fileExtensionValidationMessage = "";
              } else {
                  field.value = null;
                  this.sdrcForm.controls[field.columnName].setErrors({ 'required': true });
                  if (field.multiple) {
                      field.fileExtensionValidationMessage = "(only " + extensionNames + " files are accepted and no file should exceed " + fieldSize / 1000 + " KB)";
                      this.fileExtValidationMessage = "(only " + extensionNames + " files are accepted and no file should exceed " + fieldSize / 1000 + " KB)";
                  }
                  else
                      // field.fileExtensionValidationMessage = "(" + extensionNames + " file within " + fieldSize / 1000 + " KB)";
                      this.fileExtValidationMessage = "(" + extensionNames + " file within " + fieldSize / 1000 + " KB)";
              }
          } else {
              event.srcElement.value = null;
              if (!field.multiple) {
                  field.value = null;
                  this.sdrcForm.controls[field.columnName].setErrors({ 'max': true });
              } else {
                  //field.fileExtensionValidationMessage ='Please upload file within '+((fieldSize / 1000)/1000 + " MB");
                  this.fileExtValidationMessage = 'Please upload file within 5 MB';
              }
              //this.sdrcForm.controls[field.columnName].setErrors({ 'max': true });               

          }
      } else {
          event.srcElement.value = null;
          if (!field.multiple) {
              field.value = null;
              this.sdrcForm.controls[field.columnName].setErrors({ 'max': true });
          } else {
              //field.fileExtensionValidationMessage ="Please upload file within 500.00 KB."
              this.fileExtValidationMessage = "Please upload file within 500 KB.";
          }
          //this.sdrcForm.controls[field.columnName].setErrors({ 'max': true });

      }
  }

  /**
   * this function checks whether any file exceeds the given size or not
   */
  checkSize(file: File[], fieldSize: number): boolean {
      let count = 0;
      for (var i = 0; i < file.length; i++) {
          if (file[i].size > fieldSize) count++;
      }
      if (count > 0) return true; else return false;
  }

  /**
   * returns true if the received extensions are belongs to allowed extensions else false.
   */
  isInArray(allowedExtensions: string[], receivedExtensions: string[]): boolean {
      return allowedExtensions.filter(val => receivedExtensions.includes(val)).length == 0 ? false : true;
  }
  // tslint:disable-next-line:jsdoc-format
  /**file upload complete ----------------------------------------------*/

  /* COVERT QUESTION ARRY TO MAP WITH COLOUM NAME KEY*/
  convertQuestionarrayToMap() {
      this.questionMapByColumnName = {};
      for (let i = 0; i < this.questionUIArray.length; i++) {
          this.questionMapByColumnName[this.questionUIArray[i].columnName] = this.questionUIArray[i];

      }
  }

  //clears all validations while an input field is hidden/removed
  removeAllValidations(field) {
      const fieldControl = this.sdrcForm.get(field.indexNumberTrack ? field.indexNumberTrack : field.columnName);
      if (field.controlType === 'file') {
          field.value = '';
          if (field.indexNumberTrack) {
              $('#fileToUpload' + field.indexNumberTrack).val(null);
          } else {
              $('#fileToUpload' + field.columnName).val(null);
          }
      }
      fieldControl.clearValidators();
      fieldControl.updateValueAndValidity();
  }
  // set all validation while input field is shown
  setAllValidations(field) {
      const fieldControl = this.sdrcForm.get(field.indexNumberTrack ? field.indexNumberTrack : field.columnName);
      let validatorArray = [];

      if (field.required) {
          validatorArray.push(Validators.required);
      }
      if (field.minLength || field.minLength === 0) {
          validatorArray.push(Validators.minLength(field.minLength));
      }
      if (field.maxLength) {
          validatorArray.push(Validators.maxLength(field.maxLength));
      }
      if (regExps[field.type] != null) {
          validatorArray.push(Validators.pattern(regExps[field.type]));
      }
      // Validators.compose([Validators.required, Validators.minLength(3)]);
      fieldControl.setValidators(Validators.compose(validatorArray));
      fieldControl.updateValueAndValidity();
  }

  //find depenedencykey 
  // getConditionKey(condition){
  //     return condition.split('#')[0]

  // }

  checkIsDependencyCondition(field) {

      $('#' + field.key).addClass("paddingLeft")
      let flag = false;
      for (let i = 0; i < field.dependentCondition.length; i++) {
          const condition: string = field.dependentCondition[i];
          const parentColumnName = field.parentColumns[i];

          if (condition.indexOf('#') > -1 && condition.split('#')[0] == 'isDependencyValue') {
              if (this.questionMapByColumnName[parentColumnName].value != condition.split('#')[1]) {
                  flag = true;
              }
          } else if (condition.indexOf('#') > -1 && condition.split('#')[0] === 'isDependencyValueRepeat') {
              if (this.sdrcForm.controls[parentColumnName + '_' + field.indexNumberTrack.split('_')[1]].value !==
                  condition.split('#')[1]) {
                  flag = true;
              }
          } else if (condition.indexOf('#') > -1 && condition.split('#')[0] === 'notDependencyValue') {
              if (this.questionMapByColumnName[parentColumnName].value == condition.split('#')[1]) {
                  flag = true;
              }
          } else if (condition.indexOf('@') > -1 && condition.split('@')[0] === 'isDependencyValue') {
              const exp = "this.questionMapByColumnName['" + parentColumnName + "']" + condition.split('@')[1]

              if (!this.questionMapByColumnName[parentColumnName].value) {
                  flag = true;
              } else if (!eval(exp)) {
                  flag = true;

              }
          } else if (condition.includes('isDependencyValueCalculateAge')) {
              if (this.questionMapByColumnName[parentColumnName].value) {
                  const timeDiff = Math.abs(new Date().getTime() - Date.parse(this.questionMapByColumnName[parentColumnName].value));
                  this.questionMapByColumnName[field.columnName].value = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
              }
              flag = false;
          } else if (condition.includes('disabled')) {
              if (this.questionMapByColumnName[parentColumnName].value === condition.split('#')[1]) {
                  this.sdrcForm.controls[field.columnName].disable();
              } else {
                  this.sdrcForm.controls[field.columnName].enable();
              }
              flag = false;
          } else if (condition.includes('notDisabled')) {
              if (this.questionMapByColumnName[parentColumnName].value !== condition.split('#')[1]) {
                  this.sdrcForm.controls[field.columnName].disable();
              } else {
                  this.sdrcForm.controls[field.columnName].enable();
              }
              flag = false;
          }

      }
      if (flag) {
          field.value = "";
          this.removeAllValidations(field);
      } else {
          this.setAllValidations(field);
      }
      return flag;
  }

  convertToDate(date: string): Date | null {
      if (date == 'today')
          return new Date();
      else if (date && date.includes('@'))
          return this.questionUIArray.filter(d => d.columnName == date.split('@')[1])[0].value
      else if (date)
          return new Date(date);
      else
          return null
  }

  preparePayloadData(f, data, formData) {
      this.questionUIArray.forEach(d => {
          if (d.columnName && d.controlType == 'datepicker')
              data[d.columnName] = this.datepipe.transform(d.value, 'dd/MM/yyyy');
          else if (d.columnName && d.controlType == 'yearpicker')
              data[d.columnName] = d.value.year();
          else if (d.columnName && d.controlType == 'file') {
              formData = this.prepareformData(formData, f.value);
              data[d.columnName] = d.value;
          }
          else if (d.columnName)
              data[d.columnName] = d.value;
      });
      return { data, formData }
  }
  public submitClicked(f: NgForm): void {
      let data = {};
      let formData: FormData = new FormData();

      this.preparePayloadData(f, data, formData);

      /* here remove unneccessary parmas from the data */
      if (!this.update && this.selectedSectionData) {
          this.selectedSectionData.excludeCreation.forEach(eachItem => {
              delete data[eachItem];
          });
      }
      if (this.selectedSectionData && this.selectedSectionData.leftsubmenuName === "District") {
          let reader = new FileReader();
          let selectedFile = f.value.topoJsonFile;
          const distName = f.value.distName;
          const distCode = f.value.distCode;
          let $that = this;
          reader.onload = function (event: any) {
              /* initialization */
              let tempAllDistCodes = "";
              let tempAllDistNames = "";
              let codeAndNamePairExists = 0;
              let miltipleName = false;
              let miltipleCode = false;
              let nameAndCodeFromDifferentRow = [];
              let distErrorMessage: any;
              try {
                  /* extracting file name and file content */
                  var contentString = event.target.result;
                  let content = JSON.parse(contentString);
                  console.log("File contents: " + contentString);
                  let stateCode = selectedFile[0].name;
                  stateCode = stateCode.split(".json")[0];
                  ["type", "arcs", "objects"].every(eachItem => {
                      if (!Object.keys(content).includes(eachItem)) {
                          distErrorMessage = `\"${eachItem}\" property not found in the root level`;
                          throwError(distErrorMessage);
                          return false;
                      }
                      return true;
                  });
                  let layer = content.objects[stateCode] || content.objects["layer1"];
                  distErrorMessage = (!layer) ? `\"state code\" or\"layer\" property not found` : distErrorMessage;
                  distErrorMessage = (layer && layer.geometries && !isArray(layer.geometries)) ? "\"geometries\" property should be an ARRAY" : (!layer.hasOwnProperty("geometries") || !layer.geometries) ? "Please provide valid value for geometry property" : distErrorMessage;
                  layer.geometries.forEach(eachDist => {
                      ["properties", "arcs", "type"].forEach((eachItem, itemIndex) => {
                          if (!Object.keys(eachDist).includes(eachItem)) {
                              distErrorMessage = `\"${eachItem}\" property not found inside geometries`;
                              throwError(distErrorMessage);
                              return false;
                          }
                      })

                      if (eachDist.properties.ID_ === distCode && eachDist.properties.NAME1_ === distName) {
                          ++codeAndNamePairExists;
                      } else if (eachDist.properties.ID_ === distCode) {
                          nameAndCodeFromDifferentRow.push({ error: "Name", msg: "Make sure Distirct Name is correct!" })
                      } else if (eachDist.properties.NAME1_ === distName) {
                          nameAndCodeFromDifferentRow.push({ error: "Code", msg: "Make sure Distirct Code is correct!" })
                      }
                      miltipleCode = miltipleCode || tempAllDistCodes.includes(eachDist.properties.ID_);
                      miltipleName = miltipleName || tempAllDistNames.includes((eachDist.properties.NAME1_ + "").toLowerCase());

                      tempAllDistNames += `/${(eachDist.properties.NAME1_ + "").toLowerCase()}`;
                      tempAllDistCodes += `/${eachDist.properties.ID_}`

                  });

              } catch (e) {
                  console.log("error", e);
              }

              if (!miltipleCode && !miltipleName && codeAndNamePairExists == 1) {
                  $that.doSubmitCall(f, data, formData);
              } else {
                  if (!distErrorMessage) {
                      distErrorMessage = (codeAndNamePairExists > 1 || (miltipleCode && miltipleName)) ? "Json data has duplicate entries for the pair(s) of district name and district code" : null;
                      (!distErrorMessage && codeAndNamePairExists && (miltipleCode || miltipleName)) ? distErrorMessage = `Json data has duplicate District ${miltipleCode ? 'Code' : 'Name'}` : null;
                      (!codeAndNamePairExists && nameAndCodeFromDifferentRow.length == 1) ? distErrorMessage = nameAndCodeFromDifferentRow[0].msg : null;
                      nameAndCodeFromDifferentRow.length > 1 ? distErrorMessage = "Please ensure that district name and distric code are properly mapped in the json" : null;
                      !distErrorMessage ? distErrorMessage = "District name and code Not found in the JSON file. Please Upload a valid JSON" : null;
                  }
                  $that.toaster.successModal(distErrorMessage);
                  // this.toaster.error(error.error.message);
              }
          };
          reader.readAsBinaryString(selectedFile[0]);
      } else if (this.selectedSectionData && this.selectedSectionData.leftsubmenuName === "Scheme") {
          // data["indicatorIds"] = this.innerSchemeTableBody.filter(eachIndicator => eachIndicator.isSelected).map(eachIndicator => eachIndicator.indId);
          this.doSubmitCall(f, data, formData);
      } else if (this.selectedSectionData && this.selectedSectionData.leftsubmenuName === "Target-Value") {
          data = this.indicatorsFG.value[0];
          let performanceType = data["performanceType"] === "Positive" ? 1 : -1;
          data['areaWiseYearTargets'].forEach(eachArea => {
              let lastYearIndexWithValidValue = 0;
              let lastValidValue;
              eachArea["yearWiseTargets"].forEach((eachYear, yearIndex) => {
                  if (eachYear.target != null && lastValidValue != null) {
                      lastValidValue = eachArea["yearWiseTargets"][lastYearIndexWithValidValue].target;
                      let missedYearCount = yearIndex - lastYearIndexWithValidValue;
                      let valueToBeAdded = (eachYear.target - lastValidValue) / (missedYearCount) || 0;
                      for (let i = 1; i <= missedYearCount; i++) {
                          eachArea["yearWiseTargets"][i + lastYearIndexWithValidValue].target = lastValidValue + (i * valueToBeAdded)
                      }
                  }
                  if (eachYear.target) {
                      lastYearIndexWithValidValue = yearIndex;
                      lastValidValue = eachYear.target;
                  }
              });
          });
          console.log(data);
          this.doSubmitCall(f, data, formData);
      }
      else {
          this.doSubmitCall(f, data, formData);
      }


  }
  doSubmitCall(form, data, formData) {
      let qParams = this.extractParams(data, this.selectedSectionData.queryParamMap || []);
      let payload = {
          params: qParams,
          body: Array.from(formData.entries()).length ? formData : data,
      }

      if (Array.from(formData.entries()).length) {
          // payload["headers"] = new HttpHeaders({
          //     'Content-type': 'false'
          // })
      }


      let URL = this.selectedSectionData.apis[this.update ? "update" : "create"];
      this.cmsService.saveUpdateData(payload, URL).subscribe(data => {

          this.index = 0;
          this.update = false;
          this.fetchAllData(this.selectedSectionData);
          const dialogRef = this.dialog.open(InformationDailogComponent,
              { width: '400px', disableClose: true, data: { msg: 'Data has been submitted successfully.', button: 'Ok' } });
          dialogRef.afterClosed().subscribe(result => {
              if (result) {

              }
          });
          form.resetForm();
          this.reset();
          this.questionUIArray.forEach(eachFormConfig => {
              if (eachFormConfig.controlType) {
                  eachFormConfig.value = null;
              }
          })
      }, error => {
          // this.toastr.error(error.error.message);
      })
  }

  public buttonClicked(field): void {
      this.onButtonClicked.emit({
          field: field
      });
  }

  public buttonClickedforBeginRepeatRemove(i, index) {
      this.questionUIArray[i].childQuestionModels.splice(index, 1);
  }

  public buttonClickedforBeginRepeat(objlist): void {
      // let lastNum: number = parseInt(objlist[objlist.length - 1][0].indexNumberTrack.split(objlist[objlist.length - 1][0].columnName + '_')[1])
      let k: number = this.beginSeletor++;
      let firstIntanceQuestion: IQuestion[] = [];
      objlist[0].forEach((element: IQuestion) => {
          let data: IQuestion = {
              key: element.key,
              value: element.disabled && element.controlType == 'datepicker' ? element.value : null,
              controlType: element.controlType,
              label: element.label,
              type: element.type,
              required: element.required,
              columnName: element.columnName,
              minLength: element.minLength,
              maxLength: element.maxLength,
              pattern: element.pattern,
              options: element.options,
              minDate: element.minDate,
              maxDate: element.maxDate,
              fileExtension: element.fileExtension,
              fileExtensionValidationMessage: element.fileExtensionValidationMessage,
              fileValues: element.fileValues,
              multiple: element.multiple,
              fileSize: element.fileSize,
              optionsParentColumn: element.optionsParentColumn,
              dependentCondition: element.dependentCondition,
              selectAllOption: element.selectAllOption,
              allChecked: element.allChecked,
              disabled: element.disabled,
              childQuestionModels: element.childQuestionModels,
              groupParentId: element.groupParentId,
              indexNumberTrack: element.columnName + '_' + k,
              parentColumns: element.parentColumns,
              placeHolder: element.placeHolder,
              serialNumb: element.serialNumb,
              removable: true,
              max: element.max
          }
          // data.indexNumberTrack = element.columnName+'_'+k
          firstIntanceQuestion.push(data);
      });
      // Array.prototype.push.apply(firstIntanceQuestion,objlist[0]);
      this.questionArray.filter(d => d.columnName == objlist[0][0].groupParentId)[0].childQuestionModels.push(firstIntanceQuestion);
      let formBuilderJson: any = {};

      firstIntanceQuestion.forEach(el2 => {

          formBuilderJson[el2.columnName + '_' + k] = ['', []];
          if (el2.required) {
              formBuilderJson[el2.columnName + '_' + k][1].push(Validators.required)
          }
          if (el2.minLength || el2.minLength == 0) {
              formBuilderJson[el2.columnName + '_' + k][1].push(Validators.minLength(el2.minLength))
          }
          if (el2.maxLength) {
              formBuilderJson[el2.columnName + '_' + k][1].push(Validators.maxLength(el2.maxLength))
          }
          if (el2.pattern) {
              formBuilderJson[el2.columnName + '_' + k][1].push(Validators.pattern(regExps[el2.pattern]))
          }

          if (el2.pattern || regExps[el2.type] != null) {
              formBuilderJson[el2.columnName + '_' + k][1].push(Validators.pattern(regExps[el2.type]))
          }
          if (el2.type === 'text') {
              formBuilderJson[el2.columnName + '_' + k][1].push(this.whiteSpaceValidator)
          }

          if (el2.minLength || el2.minLength == 0) {
              formBuilderJson[el2.columnName + '_' + k][1].push(Validators.min(0))
          }

          if (el2.max > 0) {
              formBuilderJson[el2.columnName + '_' + k][1].push(Validators.max(el2.max))
          }
      });

      let formGroup: FormGroup = this.formBuilder.group(formBuilderJson);
      for (let control in formGroup.controls)
          this.sdrcForm.addControl(control, formGroup.controls[control])
  }

  public setNewQuestionSet(field) {
      this.firstIntanceQuestion = field;
      Array.prototype.push.apply(this.questionUIArray, field);
  }

  radioChange(val, field) {
      field.value = val;
      if (field.columnName === "subScheme") {
          this.questionUIArray.some(eachQ => {
              if (eachQ.columnName === "parentSchemeId") {
                  eachQ.controlType = field.value ? "dropdown" : "hidden";
                  eachQ.required = field.value ? true : false;
                  let parentSchemeId = this.sdrcForm.get("parentSchemeId");
                  if (field.value && parentSchemeId) {
                      parentSchemeId.setValidators([Validators.required]);
                      parentSchemeId.enable()
                  } else {
                      this.sdrcForm.get(eachQ.columnName).setValue(null);
                      parentSchemeId.clearValidators();
                      parentSchemeId.disable();
                  }
                  this.formService.validateForm(this.sdrcForm);
                  return true;
              }
          });
      }
  }

  /**
*
* Add a tag to tag list
* 
*/
  add(event: MatChipInputEvent, key: number): void {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
          this.tags.push({ name: value.trim() });
          this.questionUIArray[this.questionUIArray.findIndex(d => d.key == key)].value.push(value.trim())
      }

      // Reset the input value
      if (input) {
          input.value = '';
      }
  }

  /**
   * Remove a tag from the tag list
   * 
   */
  //   @ViewChild('chipList') chipList;
  remove(tag: Tag, field): void {
      const index = this.questionUIArray[this.questionUIArray.findIndex(d => d.key == field.key)].value.indexOf(tag);

      if (index >= 0) {
          this.tags.splice(index, 1);
          this.questionUIArray[this.questionUIArray.findIndex(d => d.key == field.key)].value.splice(index, 1);
      }

  }

  removeFile(tag: Tag, field): void {
      field.value = null;
      this.sdrcForm.controls[field.columnName].setValue(null);
      return null;
      const index = field.value.indexOf(tag);
      if (!field.deletedFileValue) {
          field.deletedFileValue = []
      }
      field.deletedFileValue.push(tag);
      if (index >= 0) {
          field.value.splice(index, 1);
          // this.questionUIArray[this.questionUIArray.findIndex(d => d.key == field.key)].value.splice(index, 1);
      }
      if (field.value.length === 0 && field.required) {
          field.value = [];
          // this.chipList.errorState = true;
          this.sdrcForm.controls[field.columnName].setErrors({ 'required': true });
      }
  }
  /**
   * checkbox change event handled
   */
  checkboxChange(item, field) {
      field.options.forEach(eachOption => {
          eachOption.checked = false;
      })
      item.checked = !item.checked;
      if (field.required) {
          let count: number = 0;
          field.options.forEach(element => {
              if (element.checked)
                  count++;
          })
          if (count == 0)
              this.sdrcForm.controls[field.columnName].setErrors({ 'required': true });
      }
  }

  isASingleCheckBox(controlInput) {
      return controlInput.controlType === "checkbox" && controlInput.options && controlInput.options.length == 1;
  }

  /**
   * select all option in multiselect
   */
  checkUncheckAllSelection(field) {
      field.allChecked = !field.allChecked;
      if (field.allChecked) {
          let allOptionKeys = [];
          field.options.forEach(opt => {
              if (allOptionKeys.indexOf(opt.key) == -1) {
                  allOptionKeys.push(opt.key)
              }
          });
          field.value = allOptionKeys;
      }
      else {
          field.value = [];
      }
  }

  validateAllOptionSelected(field) {
      let allOptionKeys = JSON.parse(JSON.stringify(field.value));
      if (allOptionKeys.length == field.options.length) {
          return true
      }
      if (allOptionKeys.length < field.options.length) {
          return false
      }
  }

  trackByfn(index, question) {
      return question.indexNumberTrack;
  }

  scrollToTop() {
      window.scroll({
          top: 55,
          left: 0,
          behavior: 'smooth'
      });
  }

  resetAndScrollUp() {
      this.reset();
      this.scrollToTop();
  }

  reset() {
      Object.keys(this.sdrcForm.controls).forEach(key => {
          if (!this.sdrcForm.get(key).disabled)
              this.sdrcForm.get(key).reset();
      });

      this.innerSchemeTableBody.forEach(eachIndicator => eachIndicator.isSelected = false);
      this.goalWiseSelectedInd = [];
      this.questionUIArray = this.cloneObject([...this.questionArray]);
      this.createForm();
      this.update = false;
      this.index = 0;
      this.sdrcForm.markAsUntouched();
      this.sdrcForm.markAsPristine();
  }

  cloneObject(object) {
      return JSON.parse(JSON.stringify(object));
  }
  getMappedKeyName(columnName) {
      let mapper = this.selectedSectionData.mapperTableForm;
      let mappedKey = mapper && mapper[columnName] ? mapper[columnName] : columnName;
      return mappedKey;
  }

  createIndicatorFormConfig(indicators) {
      let config = [
          {
              controlType: Constants.formConstants.formArray,
              columnName: "group",
              validators: [Validators.required],
              formInputs: []
          }
      ]
      indicators.forEach((eachIndicator, index) => {
          let eachIndicatorConfig = {
              controlType: Constants.formConstants.formGroup,
              columnName: index,
              validators: [Validators.required],
              formInputs: [
                  {
                      controlType: Constants.formConstants.formArray,
                      columnName: "areaWiseYearTargets",
                      validators: [Validators.required],
                      formInputs: []
                  },
                  {
                      controlType: "text",
                      type: "text",
                      columnName: "indName",
                      value: eachIndicator.indName,
                      validators: [Validators.required]
                  },
                  {
                      controlType: "text",
                      type: "text",
                      columnName: "unitName",
                      value: eachIndicator.unitName,
                      validators: [Validators.required]
                  },
                  {
                      controlType: "hidden",
                      type: "text",
                      columnName: "indId",
                      value: this.sdrcForm.get("id").value || eachIndicator.indId,
                      validators: [Validators.required]
                  },
                  {
                      controlType: "hidden",
                      type: "text",
                      columnName: "performanceType",
                      value: eachIndicator.performanceType,
                      validators: [Validators.required]
                  },
                  {
                      controlType: "hidden",
                      type: "text",
                      columnName: "status",
                      value: eachIndicator.indStatus || true,
                      validators: [Validators.required]
                  },
              ]
          };
          eachIndicator.areaWiseYearTargets.map((eachArea, areaIndex) => {
              let eachAreaConfig = {
                  controlType: Constants.formConstants.formGroup,
                  columnName: areaIndex,
                  validators: [Validators.required],
                  formInputs: [
                      {
                          controlType: Constants.formConstants.formArray,
                          columnName: "yearWiseTargets",
                          validators: [Validators.required],
                          formInputs: []
                      },
                      {
                          controlType: "text",
                          type: "text",
                          columnName: "areaId",
                          value: eachArea.areaId,
                          validators: [Validators.required]
                      },
                      {
                          controlType: "text",
                          type: "text",
                          columnName: "areaName",
                          value: eachArea.areaName,
                          validators: [Validators.required]
                      },
                  ]
              };

              let yearWiseValues = eachArea.yearWiseTargets.filter((ele, eleIndex) => eleIndex && eleIndex < 17).sort(() => -1);
              eachArea.yearWiseTargets = yearWiseValues;
              yearWiseValues.forEach((eachValue, valueIndex) => {
                  let eachYearTarget = {
                      controlType: Constants.formConstants.formGroup,
                      columnName: valueIndex,
                      validators: [Validators.required],
                      formInputs: [

                          {
                              controlType: "text",
                              type: "text",
                              columnName: "fYear",
                              value: eachValue.fyear,
                              validators: [Validators.required]
                          },
                          {
                              controlType: "text",
                              type: "text",
                              columnName: "target",
                              value: eachValue.target,
                              required: (valueIndex == 0 || valueIndex == (yearWiseValues.length - 1)),
                              validators: (valueIndex == 0 || valueIndex == (yearWiseValues.length - 1)) ? [Validators.required] : [],
                          },
                      ]
                  };
                  eachAreaConfig.formInputs[0].formInputs.push(eachYearTarget);
                  // let yearValue = {
                  //     controlType: "number",
                  //     type: "number",
                  //     required: (valueIndex == 0 || valueIndex == (yearWiseValues.length - 1)),
                  //     columnName: eachValue.fyear,
                  //     value: yearWiseValues[eachValue.fyear] || 0,
                  //     validators: [CustomValidatorsService.numberRange]
                  // }
                  // eachAreaConfig.formInputs[0].formInputs.push(yearValue);
              });
              eachIndicatorConfig.formInputs[0].formInputs.push(eachAreaConfig);
          })

          config[0].formInputs.push(eachIndicatorConfig);
      });

      console.log("fc", config);
      this.indicatorsFormConfig = config;
      console.log("fc-va", this.indicatorsFormConfig);
      this.indicatorsFG = <FormGroup>this.formService.createReactiveForm(config).controls['group'];
      console.log("fg", this.indicatorsFG);
      this.sdrcForm.removeControl("values");
      this.sdrcForm.addControl("values", this.indicatorsFG)
      console.log("sdrc", this.sdrcForm);
  }

  tableActionClicked(emittedData) {
      // rowObj.preventDefault();
      let selectedRowData = emittedData.rowObj;
      if (emittedData.target.includes('edit')) {
          this.fileExtValidationMessage = "";
          this.reset();
          /* District MDM file handeling START*/
          if (this.selectedSectionData.leftsubmenuName == "District" && selectedRowData.mapFilePath) {
              let payload = { "params": { mapFilePath: selectedRowData.mapFilePath } }
              this.cmsService.getDataWithHeaders(this.selectedSectionData.apis.downloadShapeFile, payload)
                  .subscribe((res) => {
                      let data = res.body;
                      this.questionUIArray.some(eachControlConfig => {
                          let key = "topoJsonFile";
                          let flag = eachControlConfig.columnName === key;
                          if (res && flag) {
                              let contentDesc = res.headers.get("content-disposition");
                              let fileName = contentDesc ? contentDesc.split('"')[1] : "file.json";
                              let jsonFile = new File([JSON.stringify(data)], fileName, { type: 'application/json' });
                              jsonFile["originalName"] = jsonFile["name"];
                              eachControlConfig.value = emittedData.rowObj[key] = contentDesc ? [jsonFile] : null;
                              this.sdrcForm.get(key).setValue([jsonFile]);
                          }
                          return !res || flag;
                      })
                  })
          }
          /* District MDM file handeling END*/
          else if (this.selectedSectionData.leftsubmenuName == "Indicator") {
              let payload = { "params": { "id": selectedRowData.indId } }
              this.cmsService.getApiData(this.selectedSectionData.apis.viewDetails, payload)
                  .subscribe((res) => {
                      let data = res;
                      if (data && typeof data === "object") {
                          this.questionUIArray.forEach(eachControlConfig => {
                              if (eachControlConfig.columnName) {
                                  let defaultValue = ["multiselect"].includes(eachControlConfig.controlType) ? [] : "";
                                  Object.keys(data).includes(eachControlConfig.columnName) && data[eachControlConfig.columnName] != null ? eachControlConfig.value = data[eachControlConfig.columnName] : defaultValue;
                                  let columnKey = this.getMappedKeyName(eachControlConfig.columnName);
                                  this.sdrcForm.controls[columnKey].setValue(eachControlConfig.value);
                                  /* UPDATING DEPENDENCIES */
                                  this.dependenciesChecking(eachControlConfig);
                                  /* UPDATING DEPENDENCIES */
                              }
                              if (["sdgTargetId", "goalId"].includes(eachControlConfig.columnName)) {
                                  this.sdrcForm.get(eachControlConfig.columnName).disable();
                              }
                          });
                      }
                  })
          }
          else if (this.selectedSectionData.leftsubmenuName == "Scheme") {
              let goalWiseSelectedIndicator = [];
              let selectedIndicators = [];
              selectedIndicators = this.innerSchemeTableBody.filter(eachIndicator => {
                  if (selectedRowData.indicators.includes(eachIndicator.indId)) {
                      eachIndicator.isSelected = true;
                      return eachIndicator;
                  }
                  return false;
              });

              this.getGoalWiseSelectedIndicators(selectedIndicators, goalWiseSelectedIndicator);
              this.goalWiseSelectedInd = goalWiseSelectedIndicator;
          }
          else if (this.selectedSectionData.leftsubmenuName == "User") {
              this.questionUIArray.forEach(eachQuestion => {
                  if (selectedRowData.id === 1 && eachQuestion.columnName == "departmentId") {
                      this.sdrcForm.get("departmentId").disable();
                      eachQuestion.controlType = "hidden";
                      eachQuestion.required = false;
                  }
                  if (["confirmPassword", "password"].includes(eachQuestion.columnName)) {
                      eachQuestion.controlType = "hidden";
                      eachQuestion.required = false;
                      eachQuestion.value = null;
                      this.sdrcForm.get(eachQuestion.columnName).setValidators([]);
                      this.formService.validateForm(this.sdrcForm);
                  }
              })

          } else if (this.selectedSectionData.leftsubmenuName == "Target-Value") {
              let payload = { "params": { "indicatorId": selectedRowData.indId } }
              this.cmsService.getApiData(this.selectedSectionData.apis.viewDetails, payload)
                  .subscribe((res) => {
                      let data = res[0];
                      this.indicatorWiseTargetValue = data;
                      let areaWiseYearTargets = data.areaWiseYearTargets;
                      // this.questionUIArray[0].options = areaWiseYearTargets.map((eachArea, areaIndex) => { return { "areaId": eachArea.areaId, "areaName": eachArea.areaName, areaIndex } });
                      // this.questionUIArray[0].value = this.questionUIArray[0].options[0];
                      // this.sdrcForm.get("areaLevel").setValue(this.questionUIArray[0].value);
                      let targetValueForm = this.createIndicatorFormConfig(res);
                  });
          }
          /* Update form group START */
          Object.keys(this.sdrcForm.controls).forEach(key => {
              let columnKey = this.selectedSectionData.mapperTableForm && this.selectedSectionData.mapperTableForm[key] ? this.selectedSectionData.mapperTableForm[key] : key;
              if (selectedRowData.hasOwnProperty(key) || selectedRowData.hasOwnProperty(columnKey))
                  // !columnKey ? columnKey = key : '';
                  if (key === "authoritiesIds" || columnKey === "authoritiesIds" || key === "indicatorIds") {
                      let ids = emittedData.rowObj[columnKey || key].map(item => typeof item === "object" ? item.id : item);
                      this.sdrcForm.get(key).setValue(JSON.parse(JSON.stringify(ids)));
                  } else {
                      let valueToBeUpdated = emittedData.rowObj[columnKey || key];
                      this.sdrcForm.get(key).setValue(valueToBeUpdated == 0 && typeof valueToBeUpdated == "number" ? valueToBeUpdated.toString() : valueToBeUpdated);

                  }
          });
          /* Update form group END */

          /* Update form config START */
          this.updateFormConfig(emittedData);
          /* Update form config END */

          this.formService.validateForm(this.sdrcForm);


          this.index = emittedData.rowObj['slNo'];
          this.update = true;
          this.toggleFormDisplay(true);
          this.scrollToTop();
          // document.body.scrollTop = document.documentElement.scrollTop = 0;
      }
      else if (emittedData.target.includes('delete')) {

          const dialogRef = this.dialog.open(ConfirmationDailogComponent,
              { width: '400px', disableClose: true, data: { msg: `Are you sure you want to delete this ${this.selectedSectionData.leftsubmenuName.toLowerCase()}?`, button: 'Delete' } });
          dialogRef.afterClosed().subscribe(result => {
              if (result) {
                  this.index = emittedData.rowObj['index'];
                  this.update = true;
                  let data = {
                      contentId: this.selectedSectionData.leftmenuId,
                      index: this.index,
                      update: this.update
                  }

                  this.cmsService.deleteData(data).subscribe(data => {
                      if (data.statusCode == 200) {
                          this.index = 0;
                          this.update = false;
                          // this.toastr.success(data.message)
                          this.cmsService.getCMSleftData().subscribe(d => {
                              this.sectionData = d;
                          })
                      }
                      else {

                      }
                      // this.toastr.error(data.message)
                  }, error => {
                      // this.toastr.error(error.error.message)
                  })
              }
          });
      }
      else if (emittedData.target.includes('preview')) {
          this.title = emittedData.rowObj.q4[0].originalName;
          let filepath = emittedData.rowObj.q4[0].filePath
          this.url = this.domSanizitizer.bypassSecurityTrustResourceUrl(Constants.HOME_URL + 'anonymous/getFile?fileName=' + filepath + '&originalFileName=' + this.title)
          $("#myModal").modal("show");
      }
      else if (emittedData.target.includes('openFile')) {
          this.title = emittedData.rowObj.q4[emittedData.fileIndex].originalName;
          let filepath = emittedData.rowObj.q4[emittedData.fileIndex].filePath
          this.url = this.domSanizitizer.bypassSecurityTrustResourceUrl(Constants.HOME_URL + 'anonymous/getFile?fileName=' + filepath + '&originalFileName=' + this.title)
          $("#myModal").modal("show");
      }
      else if (emittedData.target.includes('cms-approve')) {
          const dialogRef = this.dialog.open(ConfirmationDailogComponent,
              { width: '400px', disableClose: true, data: { msg: 'Are you sure you want to approve this record?', button: 'Approve' } });
          dialogRef.afterClosed().subscribe(result => {
              if (result) {
                  this.index = emittedData.rowObj['index'];
                  this.update = true;
                  let data = {
                      contentId: this.selectedSectionData.leftmenuId,
                      index: this.index,
                      update: this.update
                  }

                  this.cmsService.approveData(data).subscribe(data => {
                      if (data.statusCode == 200) {
                          this.index = 0;
                          this.update = false;
                          // this.toastr.success(data.message)
                          this.cmsService.getCMSleftData().subscribe(d => {
                              this.sectionData = d;
                          })
                      }
                      else {
                          // this.toastr.error(data.message)
                      }
                  }, error => {
                      // this.toastr.error(error.error.message)
                  })
              }
          });
      }
      else if (emittedData.target.includes('enableDisable')) {
          let desiredStatus = emittedData.extraData.isChecked ? 'Disable' : 'Enable';
          const dialogRef = this.dialog.open(ConfirmationDailogComponent,
              { width: '400px', disableClose: true, data: { msg: `Are you sure you want to ${desiredStatus.toLowerCase()} this ${this.selectedSectionData.leftsubmenuName.toLowerCase()}?`, button: desiredStatus } });
          dialogRef.afterClosed().subscribe(result => {
              if (result) {
                  this.index = emittedData.rowObj['slNo'];
                  this.update = true;
                  if (this.selectedSectionData.leftsubmenuName === "Scheme") {
                      emittedData.rowObj[emittedData.actionItem.mappedKey] = emittedData.rowObj[emittedData.actionItem.mappedKey] === "Active" ? true : false;
                  }
                  let body = this.prepareResquestData(emittedData.rowObj);
                  let qParams = this.extractParams(body, emittedData.actionItem.queryParamMap);
                  let payload = {
                      params: qParams,
                      body: qParams
                  }
                  this.cmsService.enableDisableData(payload, this.selectedSectionData.apis.enableDisable)
                      .subscribe(data => {
                          this.index = 0;
                           this.update = false;
                          this.fetchAllData(this.selectedSectionData);
this.toaster.success(`The ${this.selectedSectionData.leftsubmenuName.toLowerCase()} has been ${desiredStatus.toLowerCase()}d successfully `);

                      }, error => {
                          let actionItem = emittedData.actionItem;
                          let rowData = emittedData.rowObj;
                          rowData[actionItem.mappedKey] = rowData[actionItem.mappedKey] === actionItem.activeValue ? actionItem.inactiveValue : actionItem.activeValue;

                      })
              } else {
                  let actionItem = emittedData.actionItem;
                  let rowData = emittedData.rowObj;
                  rowData[actionItem.mappedKey] = rowData[actionItem.mappedKey] === actionItem.activeValue ? actionItem.inactiveValue : actionItem.activeValue;
              }
              this.cdRef.markForCheck();
              this.cdRef.detectChanges();
          });
      }
      else if (emittedData.target.includes('checkbox')) {
          if (this.selectedSectionData.leftsubmenuName == "Scheme") {
              let selectedIndicators = [];
              let goalWiseSelectedIndicator = [];
              let selectedIndicatorIds = [];

              selectedIndicators = this.innerSchemeTableBody.filter(eachItem => {
                  return eachItem.isSelected;
              });

              selectedIndicatorIds = this.getGoalWiseSelectedIndicators(selectedIndicators, goalWiseSelectedIndicator);
              this.goalWiseSelectedInd = goalWiseSelectedIndicator;
              this.questionUIArray.some(eachQ => {
                  if (eachQ.columnName == "indicatorIds") {
                      eachQ.value = selectedIndicatorIds;
                      return true;
                  }
              });
              this.sdrcForm.get("indicatorIds").setValue(selectedIndicatorIds);
              console.log(this.goalWiseSelectedInd);
          }
      }
      else if (emittedData.target.includes('reset-password')) {
          this.toggleFormDisplay(false);
          this.changePassword['userId'] = selectedRowData.id;
          this.changePasswordForm.get("userId").setValue(selectedRowData.id);
          this.changePassword['display'] = true;
          $('#changePasswordModal').modal('show');
      }
  }


  changePasswordApi() {
      let payload = {
          body: this.changePasswordForm.value
      }
      this.cmsService.saveUpdateData(payload, "resetPassword").subscribe(res => {
          this.destroyModalData();
          this.toaster.success(`Password has been reset successfully`)
          console.log(res);
      })
  }

  getGoalWiseSelectedIndicators(selectedIndicators, goalWiseSelectedIndicator): any[] {
      let goalsIds = []
      let goalIndexes = {}
      return selectedIndicators.map(eachItem => {
          if (goalsIds.includes(eachItem.goalId)) {
              goalWiseSelectedIndicator[goalIndexes[eachItem.goalId]]['indicators'].push(eachItem);
          } else {
              let goalItem = {
                  "goalId": eachItem.goalId,
                  "goalName": eachItem.goalName,
                  "indicators": [eachItem]
              }
              goalIndexes[eachItem.goalId] = goalWiseSelectedIndicator.length;
              goalsIds.push(eachItem.goalId);
              goalWiseSelectedIndicator.push(goalItem);
          }
          return eachItem.indId;
      });
  }

  updateFormConfig(emittedData) {
      /* Update form config START */
      for (let i = 0; i < this.questionUIArray.length; i++) {
          let currentFieldConfig = this.questionUIArray[i];
          let key = currentFieldConfig.columnName;
          let columnKey = this.selectedSectionData.mapperTableForm && this.selectedSectionData.mapperTableForm[key] ? this.selectedSectionData.mapperTableForm[key] : key;
          if (emittedData.rowObj.hasOwnProperty(columnKey)) {

              let valueToBeUpdated = emittedData.rowObj[columnKey];
              /* update date picker value START*/
              if (currentFieldConfig.controlType == 'datepicker') {
                  let dateString = valueToBeUpdated;
                  let dateParts: any = dateString.split("/");
                  // month is 0-based, that's why we need dataParts[1] - 1
                  let dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
                  currentFieldConfig.value = dateObject;
              }
              /* update date picker value END*/
              /* update all values START*/
              else {
                  if (columnKey === "authoritiesIds" || key === "authoritiesIds") {
                      let ids = valueToBeUpdated.map(item => item.id);
                      currentFieldConfig.value = JSON.parse(JSON.stringify(ids));
                  } else {
                      currentFieldConfig.value = JSON.parse(JSON.stringify(valueToBeUpdated))
                  }
              }
              /* update all values END*/

              /* UPDATING DEPENDENCIES */
              this.dependenciesChecking(currentFieldConfig);
              /* UPDATING DEPENDENCIES */

          }

          // if (this.sdrcForm.get(key))
          //     this.sdrcForm.get(key).enable();
      }
      /* Update form config END */
  }

  dependenciesChecking(currentFieldConfig) {
      /* UPDATING DEPENDENCIES START */
      /* Handel multiselect selection change START*/
      if (currentFieldConfig.controlType == 'multiSelect') {
          this.multiSelectOnChange(currentFieldConfig);
      }
      /* Handel multiselect selection change END*/

      /* Handel dropdown change START*/
      else if (currentFieldConfig.controlType == 'dropdown') {
          this.dropdownSelectOnChange(currentFieldConfig);
      }
      /* Handel dropdown change END*/

      /* Handel dropdown change START*/
      else if (currentFieldConfig.controlType == 'radio') {
          this.radioChange(currentFieldConfig.value, currentFieldConfig);
      }
      /* Handel dropdown change END*/

      /* UPDATING DEPENDENCIES END */
  }

  extractParams(input, mapKeys) {
      let result = {};
      if (mapKeys && mapKeys.length) {
          mapKeys.forEach(element => {
              result[element.reqKey] = input[element.valueKey];
          });
      }
      return result;
  }

  enableData() {
      for (let index = 0; index < this.questionUIArray.length; index++) {
          this.questionUIArray[index].disabled = false;
      }
      this.createForm();
  }

  cancelData() {
      for (let index = 0; index < this.questionUIArray.length; index++) {
          this.questionUIArray[index].disabled = true;
      }
      this.createForm();
  }

  showLists() {
      $(".left-list").attr("style", "display: block !important");
      $('.mob-left-list').attr("style", "display: none !important");
  }

  destroyModalData() {
      this.url = "";
      $('#myModal').modal('hide');
      $('#changePasswordModal').modal('hide');
      this.resetChangePassword();
      this.changePasswordForm.reset();
  }

  prepareResquestData(rowObj) {
      let data = {};
      this.questionUIArray.forEach(eachControlConfig => {
          const key = eachControlConfig.columnName;
          let mapper = this.selectedSectionData.mapperTableForm;
          let columnKey = mapper && mapper[key] ? this.selectedSectionData.mapperTableForm[key] : key;
          if (eachControlConfig.columnName && eachControlConfig.controlType == 'datepicker')
              data[key] = this.datepipe.transform(rowObj[columnKey], 'dd/MM/yyyy');
          if (columnKey && eachControlConfig.controlType == 'file') { }
          else if (key)
              data[key] = rowObj[columnKey];
      })
      return data;
  }

  prepareformData(data, reqObj): any {
      // var data: FormData = new FormData();
      this.questionUIArray.forEach(d => {
          if (d.columnName && d.controlType == 'file')
              data.append(d.columnName, reqObj[d.columnName][0]);
          else if (d.columnName)
              data.append(d.columnName, reqObj[d.columnName])
      });
      return data;
  }

  includes(array: any[], item) {
      if (isArray(array) && item) {
          return array.includes(item);
      }
      return false;
  }

  toggleAndResetForm(value?) {
      this.toggleFormDisplay(value);
      this.reset();
  }

  toggleFormDisplay(value?) {
      let desiredValue = value != null ? !value : this.showForm;
      this.showForm = !desiredValue;
  }

  getDropdownOptions(field) {
      if (!field) {
          return []
      }
      switch (this.selectedSectionData.leftsubmenuName) {
          case 'Scheme':
              if (field['columnName'] == "parentSchemeId") {
                  let allSchemes = this.selectedSectionData["tableBody"] || [];
                  field.options = allSchemes.filter(schemeId => schemeId.id != this.sdrcForm.get("id").value);
              }
              break;
      }
      // return field.options;
  }

  dropdownSelectOnChange(field) {
      if (field && field.options && field.optionKey && field.options[0] && (typeof field.value === "boolean")) {
          field.value = field.value.toString();
          this.sdrcForm.get(field.columnName).setValue(field.value);
      }

      if (this.selectedSectionData.leftsubmenuName === "Indicator" && field.columnName === "goalId") {
          let sdgTargetId = this.sdrcForm.get("sdgTargetId");
          this.questionUIArray.some(eachQuestion => {
              if (eachQuestion.columnName === "sdgTargetId") {
                  field.value ? sdgTargetId.enable() : sdgTargetId.disable();
                  field.value ? sdgTargetId.setValue('') : '';
                  eachQuestion.value = '';
                  let extras = this.selectedSectionData["extras"];
                  eachQuestion.options = extras && extras["goalWisetargets"] ? extras["goalWisetargets"][field.value] || [] : [];
                  return true;
              }
              return false;
          })
      } else if (this.selectedSectionData.leftsubmenuName === "User" && field.columnName === "areaLevel") {
          this.questionUIArray.forEach(eachQuestion => {
              if (eachQuestion.columnName === "areaId") {
                  let isAreaLevelState = field.value === 2;
                  eachQuestion.controlType = isAreaLevelState ? "hidden" : "dropdown"
                  isAreaLevelState ? eachQuestion.value = '' : '';
                  isAreaLevelState ? eachQuestion.required = false : '';
                  isAreaLevelState ? this.sdrcForm.get("areaId").disable() : this.sdrcForm.get("areaId").enable();
              }
          })
      } else if (this.selectedSectionData.leftsubmenuName === "Indicator" && field.columnName === "hasProxy") {
          let isChecked = field.value == true || field.value == "true";
          let proxyIndicatorIds = this.sdrcForm.get("proxyIndicatorIds");
          proxyIndicatorIds.setValue([]);
          this.questionUIArray.some(eachQ => {
              if (eachQ.columnName === "proxyIndicatorIds") {
                  eachQ.controlType = (isChecked ? "multiSelect" : "hidden");
                  eachQ.required = isChecked;
                  eachQ.value = [];
                  this.sdrcForm.get(eachQ.columnName).setValue(null);
                  return true;
              }
              return false;
          })
          proxyIndicatorIds && isChecked ? proxyIndicatorIds.enable() : proxyIndicatorIds.disable();
      } else if (this.selectedSectionData.leftsubmenuName === "Target-Value" && field.columnName === "departmentName") {
          this.selectedSectionData.tableBody = this.selectedSectionData.extras.departmentWiseIndicators[this.selectedDepartment].map((eachColumn, index) => {
              this.selectedSectionData.action.length > 0 ? eachColumn["action"] = this.selectedSectionData.action : '';
              return { "slNo": index + 1, ...eachColumn }
          });

      }
  }

  hasUserAccessToMDM(authoritiesTyeps: LowerLevelAuthorityTyeps, permissionBelongsTo?) {
      permissionBelongsTo = permissionBelongsTo || this.selectedSectionData.leftsubmenuName || "";
      return this.authorities.hasAccess(HighLevelAuthoritiesKey.MDM, HighLevelAuthorityType.specified, (permissionBelongsTo).toString(), authoritiesTyeps);
  }

  getTextFieldErrors(fc: FormControl, field) {
      let errorMSG = [];
      fc.hasError("required") ? errorMSG.push('Please provide ' + field.label) : '';
      fc.hasError("pattern") ? errorMSG.push(this.errors[field.type]) : '';
      fc.hasError("maxlength") ? errorMSG.push(field.label + ' should be maximum ' + fc.getError("maxlength").requiredLength + ' character') : '';
      fc.hasError("minlength") ? errorMSG.push(field.label + ' should be minimum ' + fc.getError("minlength").requiredLength + ' character') : '';
      fc.hasError("whiteSpace") ? errorMSG.push('Blank space are not allowed') : '';
      fc.hasError("password") ? errorMSG.push(this.errors.password) : '';
      fc.hasError("passwordMatch") ? errorMSG.push(this.errors.passwordMatch) : '';
      fc.hasError("min") ? errorMSG.push(field.label + ` should be minimum ${field.min || 1}`) : '';
      fc.hasError("max") ? errorMSG.push(field.label + ' should be maximum ' + field.max) : '';
      fc.hasError("email") ? errorMSG.push(this.errors.email) : '';
      return errorMSG[0];
  }
  innerSchemeColumns = ["slNo", "goalName", "indicatorName", "action"];
  goalWiseSelectedInd = [];
  innerSchemeTableBody = [];
  departmentList = [];
  selectedDepartment = null;
  consoleLog(...items) {
      console.log(items);
  }

}

export interface Tag {
  name: string;
}

export class ConfirmValidParentMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      return control.parent.invalid && control.touched;
  }
}

export const regExps: { [key: string]: RegExp } = {
  // password: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/,
  // email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  // name: /^[a-zA-Z ]{1,50}$/,
  // phone: /^([0-9]{10,11})$/,
  // domiwebsite: /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/,
  url: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
  // organization: /^[a-zA-Z0-9 ]{1,50}$/,
  // landlinephone: /^[0-9]\d{2,4}-\d{6,8}$/,
  // pincode: /^((?!(0))[0-9]{6})$/,
  videoRegex: /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$|^(?:https?:\/\/)?(?:www\.)?dailymotion.com\/(video|hub)+(\/([^_]+))?[^#]*(‪#‎video‬=([^_&]+))?$|^(?:https?:\/\/)?(?:www\.)?vimeo.com\/([0-9]+)$/,
  textFiledRegex: /^[^.\s]/,
  noWhiteSpaceAtBegining: /^[^.\s]/
};

export const errorMessages: { [key: string]: string } = {
  password: 'The password field should accept minimum 8 to maximum 13 characters and at least one uppercase, lowercase, numeric, special character ',
  passwordMatch: 'New Password and Confirm Password didn\'t match',
  email: 'Please enter valid email in the formart example@email.domain',
  // name: 'Please provide valid name',
  // phone: 'Please provide valid phone no',
  // domiwebsite: 'Please provide valid website',
  url: 'Please provide valid URL',
  // landlinephone: 'Please provide valid phone no',
  // pincode: 'Please provide valid pincode',
  videoRegex: 'Please provide valid video link (required a (youtube/vimeo/dailymotion) link.)',
  textFiledRegex: 'Spaces are not allowed at beginning',
  form: "form is not valid",
  frequency: "Sum of Data Collection Days and Data Rejection Days should not exceed 28 DAYS"
};

export const AREA_LEVEL_ID = [
  {
      "id": 2,
      "name": "State"
  },
  {
      "id": 3,
      "name": "District"
  }
]