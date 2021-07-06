import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Product from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { MessagesService } from 'src/app/services/messages.service';
import { ProductsService } from 'src/app/services/products.service';
import { UsersService } from 'src/app/services/users.service';
import { AmountDialogComponent } from '../dialogs/amount-dialog/amount-dialog.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  @Input() product:Product
  
  constructor(
    public _u:UsersService,
    private _msg:MessagesService,
    private _cart:CartService,
    private _products:ProductsService,
    public dialog:MatDialog
  ) { }

  private amount:number = 0

  ngOnInit(): void {
  }

  addProductToCart(){

    // open dialog to get amount
    const amountDialog = this.dialog.open(AmountDialogComponent)

    //if got amount - call cart service to add. pass product id and amount as params
    amountDialog.afterClosed().subscribe(
      (res:any)=>{
        
        if (res) this.amount = res
        if (this.amount > 0){
          this._cart.addProductToCart(this.product.id, this.amount).subscribe(
            (res:any)=>{
              //item was added successfully
              console.log(res)
              this._cart.getCartContent()
            },
            (err:any)=>{
              console.log(err)
              this._msg.setMessage(err)
            }
          )
        }
      },
      (err:any)=>{
        console.log(err)
        this._msg.setMessage(err)
      }
    )
  }

  editProduct(){
    this._products.setProductToEdit(this.product)
  }

  
}
