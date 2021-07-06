import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

//import CartItem from 'src/app/models/cartItem.model';
import { CartService } from 'src/app/services/cart.service';
import { DeliveriesService } from 'src/app/services/deliveries.service';
import { MessagesService } from 'src/app/services/messages.service';
//import { WidthService } from 'src/app/services/width.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor(
    public _cart:CartService,
    private _msg:MessagesService,
    public _r:Router
  ) { }

  displayedColumns: string[] = ['imageUrl', 'product', 'amount', 'cost', 'action'];

  ngOnInit(): void {
    this._cart.getCartContent()
  }

  deleteItem(productID:number){
    console.log('delete item', productID)
    this._cart.removeProductFromCart(productID).subscribe(
      (res:any)=>{
        console.log(res)
        this._cart.getCartContent()
      },
      (err:any)=>{
        console.log(err)
        this._msg.setMessage(err.message)
      }
    )
  }

  clearCart(){
    this._cart.clearCart().subscribe(
      (res:any)=>{
        console.log(res)
        this._cart.getCartContent()
      },
      (err:any)=>{
        console.log(err)
        this._msg.setMessage(err.message)
      }
    )
  }

  addOne(productID:number){
    this.updateItem(productID, 1)
  }

  removeOne(productID:number){
    this.updateItem(productID, -1)
  }

  updateItem(productID:number, amount:number){
    this._cart.addProductToCart(productID, amount).subscribe(
      (res:any)=>{
        console.log(res)
        this._cart.getCartContent()
      },
      (err:any)=>{
        console.log(err)
        this._msg.setMessage(err.error.message)
      }
    )
  }


  toSummary(){
    this._r.navigateByUrl('/bill')
  }

  doNothing(){console.log('nothing')}

}
