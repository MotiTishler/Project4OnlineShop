import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  public i:number = 0
  
  public imgs = [
    {
      img:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/PikiWiki_Israel_28804_%D7%A2%D7%A6%D7%99_%D7%93%D7%A7%D7%9C_%D7%91%D7%91%D7%99%D7%AA_%D7%A9%D7%90%D7%9F.jpg/800px-PikiWiki_Israel_28804_%D7%A2%D7%A6%D7%99_%D7%93%D7%A7%D7%9C_%D7%91%D7%91%D7%99%D7%AA_%D7%A9%D7%90%D7%9F.jpg",
      credit:'מרכז להב"ה מגאר, מתוך אתר פיקיויקי'
    },
    {
      img:"https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/PikiWiki_Israel_16616_Agriculture_in_Israel.JPG/800px-PikiWiki_Israel_16616_Agriculture_in_Israel.JPG",
      credit:"אילת לב ארי שלי, מתוך אתר פיקיויקי"
    },
    {
      img:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Vine_2.jpg/330px-Vine_2.jpg",
      credit:"ויקיפדיה"
    },
    {
      img:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Pommegranate_tree01.JPG/375px-Pommegranate_tree01.JPG",
      credit:"ויקיפדיה - אמנון"
    },
    {
      img:"https://a7.org/pictures/987/987767.jpg",
      credit:"ISTOCK"
    }
  ]
  ngOnInit(): void {
    
    setInterval(()=>{
      this.i = Math.floor(Math.random()*this.imgs.length)      
    },3500) 
  }

}
