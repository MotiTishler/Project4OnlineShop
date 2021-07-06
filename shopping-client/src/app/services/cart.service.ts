import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Cart from '../models/cart.model';
import CartItem from '../models/cartItem.model';
import { MessagesService } from './messages.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  public cart:Cart

  public id:number
  public items:CartItem[] = []
  public total:number = 0
 

  constructor(
    public http:HttpClient,
    private _msg:MessagesService
  ) {
    if (localStorage.cartBK) this.id = localStorage.cartBK
  }

  onLogout(){
    if (localStorage.cartBK) localStorage.removeItem('cartBK')
  }

  getCartContent(){
    
    this.http.get(`http://localhost:1000/cart/${this.id}`).subscribe(
      (res:any)=>{
        console.log(res)
        this.items = res.list
        this.total = this.items.reduce((acc:number, cur:CartItem)=> acc+cur.cost, 0)
      },
      (err:any)=>{
        console.log(err)
        this._msg.setMessage(err.error.message)
      }
    )
  }

  addProductToCart(productID:number, amount:number){
    
    const body = { cartID:this.id, productID, amount }
    return this.http.post('http://localhost:1000/cart/new' ,body, {
      headers:{
        'Content-Type':"application/json",
        'Authorization':localStorage.shoppingToken
      }
    })
  }

  removeProductFromCart(productID:number){
    return this.http.put(`http://localhost:1000/cart/${this.id}/${productID}`,{} ,{
      headers:{
        'Content-Type':"application/json",
        'Authorization':localStorage.shoppingToken
      }
    })
  }

  clearCart(){
    return this.http.put(`http://localhost:1000/cart/${this.id}/all`,{} ,{
      headers:{
        'Content-Type':"application/json",
        'Authorization':localStorage.shoppingToken
      }
    })
  }

  createReceipt(userID:string, fullName:string, fullAddress:string, credit:string){
    const body = {
      userID,
      fullName,
      fullAddress,
      cartID: this.id,
      items: this.items,
      totalCost: this.total,
      credit
    }
    
    return this.http.post('http://localhost:1000/receipt' ,body, {
      headers:{
        'Content-Type':"application/json",
        'Authorization':localStorage.shoppingToken
      }
    })
  }

}
