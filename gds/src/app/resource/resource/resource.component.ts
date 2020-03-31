import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/app/constants';
import { Router, NavigationEnd } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

declare var $: any;

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss']
})
export class ResourceComponent implements OnInit {

  searchTexts: any;
  itemsPerPage: number = 5;
  p: number = 1;
  q: number = 1;
  url: any;
  activeTab: number = 1; //to reinitiate pagination page control

  constructor(private router: Router, private sanitizer: DomSanitizer) {
   }

  ngOnInit() {
    
  this.router.events.subscribe((evt) => {
    if (!(evt instanceof NavigationEnd)) {
      return;
    }
    window.scrollTo(0, 0)
  });



}
getName(filePath){
  return filePath.replace(/^.*[\\\/]/, '');
}
redirectTohome() {
  this.router.navigate(['']);
}
// openPDF(category){
//   // let url = 'assets/pdfs/abc.pdf'
//   this.url = this.sanitizer.bypassSecurityTrustResourceUrl(Constants.HOME_URL + 'downloadCmsDoc?fileName= '+category + '&inline='+ true);
// }
downloadFiles(fileName) {
  // this.staticService.download(fileName).subscribe(res=>{
  //   saveAs(res, fileName.split('resources/')[1])
  // })
  window.open(fileName, '_blank');
}
// openPDF(category){
//     this.url = this.sanitizer.bypassSecurityTrustResourceUrl(Constants.HOME_URL + 'downloadCmsDoc?fileName= '+category + '&inline='+ true);
//     $("#myModal").modal("show");
//   }

}
