import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class TokenGuard implements CanActivate {
  constructor(
    private _r:Router
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    if (!localStorage.shoppingToken) return this._r.parseUrl('/welcome')

    const token = (jwt_decode(localStorage.shoppingToken) as any)
    //console.log('token guard')
    //console.log(token)
    if (!token.exp) return true

    //console.log(token.exp, Math.floor((new Date().valueOf())/1000))

    const expDate = new Date(0)
    expDate.setUTCSeconds(token.exp)
    
    if (token.exp > Math.floor((new Date().valueOf())/1000))
      return true
    else
      return this._r.parseUrl('/welcome')
  }

  private validToken():boolean{
    return true
  }
  
}
