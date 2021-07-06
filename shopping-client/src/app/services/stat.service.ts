import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatService {

  constructor(private http:HttpClient) { }
  public welcomeMsg:string = ""

  public getStat(){
    return this.http.get('http://localhost:1000/stat') 
  }
}
