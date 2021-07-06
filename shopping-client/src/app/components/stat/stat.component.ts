import { Component, OnInit } from '@angular/core';
import { MessagesService } from 'src/app/services/messages.service';
import { ProductsService } from 'src/app/services/products.service';
import { StatService } from 'src/app/services/stat.service';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.css']
})
export class StatComponent implements OnInit {

  constructor(
    public _stat:StatService,
    public _ps:ProductsService,
    public _msg:MessagesService
  ) { }

  image_path:string = ""
  numOfProducts:number
  numOfDeliveries:number

  ngOnInit(): void {
    this._stat.getStat().subscribe(
      (res:any)=>{
        this.numOfProducts = res.num_of_products
        this.numOfDeliveries = res.num_of_deliveries
      },
      err=>{
        console.log(err)
        this._msg.setMessage(err.message)
      }
    )
    this.getProductImage()

    setInterval(()=>this.getProductImage(), 3500)
  }

  getProductImage(){
    this._ps.getRandomImage().subscribe(
      (res:any)=>{
        this.image_path = res.image
      },
      err=>{
        console.log(err)
        this._msg.setMessage(err.message)
      }
    )
  }

}
