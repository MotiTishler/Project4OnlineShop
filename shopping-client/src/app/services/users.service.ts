import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import User from '../models/user.model';
import { StatService } from './stat.service';
import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  public user:User

  constructor(
    public http:HttpClient,
    private _stat:StatService
  ) {
    if (localStorage.shoppingToken) this.parseToken()
  }

  //login
  public login(bdy){
    return this.http.post('http://localhost:1000/users/login' ,bdy, {
      headers:{
        'Content-Type':"application/json"
      }
    })
  }

  //logout
  public logout(){
    //remove token from localStorage
    localStorage.removeItem("shoppingToken")

    this.user = undefined

    this._stat.welcomeMsg = ""
  }

  //register
  public register(bdy){
    return this.http.post('http://localhost:1000/users/register' ,bdy, {
      headers:{
        'Content-Type':"application/json"
      }
    })
  }


  updateUser(fname:string, lname:string, city:string, address:string = ""){
    this.user.firstName = fname
    this.user.lastName = lname
    this.user.city = city
    this.user.address = address
  }
  parseToken(){
    const u = (jwt_decode(localStorage.shoppingToken) as any)
    this.user = new User(u.id, u.username, u.password)
    this.user.is_admin = u.is_admin
    if (!u.is_admin) this.updateUser(u.fname, u.lname, u.city ,u.address)
  }
}
