import { Component, OnInit } from '@angular/core';
import { UserProjectsComponent } from '../../pages/user-projects/user-projects.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.css']
})
export class DeleteConfirmationComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<UserProjectsComponent>
  ) { }

  ngOnInit(): void {
  }

  sendConfirmation(){
    this.dialogRef.close(true)
  }
  
}
