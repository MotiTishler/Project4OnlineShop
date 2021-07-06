import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import Product from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private productSubject = new Subject<Product>()  
  public productToEdit:Observable<Product>
  //public productToEdit:Product

  constructor(
    private http:HttpClient
  ){
    this.productToEdit = this.productSubject.asObservable()
  }

  getRandomImage(){
    return this.http.get('http://localhost:1000/products/image')
  }

  getCategoriesList(){
    return this.http.get('http://localhost:1000/cats')
  }

  getProducts(id:number){
    return this.http.get(`http://localhost:1000/products/category/${id}`)
  }

  searchProducts(someString:string){
    return this.http.get('http://localhost:1000/products/search/'+someString)
  }

  setProductToEdit(p:Product){
    this.productSubject.next(p)    
  }

  newProduct(){
    //this.productToEdit = new Product(0,'',0,0,'unit')
    this.setProductToEdit(new Product(0,'',0,0,'unit'))
  }

  addNewProduct(body){
    console.log(body)
    return this.http.post('http://localhost:1000/products/new', body, {
      headers:{
        'Content-Type':"application/json",
        'Authorization':localStorage.shoppingToken
      }
    })
  }

  editProduct(body){
    console.log(body)
    return this.http.put('http://localhost:1000/products/edit', body, {
      headers:{
        'Content-Type':"application/json",
        'Authorization':localStorage.shoppingToken
      }
    })
  }

}
