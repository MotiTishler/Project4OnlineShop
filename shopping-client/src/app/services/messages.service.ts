import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  //public message:string = ""
  private msgSubject = new Subject<string>()
  public message:Observable<string>

  private timerSubject = new Subject<boolean>()
  private timerObs:Observable<boolean>

  private timerIsOn:boolean = false;
  private q:string[] = []

  constructor() {
    this.message = this.msgSubject.asObservable()
    this.timerSubject.next(this.timerIsOn)
    this.timerObs = this.timerSubject.asObservable()

    this.timerObs.subscribe(
      (val:boolean)=>this.timerIsOn = val
    )
  }

  public setMessage(msg:string){
    if (this.timerIsOn){
      console.log('timer is on')
      this.q.push(msg)
    }else{
      this.msgSubject.next(msg)
      this.timerSubject.next(true)
      
      setTimeout(this.onTimer, 3000, this.msgSubject, this.timerSubject, this.q)
    }
  }


  private onTimer(subject:Subject<string>, ts:Subject<boolean>, q:string[]){
    if (q.length > 0){      
      subject.next(q.shift())
      setTimeout(this.onTimer, 3000, subject, ts, q)
    }else{
      subject.next()
      ts.next(false)
    }
  }

}
