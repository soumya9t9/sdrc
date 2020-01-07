import { Component, OnInit } from '@angular/core';
import { HttpService, ApiParams } from '../../services/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-students',
  templateUrl: './all-students.component.html',
  styleUrls: ['./all-students.component.scss']
})
export class AllStudentsComponent implements OnInit {

  userList;
  constructor(private http:HttpService, private router:Router) { }

  ngOnInit() {
    this.getStudents();
  }

  getStudents() {
    let apiParams: ApiParams = {
      url: "students",
      method:"get"
    }
    this.http.apiCall(apiParams).subscribe(res => {
      if(res.status == "success" && res.data) {
        this.userList = res.data;
      }
    });

    // this.userList = [{
    //   id:21,
    //   name: "soumya",
    //   mobile: "8989898989",
    //   email: "studentData@email.com",
    //   dob: "29-05-1997",
    //   rollNumber: "888",
    //   class: "9"
    // }]
  }

  editUser(userData){
      this.router.navigate(["students", userData.id]);
  }

  delete(userData) {
    let apiParams: ApiParams = {
      url: "delete-student",
      method:"post",
      body:{id: userData.id}
    }
    this.http.apiCall(apiParams).subscribe(res => {
      if(res.status == "success" && res.data) {
        this.getStudents();
        this.router.navigate(['students'])
      }
    });

  }

}
