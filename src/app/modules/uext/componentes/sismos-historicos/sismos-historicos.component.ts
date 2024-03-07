import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LectorDemoComponent } from '../../pages/lector-demo/lector-demo.component';

@Component({
  selector: 'app-sismos-historicos',
  templateUrl: './sismos-historicos.component.html',
  styleUrls: ['./sismos-historicos.component.css']
})
export class SismosHistoricosComponent implements OnInit {

  constructor(
    private matDialogRef: MatDialogRef<LectorDemoComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public opcion: any
  ) { }

  ngOnInit(): void {
  }

  Close() {
    this.matDialogRef.close('')
  }
  
}
