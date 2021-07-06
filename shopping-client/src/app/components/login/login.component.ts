import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessagesService } from 'src/app/services/messages.service';
import { UsersService } from 'src/app/services/users.service';
import { StatService } from 'src/app/services/stat.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    public _fb:FormBuilder,
    public _r:Router,
    public _u:UsersService,
    private _msg:MessagesService,
    private _stat:StatService,
    private _cart:CartService
  ) { }

  public myForm:FormGroup
  public enterText:string = "Enter"

  ngOnInit(): void {
    this.myForm = this._fb.group({
      username:["", [Validators.required, Validators.email, this.validateEmailAddderss]],
      password:["", [Validators.required]]
    })
  }

  public handleSubmit(){
    this._u.login(this.myForm.value).subscribe(
      (res:any)=>{
        console.log(res)

        //set token at local storage
        
        localStorage.shoppingToken = res.token
        

        //decode token and create a new User
        this._u.parseToken()
        

        if (!this._u.user.is_admin){
          this._stat.welcomeMsg = res.welcome
          this.enterText = res.is_open? "Resume Shopping":"Start Shopping"

          // user's cart 
          localStorage.cartBK = res.cartID
          this._cart.id = res.cartID

        }else{
          this.enterText = "Enter"
        }

        
      },
      (err:any)=>{
        console.log(err)
        this._msg.setMessage(err.error.msg)
      }
    )
  }

  enter(){
    this._r.navigateByUrl('/main')
  }


  // my validators
  validateEmailAddderss(control:AbstractControl):{[key: string]: any} | null{
    if (!control.value) return {'NoAddress':true}
    
    const re = /\S+@\S+\.\S+/
    if (!re.test(control.value)) return {'NotAValidEmailAddress':true}

    return null
  }

}
