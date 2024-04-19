import { Component, Inject, OnInit } from '@angular/core';
import { VisorGraphComponent } from '../../pages/visor-graph/visor-graph.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RegisterUserService } from 'src/app/service/register-user.service';
import { delay } from 'rxjs';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-save-progress',
  templateUrl: './save-progress.component.html',
  styleUrls: ['./save-progress.component.css']
})
export class SaveProgressComponent implements OnInit {

  showLoading = true

  constructor(
    private matDailogRef: MatDialogRef<VisorGraphComponent>,
    private obsUser: RegisterUserService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    let uuid = this.data.uuid
    let tabStatus = this.data.data

    console.log('Visor Data', this.data);

    console.log('uuid', uuid);
    console.log('tabStatus', tabStatus);

    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 2 * 1000;
    snackBar.panelClass = ['snackBar-validator'];

    this.obsUser.putProjectTab(uuid, tabStatus).subscribe({
      error: err => {
        this.snackBar.open('⚠️ Error al Guardar el Proyecto', 'cerrar', snackBar)
      },
      complete: () => {
        this.showLoading = false
        this.matDailogRef.close()
        this.snackBar.open('✅ Proyecto Guardado', 'cerrar', snackBar)
      }
    })
  }

}
