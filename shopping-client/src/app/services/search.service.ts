import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private searchSubject = new Subject<string>()
  public searchFor:Observable<string>

  constructor() { 
    this.searchFor = this.searchSubject.asObservable()
  }

  search(val:string){
    this.searchSubject.next(val)
  }

  clear(){    
    this.searchSubject.next()
  }
}
