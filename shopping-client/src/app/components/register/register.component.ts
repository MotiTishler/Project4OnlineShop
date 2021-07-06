import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CitiesService } from 'src/app/services/cities.service';
import { MessagesService } from 'src/app/services/messages.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(
    public _r:Router,
    public _fb:FormBuilder,
    public _city:CitiesService,
    public _u:UsersService,
    private _msg:MessagesService
  ) { }

  stage1form:FormGroup
  stage2form:FormGroup

  cities:string[] = []

  ngOnInit(): void {
    this.cities = this._city.getCities()
    
       
      this.stage1form = this._fb.group({
        id:["", [Validators.required, Validators.minLength(7), Validators.maxLength(9)]], //add validator: valid israeli id
        username:["", [Validators.required, Validators.email, this.validateEmailAddderss]],
        password:["", [Validators.required]],
        confirm:["", [Validators.required]] 
      },{
        // validator for 2 fields: password is confirmed
        validators: this.validatePasswordConfirmation()
      })
    
      this.stage2form = this._fb.group({
        city:["", Validators.required],
        address:[""],
        fname:["", Validators.required],
        lname:["", Validators.required]
      })
    
  }


  handleSubmit(){
    console.log({...this.stage1form.value, ...this.stage2form.value})
    this._u.register({...this.stage1form.value, ...this.stage2form.value}).subscribe(
      (res:any)=>{
        console.log(res)
        this._msg.setMessage(res.msg)
        this._r.navigateByUrl('/')

      },
      (err:any)=>{
        console.log(err)
        this._msg.setMessage(err.message)
      }
    )
  }

  // my validators
  validateEmailAddderss(control:AbstractControl):{[key: string]: any} | null{
    if (!control.value) return {'NoAddress':true}
    
    const re = /\S+@\S+\.\S+/
    if (!re.test(control.value)) return {'NotAValidEmailAddress':true}

    return null
  }

  validatePasswordConfirmation(){
    return (control: AbstractControl)=>{
      const passwordControl = control.get('password') 
      const confirmControl = control.get('confirm') 

      // return null if another validator has already found an error on confirmControl
      if (confirmControl.errors && !confirmControl.errors.doesntMatch) return null

      if (passwordControl.value !== confirmControl.value) {
        confirmControl.setErrors({ 'doesntMatch': true })
        return { 'doesntMatch': true }
      } else {
        confirmControl.setErrors(null)
        return null
      }
    }    
  }

}
