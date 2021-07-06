import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

import Product from 'src/app/models/product.model';
import { MessagesService } from 'src/app/services/messages.service';
import { ProductsService } from 'src/app/services/products.service';
import { SearchService } from 'src/app/services/search.service';
import { UsersService } from 'src/app/services/users.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  cats:{id:number, cat_name:string}[] = []
  curCategory:number = 1

  products:Product[] = []

  sidenavWidth:number = 2
  pinSideNav:boolean = false

  constructor(
    public _u:UsersService,
    public _products:ProductsService,
    private _msg:MessagesService,
    private _search:SearchService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer

  ) {
    this.pinSideNav = this._u.user.is_admin
    this.sidenavWidth = this.pinSideNav? 20:2

    this.matIconRegistry.addSvgIcon(
      "pinned",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/pinned.svg")
    )
    this.matIconRegistry.addSvgIcon(
      "unpinned",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/unpinned.svg")
    )

  }

  ngOnInit(): void {
    

    this._products.getCategoriesList().subscribe(
      (res:any)=>{
        console.log(res)
        this.cats = res.list
        console.log(this.cats)
      },
      (err:any)=>{
        console.log(err)
        this._msg.setMessage(err.error.msg)
      }
    )
    
    this.showProducts()

    this._search.searchFor.subscribe(
      (val:string)=>{
        console.log(val)
        if (val){
          //get product by name from server 
          this._products.searchProducts(val).subscribe(
            (res:any)=>{
              console.log(res)
              this.products = res.list
            },
            (err:any)=>{
              console.log(err)
              this._msg.setMessage(err.error.msg)
            }            
          )
        }else{
          //no val to search. get products by category
          this.showProducts()
        }
      },
      err=>{
        console.log(err)
      }
    )
  }

  showProducts(){
    
    this._products.getProducts(this.curCategory).subscribe(
      (res:any)=>{
        console.log(res)
        this.products = res.list
      },
      (err:any)=>{
        console.log(err)
        this._msg.setMessage(err.error.msg)
      }
    )
  }

}
