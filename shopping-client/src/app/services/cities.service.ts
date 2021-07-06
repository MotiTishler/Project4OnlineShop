import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CitiesService {

  // in the real world there will be here a full size service for the whole country
  // for this project we'll use only this list
  city:string[] = ["Ovnat", "Kalya", "Beit HaArava", "Almog", "Ein Gedi", "Mitzpeh Shalem", "Verred Yericho", "Newe Zohar", "Neot HaKikar", "Ein Tamar", "Ein Bokek"]

  constructor() { }


  public getCities(){
    return this.city.sort();
  }
}
