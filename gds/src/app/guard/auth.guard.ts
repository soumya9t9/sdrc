import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { AccessAndAuthorities, HighLevelAuthorityType } from '../service/authorities.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private app: AppService, private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.app.checkLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login'])
      return false;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class AccessGuard implements CanActivate {
  constructor(private authorities: AccessAndAuthorities, private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authorities.hasAccess("dashboard", HighLevelAuthorityType.any, null, null)) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }

  }
}


@Injectable({
  providedIn: 'root'
})
export class isDeptDistDisabled implements CanActivate {
  constructor(private authorities: AccessAndAuthorities, private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (JSON.parse(localStorage.getItem("user_details")).sessionMap.areaStatus != false && JSON.parse(localStorage.getItem("user_details")).sessionMap.deptStatus != false) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }

  }
}

