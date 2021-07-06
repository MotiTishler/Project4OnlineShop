import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessagesService } from './messages.service';

@Injectable({
  providedIn: 'root'
})
export class DeliveriesService {

  public closedDays:Date[] = []
  constructor(
    private http:HttpClient,
    private _msg:MessagesService
  ) { }

  orderNewDelivery(body){
    console.log(body)
    return this.http.post('http://localhost:1000/deliveries/new', body, {
      headers:{
        'Content-Type':"application/json",
        'Authorization':localStorage.shoppingToken
      }
    })
  }
  
  getDeliveryDates(){
    return this.http.get('http://localhost:1000/deliveries/dates')
  }
}
