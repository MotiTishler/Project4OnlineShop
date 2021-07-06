import { Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { saveAs } from 'file-saver';

@Component({
  selector: 'app-ok-dialog',
  templateUrl: './ok-dialog.component.html',
  styleUrls: ['./ok-dialog.component.css']
})
export class OkDialogComponent implements OnInit {
  public hasReceipt:boolean
  public receiptPath:string
  public receiptFile:string

  constructor(
    private dialogRef:MatDialogRef<OkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data:{hasReceipt:boolean, cartID:number, userID:string}//, cs:CartService}
  ) { 
    this.hasReceipt = data.hasReceipt
    this.receiptPath = `http://localhost:1000/receipts/receipt${data.cartID}.pdf`
    this.receiptFile = `receipt${data.cartID}.pdf`
  }

  ngOnInit(): void {
   
  }

  download(){
    saveAs(this.receiptPath, this.receiptFile)
  }

}
