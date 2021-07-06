import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { CartService } from 'src/app/services/cart.service';
import { CitiesService } from 'src/app/services/cities.service';
import { DeliveriesService } from 'src/app/services/deliveries.service';
import { MessagesService } from 'src/app/services/messages.service';
import { SearchService } from 'src/app/services/search.service';
import { UsersService } from 'src/app/services/users.service';
import { OkDialogComponent } from '../dialogs/ok-dialog/ok-dialog.component';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css']
})
export class BillComponent implements OnInit {

  constructor(
    public _cart:CartService,
    private _msg:MessagesService,
    public _city:CitiesService,
    private _d:DeliveriesService,
    public _u:UsersService,
    private _search:SearchService,
    public _r:Router,
    public _fb:FormBuilder,
    public dialog:MatDialog
  ) {
    if (_cart.items.length == 0) _cart.getCartContent()    
  }

  public myForm:FormGroup
  cities:string[] = []
  displayedColumns: string[] = ['product', 'amount', 'cost'];
  today:Date = new Date()
  private textToHighlight:string = ""

  ngOnInit(): void {
    this.cities = this._city.getCities()

    this.myForm = this._fb.group({
      city:["", Validators.required], 
      address:["", Validators.required], 
      date:["", [Validators.required]],
      credit:["", [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern('[0-9]+')]] 
    })

    this._search.searchFor.subscribe(
      (val:string)=>{
        this.textToHighlight = val
      }
    )

    this._d.getDeliveryDates().subscribe(
      (res:any)=>{
        
        //the real datesFilter function
        this.datesFilter = (d: Date | null): boolean =>{
          const dt = d || new Date()

          const filteredList = res.list.filter(day=>day.closed)
                                      .filter(d=>!Math.floor(Math.abs((new Date(d.delivery_date)).getTime() - (dt).getTime()) / (1000*60*60*24)) )
                     
          return filteredList.length == 0
        }
      },
      (err:any)=>{
        console.log(err)
        this._msg.setMessage(err.message)
      }
    )
  }

  setAddressAndCity(){
    console.log('setAddressAndCity')
    this.myForm.controls.city.setValue(this._u.user.city)
    this.myForm.controls.address.setValue(this._u.user.address)
  }
  payAndOrderDelivery(){
    //in real world we will call a web api of a credit clearing conpany.
    // instead, i'll call our server
    const body = {
      cartID:this._cart.id, 
      city:this.myForm.controls.city.value, 
      address:this.myForm.controls.address.value, 
      dd:this.myForm.controls.date.value, 
      credit:this.myForm.controls.credit.value
    }
    this._d.orderNewDelivery(body).subscribe(
      (res:any)=>{
        //create a receipt file
        this._cart.createReceipt(this._u.user.id, 
                                `${this._u.user.firstName} ${this._u.user.lastName}`, 
                                `${this._u.user.address} ${this._u.user.city}`, 
                                this.myForm.controls.credit.value)
        .subscribe(
          (res:any)=>{
            this.openFinalDialog(true)
          },
          (err:any)=>{
            console.log(err)
            this._msg.setMessage("couldn't create a receipt")
            this._msg.setMessage(err.msg)

            this.openFinalDialog(false)
          }
        )
      },
      (err:any)=>{
        console.log(err),
        this._msg.setMessage(err.error.msg)
      }
    )
  }

  openFinalDialog(hasReceipt:boolean){
    
    //open the ok-dialog
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = { hasReceipt,  cartID:this._cart.id, userID:this._u.user.id}//, cs:this._cart}
    
    const okDialog = this.dialog.open(OkDialogComponent, dialogConfig)

    okDialog.afterClosed().subscribe(
      (res:any)=>{
        console.log('purchase was completed. ', res)
        //logout
        this._u.logout()
    
        // navigate back to welcome page
        this._r.navigateByUrl('/welcome')
      },
      (err:any)=>{
        console.log(err)
        this._msg.setMessage(err)
      }
    )     
  }

  highlight(val:string):boolean{
    if (!this.textToHighlight) return false
    
    return val.includes(this.textToHighlight)
  }

  // this is just a placeholder for the datesFilter function
  // the real function is re-declared in ngOnInit in order to recognize the deliveries service
  datesFilter = (date: Date):boolean => {return true}
}
