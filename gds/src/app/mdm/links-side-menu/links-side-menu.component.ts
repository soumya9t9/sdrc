import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-links-side-menu',
  templateUrl: './links-side-menu.component.html',
  styleUrls: ['./links-side-menu.component.scss']
})
export class LinksSideMenuComponent implements OnInit {

  router: Router;
  app: AppService;
  constructor(router:Router, appService: AppService) {
    this.router = router;
    this.app = appService;
   }

  ngOnInit() {
  }

}
