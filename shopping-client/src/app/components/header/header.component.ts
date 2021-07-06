import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { MessagesService } from 'src/app/services/messages.service';
import { SearchService } from 'src/app/services/search.service';
import { StatService } from 'src/app/services/stat.service';
import { UsersService } from 'src/app/services/users.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    public _msg:MessagesService,
    public _stat:StatService,
    public _u:UsersService,
    private _search:SearchService,
    private _cart:CartService,
    public _r:Router
  ) { }

  public searchFor:string = ""
  public message:string = ""

  ngOnInit(): void {
    this._msg.message.subscribe(
      (val:string)=>{       
        this.message = val
      }
    )
  }

  logout(){
    this._u.logout()
    this._cart.onLogout()
    
    // navigate back to welcome page
    this._r.navigateByUrl('/welcome')
  }

  search(){
    this._search.search(this.searchFor)
  }
}
