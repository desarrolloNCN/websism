import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LectorDemoComponent } from '../../pages/lector-demo/lector-demo.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-dialog',
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.css']
})
export class RegisterDialogComponent implements OnInit {

  title = ''

  constructor(
    private matDialogRef: MatDialogRef<LectorDemoComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public opcion: any
  ) { }

  ngOnInit(): void {
    this.title = this.opcion
  }

  Close() {
    this.matDialogRef.close('')
  }
  
  redirect() {
    window.location.href = 'https://qs.ncn.pe/site/'
  }


}
