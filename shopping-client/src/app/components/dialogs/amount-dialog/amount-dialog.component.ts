import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-amount-dialog',
  templateUrl: './amount-dialog.component.html',
  styleUrls: ['./amount-dialog.component.css']
})
export class AmountDialogComponent implements OnInit {

  constructor() { }

  public am:number

  ngOnInit(): void {
  }

}
