import { Component, OnInit, Input, OnChanges, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { PaginatePipe } from 'ngx-pagination';
import { saveAs } from '@progress/kendo-drawing/pdf';
import save from 'save-as';
import { SearchPipePipe } from '../search-pipe.pipe';
import { Cookie } from 'ng2-cookies';
import { Router } from '@angular/router';
import { isArray } from 'util';
declare var $: any;

@Component({
  selector: 'sdrc-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges {
  tableData: any;
  totalData: any;
  isDesc: any;
  direction: number = 1;
  fixTableConfig: any = {};
  checkStatus: boolean = false;
  disableDeleteBtn: boolean = true;
  @Input() columns: any;
  columnValues: any[];
  disableRejectBtn: boolean = true;
  allTableData: any;
  selectedRowIndex: any;
  searchedData: any;
  userToken: any;
  @Input() districts: any[] = [];
  @Input() indicators: any[] = [];
  selectedDistrict: any;
  selectedIndicator: any;

  p: number = 1;
  searchFilter: string;
  @Input() id: string;
  @Input() rowData: any[];
  @Input() columnData: any[];
  @Input() maxTableHeight: string;
  @Input() excludedColumns: any[] = [];

  //on 3dmode
  @Input() isThreeDimension: boolean = false;
  @Input() threeDColumnData: any[];

  //keys for sorting and exclude sorting column from table-sorting.directive
  @Input() sorting: boolean;
  @Input() sortExcludeColumn: string[];

  //keys for paginate and itemsPerpage from table-paginate.directive
  @Input() isPaginate: boolean = false;
  @Input() itemsPerPage: number;

  //isHeaderFixed from table-headerfix.directive
  @Input() headerFixed: boolean = false;

  //searchBox from table-searchBox.directive.ts
  @Input() searchBox: boolean = false;
  @Input() rejectField: boolean = false;
  @Input() selectDropdown: boolean = false;
  //download Pdf and Excel table-downloadPdf.directive and table-downloadExcel.directive
  @Input() downloadPdf: boolean = false;
  @Input() pdfName: string;
  @Input() downloadExcel: boolean = false;
  @Input() excelName: string;
  @Input() excelHeadings: any[];

  //download pdf and excel by server side
  @Input() downloadPdfByServer: boolean = false;
  @Input() downloadExcelByServer: boolean = false;

  @Output() onActionButtonClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDownloadPdfByServerClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDownloadExcelByServerClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onViewDetailsClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onRejectSubmissionClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSupervisorSubmissionClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() dropdownSelected: EventEmitter<any> = new EventEmitter<any>();
  isTotalAvailable: boolean = false;
  @Input() siNoAvailable: boolean;
  array = Array;

  constructor(private router: Router,
    private cdRef: ChangeDetectorRef, ) {
  }

  ngOnInit() {

  }

  ngOnChanges() {

    this.p = 1;
    if (Cookie.check('user_details')) {
      this.userToken = JSON.parse(Cookie.get('user_details'));
    }
    if (this.rowData && !this.isPaginate)
      this.itemsPerPage = this.rowData.length;
    this.selectedRowIndex = null;
    this.searchFilter = null;
    setTimeout(() => {
      if (this.headerFixed && this.maxTableHeight > '600px')
        this.setDuplicateFixedTable();
      if (this.maxTableHeight) {
        $('#table-fixed-container' + this.id).css("max-height", this.maxTableHeight)
      }
    })
  }
  appendHttp(link: string) {
    if (!link.startsWith('http')) {
      return 'http://' + link;
    }
    else {
      return link;
    }
  }
  sort(property) {
    this.isDesc = !this.isDesc; //change the direction    
    this.columns = property;
    this.direction = this.isDesc ? 1 : -1;
  };
  setDuplicateFixedTable() {
    // $("#header-fixed").html("");
    this.fixTableConfig.headerHeight = $("#" + this.id + " > thead").height();
    this.fixTableConfig.width = $('#' + this.id).closest(".parent-tabl-container").width();
    $("#header-fixed" + this.id).height(this.fixTableConfig.headerHeight)
    $('#' + this.id + 'fixedcontainer').height(this.fixTableConfig.headerHeight)
    // if($("#"+this.id).parent()[0].scrollWidth == $("#"+this.id).parent()[0].clientWidth){
    if ($(window).width() <= 768) {
      $("#header-fixed" + this.id).width(this.fixTableConfig.width)
    }
    else {
      $("#header-fixed" + this.id).width(this.fixTableConfig.width - 16)
    }
    // }
    //$('#' + this.id + 'fixedcontainer').width($("#" + this.id).parent()[0].scrollWidth)

    setTimeout(() => {
      let tempThis = this;
      $("#header-fixed" + this.id + " th").each(function (index) {
        $(this).width($($("#" + tempThis.id + " th")[index]).width())
        $($("#" + tempThis.id + " th")[index]).width($($("#" + tempThis.id + " th")[index]).width())
      })
    }, 1000)
  }
  fixTableHeader(event) {
    var offset = $(event.target).scrollTop();
    $("#header-fixed" + this.id).scrollLeft($(event.target).scrollLeft())
    if (offset >= this.fixTableConfig.headerHeight) {
      $("#header-fixed" + this.id).css("display", "block");
    }
    else if (offset < this.fixTableConfig.headerHeight) {
      $("#header-fixed" + this.id).hide();
    }
  }
  clearSearchText() {
    this.searchFilter = "";
  }
  tableToExcel(id) {
    // console.log(table);
    let itemsPerPage = this.itemsPerPage;
    this.itemsPerPage = this.rowData.length;
    // setTimeout(()=>{
    //   let uri = 'data:application/vnd.ms-excel;base64,'
    //     , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>'
    //     , base64 = function(s) { return window.btoa(decodeURIComponent(encodeURIComponent(s))) }
    //     , format = function(s,c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
    //   if (!table.nodeType) table = document.getElementById(table)
    //    var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
    //    window.location.href = uri + base64(format(template, ctx))
    //    setTimeout(()=>{
    //     this.itemsPerPage = itemsPerPage;
    //    },1000)
    // }, 200)
    setTimeout(() => {
      var htmls = "";
      var uri = 'data:application/vnd.ms-excel;base64,';
      var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';
      var base64 = function (s) {
        return window.btoa(unescape(encodeURIComponent(s)));
      };

      var format = function (s, c) {
        return s.replace(/{(\w+)}/g, function (m, p) {
          return c[p];
        });
      };

      if (this.excelHeadings) {
        var tab_text = "";
        for (let i = 0; i < this.excelHeadings.length; i++) {
          const element = this.excelHeadings[i];
          tab_text = tab_text + "<div style='text-align: left; font-size: 20px; font-weight: bold'>" + Object.keys(element)[0] + ": " + Object.values(element)[0] + "</div>";
        }
        tab_text += "<table border='2px'>";
      }
      else
        var tab_text = "<table border='2px'>";
      var textRange; var j = 0;
      let tab = document.getElementById(id); // id of table

      for (j = 0; j < tab['rows'].length; j++) {
        if (j == 0)
          tab_text = tab_text + "<tr style='background-color: #eb9c73; color: #FFF; font-weight: bold' valign='top'>" + tab['rows'][j].innerHTML + "</tr>";
        else
          tab_text = tab_text + "<tr valign='top'>" + tab['rows'][j].innerHTML + "</tr>";
        //tab_text=tab_text+"</tr>";
      }

      tab_text = tab_text + "</table>";
      tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
      tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
      tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

      var ctx = {
        worksheet: 'Worksheet',
        table: tab_text
      };
      save(new Blob([tab_text], { type: "application/vnd.ms-excel" }), this.excelName + ".xls");
      setTimeout(() => {
        this.itemsPerPage = itemsPerPage;
      }, 500)
    }, 200)
  }
  getType(x) {
    return typeof x;
    // return isArray(x) ? "array": typeof x;
  }
  replaceComma(areaArray: string[]) {
    return areaArray.toString().replace(/,/g, ', ');
  }
  createPdf(target, containerId) {
    let tempHeight = $("kendo-pdf-export").find("#" + containerId).css("max-height");
    let itemsPerPage = this.itemsPerPage;
    let sorting = this.sorting;
    this.itemsPerPage = this.rowData.length;
    this.sorting = false;
    $("kendo-pdf-export").find("#" + containerId).scrollTop(0)
    setTimeout(() => {
      $("kendo-pdf-export").find("#" + containerId).css("max-height", "none")
      target.saveAs(this.pdfName + ".pdf")
      setTimeout(() => {
        this.itemsPerPage = itemsPerPage;
        this.sorting = sorting;
        $("kendo-pdf-export").find("#" + containerId).css("max-height", tempHeight)
      }, 1000);
    }, 200)
  }

  public actionClicked(btnClass, rowObj, index, actionItem?, extraData?): void {
    let emittedData: any = { target: btnClass, rowObj: rowObj, fileIndex: index, actionItem, extraData };
    this.onActionButtonClicked.emit(emittedData);
  }

  public downloadPdfByServerClicked(tableId, tableData): void {
    let emittedData: any = { table: tableId, tableData: tableData };
    this.onDownloadPdfByServerClicked.emit(emittedData);
  }

  public downloadExcelByServerClicked(tableId): void {
    this.searchedData = new SearchPipePipe().transform(this.rowData, this.searchFilter);
    let emittedData: any = { table: tableId, tableData: this.searchedData };
    this.onDownloadExcelByServerClicked.emit(emittedData);
  }

  public viewDetailsByClicked(tableRow, i) {
    this.selectedRowIndex = i;
    let emittedData: any = tableRow;
    this.onViewDetailsClicked.emit(emittedData);
  }

  public rejectSubmissionByClicked(tableRow, i) {
    this.selectedRowIndex = i;
    let emittedData: any = tableRow;
    this.onRejectSubmissionClicked.emit(emittedData);
  }

  public viewSuperVisorFormByClicked(tableRow, i) {
    this.selectedRowIndex = i;
    let emittedData: any = tableRow;
    this.onSupervisorSubmissionClicked.emit(emittedData);
  }

  districtSelected() {
    this.dropdownSelected.emit(this.selectedDistrict);
  }
  indicatorSelected() {
    this.dropdownSelected.emit(this.selectedIndicator);
  }

  reset() {
    this.selectedDistrict = '';
    this.dropdownSelected.emit(this.selectedDistrict);
  }

  checkChanged(btnClass, rowObj, index, actionItem: any) {
    let isChecked = rowObj[actionItem.mappedKey] === actionItem.activeValue;
    rowObj[actionItem.mappedKey] = isChecked ? actionItem.inactiveValue : actionItem.activeValue;
    this.actionClicked(btnClass, rowObj, index, actionItem, {isChecked});
    this.cdRef.detectChanges();
    return isChecked;
  }

  isChecked(rowDetails, actionItem, isChecked = "isChecked") {
    actionItem[isChecked] = (rowDetails[actionItem.mappedKey] == actionItem.activeValue);
    return actionItem[isChecked];
  }
}
