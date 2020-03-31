import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataentryService } from '../dataentry.service';
import saveAs from 'save-as';
import { Constants } from 'src/app/constants';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { error } from 'util';
import { Router } from '@angular/router';
import { environment } from '@src/environments/environment';
declare var $:any;
@Component({
  selector: 'app-data-entry-view',
  templateUrl: './data-entry-view.component.html',
  styleUrls: ['./data-entry-view.component.scss']
})
export class DataEntryViewComponent implements OnInit {
  
  dataentryService: DataentryService;
  form: NgForm;
  uploadFileDetails: any;
  validationMsg: any;
  allFrameWorks:any;
  selectedFrameworkId:number;
  errorMessage;
  fileName: string = '';
  file: any;
  currentFileUpload:boolean=false;
  TOOL_TIP = Constants.toolTip;

  constructor(private dataentryServiceProvider: DataentryService, private router: Router) {
    this.dataentryService = dataentryServiceProvider;
   }

  ngOnInit() {
  // this.dataentryService.getFramework().subscribe(res=>{
  //   this.allFrameWorks = res;
  // })
 
  }
  redirectToWebView() {
    this.router.navigateByUrl("data-entry/data-entry-web")
  }
   downloadFile(framework, form: NgForm) {  
    // if(this.selectedFrameworkId){
      this.dataentryService.downloadTemplate(framework).subscribe(
        (resp) => {
        // let data = resp.body
        //   saveAs(data, resp.headers.get('content-disposition').split("=")[1]);
        this.download({fileName: resp})
        },
        error => {
          this.errorMessage = "Some server issue occured. Please try after sometime";
          // this.errorMessage = error.message;
          $("#downloaderrModal").modal('show');
  
          // this.toastr.error(this.errorMessage)
        }
      );
    // }
 
  }
  uploadClicked(){
    this.uploadFileDetails = null;
    $('#fileUpload').click();
  }
  
  onFileChange(event,framework, form: NgForm){   
    this.uploadFileDetails = event.target.files[0];
    // this.fileName = $event.srcElement.files[0].name;
    const formdata: FormData = new FormData();
    formdata.append('file', this.uploadFileDetails);
      this.dataentryService.uploadDataentryTemplate(formdata).subscribe(response =>{
        $("#successModal").modal('show');
        event.target.value = ""
      },error =>{
        // this.validationMsg = Constants.SERVER_ERROR_MESSAGE;
        this.validationMsg = JSON.parse(error.error).message;
        $("#errModal").modal('show');
        event.target.value = ""
      })

 
  
 }

 baseUrl$ = environment.apiBaseUrl;
  /**
   * Download the report excel
   * @param data 
   */
  download(data) {
    if (data) {
      //data can be string of parameters or array/object
      data = typeof data == 'string' ? data : $.param(data);
      //split params into form inputs
      var inputs = '';
      let url = this.baseUrl$ + Constants.HOME_URL + 'api/v1/targetdataentry/downloadTarget';

      $.each(data.split('&'), function () {
        var pair = this.split('=');
        inputs += '<input type="hidden" name="' + pair[0] + '" value="' + pair[1] + '" />';
      });
      //send request
      $('<form action="' + url + '" method="post">' + inputs + '</form>')
        .appendTo('body').submit().remove();
    };
  }

  modalClose(){   
    this.uploadFileDetails = null;
   }

}
