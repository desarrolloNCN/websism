import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { VisorGraphComponent } from '../../pages/visor-graph/visor-graph.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ArchivoTXTComponent } from 'src/app/modules/uext/componentes/archivo-txt/archivo-txt.component';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.css']
})
export class NewProjectComponent implements OnInit {

  controlForm: FormGroup | any
  controlForm2: FormGroup | any

  arch: File[] | any = ''

  btnDisable = false

  aceeptedFiles = ['.seed', '.mseed', '.evt', '.txt']

  addedFiles: any = []

  regexURL = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;

  constructor(
    private matDailogRef: MatDialogRef<VisorGraphComponent>,
    private snackBar: MatSnackBar,
    private matdialog: MatDialog,
  ) {

   
    this.controlForm = new FormGroup({
      projectName: new FormControl(),
      descript: new FormControl()
    })

   

  }

  ngOnInit(): void {

    this.controlForm2 = new FormGroup({
      url: new FormControl('', [Validators.pattern(this.regexURL)])
    })
  }

  @ViewChild('fileInput') fileInput!: ElementRef

  onFileSelected(event: any) {

    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 5 * 1000;
    snackBar.panelClass = ['snackBar-validator'];

    let archivos = event.target.files;
    this.controlForm2.get('url').setValue('')

    let statusCalib = ''

    if (archivos && archivos.length > 0) {

      let nombreArchivo: string = archivos[0].name.substring(archivos[0].name.lastIndexOf('/') + 1);
      let extension: string = nombreArchivo.substring(nombreArchivo.lastIndexOf('.') + 1);

      this.arch = ''
      this.arch = archivos[0];
      console.log(extension);


      //this.controlForm2.get('url').disable()
      if (extension == 'seed' || extension == 'evt') {
        statusCalib = 'Calibrado'
      } else if (extension == nombreArchivo) {
        extension = ''
      } else {
        statusCalib = 'No Calibrado'
      }

      let formatoNombre = this.formatearNombreArchivo(archivos[0].name, extension, 7)

      this.addedFiles.push({
        "file": archivos[0],
        "fileName": formatoNombre,
        "originalName" : archivos[0].name,
        "status": statusCalib,
        "extension": extension.toLocaleUpperCase() || 'NO EXT',
        "url": ''
      })

    } else {
      this.arch = null;
    }
  }

  formatearNombreArchivo(nombre: string, extension: string, longitudVisible: number) {
    const longitudExtension = extension.length + 1;
    const longitudSinExtension = nombre.length - longitudExtension;

    if (longitudSinExtension > longitudVisible) {
      const parteVisible = nombre.substring(0, longitudVisible);
      return parteVisible + '...' + extension;
    } else {
      return nombre;
    }
  }

  addUrl() {

    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 5 * 1000;
    snackBar.panelClass = ['snackBar-validator'];

    let statusCalib = ''

    if (this.controlForm2.invalid) {
      this.snackBar.open('⚠️ URL invalida', 'cerrar', snackBar)
    }

    const urlData = this.controlForm2.get('url').value

    if (urlData != '') {

      let nombreArchivo: string = urlData.substring(urlData.lastIndexOf('/') + 1);
      let extension: string = nombreArchivo.substring(nombreArchivo.lastIndexOf('.') + 1);

      if (extension == 'seed' || extension == 'evt') {
        statusCalib = 'Calibrado'
      } else if (extension == nombreArchivo) {
        extension = ''
      } else {
        statusCalib = 'No Calibrado'
      }

      let formatoNombre = this.formatearNombreArchivo(nombreArchivo, extension, 7)

      this.addedFiles.push({
        "file": '',
        "fileName": formatoNombre,
        "originalName" : nombreArchivo,
        "status": statusCalib,
        "extension": extension.toLocaleUpperCase() || 'NO EXT',
        "url": urlData
      })
      
      console.log(this.addedFiles);
      
      this.controlForm2.get('url').setValue('')

    } else {
      this.snackBar.open('Ingrese URL valida')
    }

  }

  calibrarFile(item: any) {
    const matDialogConfig = new MatDialogConfig()
    matDialogConfig.disableClose = true;
    matDialogConfig.data = item

    if (item.extension == 'TXT') {
      this.matdialog.open(ArchivoTXTComponent, matDialogConfig)
    }
  }

  delFile(item: any) {
    const indice = this.addedFiles.indexOf(item);
    if (indice !== -1) {
      this.addedFiles.splice(indice, 1);
    }
  }

  close() {
    this.matDailogRef.close()
  }

}
