import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Category from 'src/app/interfaces/category.interface';
import Product from 'src/app/models/product.model';
import { MessagesService } from 'src/app/services/messages.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-addit',
  templateUrl: './addit.component.html',
  styleUrls: ['./addit.component.css']
})
export class AdditComponent implements OnInit {

  public myForm:FormGroup
  public isNew:boolean = false
  public product:Product  
  cats:Category[] = []

  public units:string[] = ['unit', 'Kg', '100 gr', 'box', 'package']

  constructor(
    private _products:ProductsService,
    private _msg:MessagesService,
    private _fb:FormBuilder
  ) { 
    this.product = new Product(0,'',0,0,'unit')
  }

  ngOnInit(): void {
    console.log(this.product)
    this._products.getCategoriesList().subscribe(
      (res:any)=>{
        console.log(res)
        this.cats = res.list.sort((a:Category, b:Category) => (a.cat_name > b.cat_name) ? 1 : -1)
        console.log(this.cats)
      },
      (err:any)=>{
        console.log(err)
        this._msg.setMessage(err.msg)
      }
    )

    this.myForm = this._fb.group({
      productName:[this.product.name, Validators.required], //["", Validators.required], //
      supplier:[this.product.supplier, ], //[""]//
      catID:[this.product.cat_id ,[Validators.required]], //[0 ,[Validators.required]], //
      price:[this.product.price ,[Validators.required]],//[0 ,[Validators.required]],//
      unit:[this.product.unit, ], //[""]//
      image_path:[this.product.image, ] //[""]//
    })
    
    this._products.productToEdit.subscribe(
      (p:Product)=>{
        console.log(p)
        this.product = p
        this.myForm.controls.productName.setValue(p.name)
        this.myForm.controls.supplier.setValue(p.supplier)
        this.myForm.controls.catID.setValue(p.cat_id)
        this.myForm.controls.price.setValue(p.price)
        this.myForm.controls.unit.setValue(p.unit)
        this.myForm.controls.image_path.setValue(p.image)
        this.isNew = false
      },
      err=>{
        console.log(err)
      }
    )

  }

  newItem(){
    this.isNew = true
    this._products.newProduct()
  }

  handleSubmit(){
    console.log('submit', this.isNew, this.product.id)
    if (this.product.id == 0){
      //add new product
      this._products.addNewProduct(this.myForm.value).subscribe(
        (res:any)=>{
          console.log(res)
          this._msg.setMessage(res.msg)
        },
        (err:any)=>{
          console.log(err),
          this._msg.setMessage(err.msg)
        }
      )      
    }else{
      //edit product
      this._products.editProduct({...this.myForm.value, productID:this.product.id}).subscribe(
        (res:any)=>{
          console.log(res)
          this._msg.setMessage(res.msg)
        },
        (err:any)=>{
          console.log(err),
          this._msg.setMessage(err.msg)
        }
      )
    }
  }
}
