import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-information-dailog',
  templateUrl: './information-dailog.component.html',
  styleUrls: ['./information-dailog.component.scss']
})
export class InformationDailogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
