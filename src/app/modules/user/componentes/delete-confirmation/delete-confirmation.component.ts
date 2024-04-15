import { Component, Inject, OnInit } from '@angular/core';
import { UserProjectsComponent } from '../../pages/user-projects/user-projects.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.css']
})
export class DeleteConfirmationComponent implements OnInit {

  title = ''
  quest = ''

  constructor(
    public dialogRef: MatDialogRef<UserProjectsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.title = this.data.title
    this.quest = this.data.quest
  }

  sendConfirmation(){
    this.dialogRef.close(true)
  }
  
}
