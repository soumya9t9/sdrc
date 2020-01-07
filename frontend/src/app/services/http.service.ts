import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {map, catchError} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  readonly baseUrl = "http://localhost:3000/";

  constructor(private httpClient:HttpClient){

  }

  apiCall(data):Observable<any> {
    let url = this.baseUrl + data.url;
    let options = { };
    data.body ? options['body'] = data.body : '';
    data.params ? options['params'] = data.params : '';
    data.method = data.method ? data.method : "get";
    return this.httpClient
    .request(data.method, url, options)
    .pipe(map((res) => {
        // return of(JSON.parse(res.toString()));

        return res;
      }))
      .pipe(
        catchError((err) => {
        console.log(err);
        return of(err);
      }))
  
  }

}

export interface ApiParams {
 url:String;
 method:String;
 body ?:any;
 params ?:HttpParams | any;
}