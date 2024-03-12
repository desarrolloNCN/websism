import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { LectorDemoComponent } from '../../pages/lector-demo/lector-demo.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ObspyAPIService } from 'src/app/service/obspy-api.service';

@Component({
  selector: 'app-archivo-mseed',
  templateUrl: './archivo-mseed.component.html',
  styleUrls: ['./archivo-mseed.component.css']
})
export class ArchivoMseedComponent implements OnInit {

  controlForm: FormGroup | any
  controlForm2: FormGroup | any

  btnShow = false
  btnCancel = true
  btnDisable = false
  btnDisableForm = false

  urlFile = ''
  urlXml = ''
  stringdata = ''

  hideStaPanel = true

  loadingSpinner = false
  loadingSpinnerStaInfo = false

  loadingBarSpinner = false

  arch: File[] | any = ''
  buscarTexto: string = '';

  tempdata: any = []

  constructor(
    private matDialogRef: MatDialogRef<LectorDemoComponent>,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private obsApi: ObspyAPIService,
    @Inject(MAT_DIALOG_DATA) public url: any
  ) {

    this.controlForm = new FormGroup({
      url: new FormControl(''),
    })

    this.controlForm2 = new FormGroup({
      unitst : new FormControl('', Validators.required)
    })
  }

  ngOnInit(): void {
    this.loadingSpinnerStaInfo = true

    this.disableForm()
    this.btnDisableForm = true

    this.obsApi.getData(this.url).subscribe({
      next: value => {
        this.tempdata = value.data

        this.groupedData = this.groupByNetworkAndStation(value.data, value.inv)

        value.data.forEach((columna: any, index: string) => {
          this.controlForm2.addControl('c_' + index, new FormControl('', Validators.required));
          // this.controlForm.addControl('cc_' + index, new FormControl('', Validators.required));
        });
      },
      error: err => {
        // this.snackBar.open('Formato no Soportado', 'cerrar', snackBar)
        this.loadingSpinnerStaInfo = false
      },
      complete: () => {
        this.loadingSpinnerStaInfo = false

        this.btnDisable = false
        this.btnDisableForm = false
        this.controlForm.enable()
        this.controlForm2.enable()
      }
    })

  }

  onFileSelected(event: any) {

    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 5 * 1000;
    snackBar.panelClass = ['snackBar-validator'];

    let archivos = event.target.files;
    this.controlForm.get('url').setValue('')


    if (archivos && archivos.length > 0) {

      let nombreArchivo: string = archivos[0].name.substring(archivos[0].name.lastIndexOf('/') + 1);
      let extension: string = nombreArchivo.substring(nombreArchivo.lastIndexOf('.') + 1);

      if (extension != 'xml') {
        this.snackBar.open('⚠️ Formato Incorrecto', 'cerrar', snackBar)
        this.btnShow = false;
        this.btnCancel = true;
        this.arch = null;
        return
      } else {
        this.arch = archivos[0];
        this.controlForm2.disable()
        this.btnDisableForm = true
        this.btnShow = true;
        this.btnCancel = false;
        this.controlForm.get('url').disable()
      }

    } else {
      this.btnShow = false;
      this.btnCancel = true;
      this.arch = null;
    }
  }

  @ViewChild('fileInput') fileInput!: ElementRef

  leerArchivo() {

    // this.clearData()
    this.btnDisable = true

    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 5 * 1000;
    snackBar.panelClass = ['snackBar-validator'];

    let textoValue = this.controlForm.get('url').value;
    let archivoValue = this.arch;

    let valorNoVacio: string | File | undefined;

    this.loadingSpinner = true
    this.loadingBarSpinner = true

    if (archivoValue instanceof File || typeof textoValue === 'string' && textoValue.trim() !== '') {

      valorNoVacio = archivoValue || textoValue

      this.obsApi.uploadFile(valorNoVacio).subscribe({
        next: value => {

          this.disableForm()

          this.urlFile = value.file
          this.stringdata = value.string_data

          this.urlXml = value.file || value.string_data

        },
        error: err => {
          this.loadingSpinner = false
          this.loadingBarSpinner = false
          this.btnDisable = false
          this.snackBar.open('⚠️ Fuera de Linea', 'cerrar', snackBar)
        },
        complete: () => {

          this.obsApi.addCalibrationMseed(this.url, this.urlXml, '').subscribe({
            next: value => {

              let sendData = {
                "url": value.url,
                "unit": value.unit
              }

              this.matDialogRef.close(sendData)
            },
            error: err => {
              this.loadingSpinner = false
              this.btnDisable = false
              this.snackBar.open('⚠️ Fuera de Linea', 'cerrar', snackBar)
            },
            complete: () => {
              this.loadingBarSpinner = false
              this.btnDisable = false

            }
          })

        }
      })

    } else {
      console.log(this.controlForm.value);
      this.snackBar.open('No se encontro ARCHIVO o URL', 'cerrar', snackBar)
      this.loadingSpinner = false
      this.loadingBarSpinner = false
      this.btnDisable = false
    }
  }

  enviarCalibracion() {
    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 5 * 1000;
    snackBar.panelClass = ['snackBar-validator'];

    this.loadingBarSpinner = true

    if (this.controlForm2.invalid) {
      
      this.loadingBarSpinner = false
      this.snackBar.open('No se Ingresado factor de Calibracion', 'cerrar', snackBar)

    } else {

      let data = this.controlForm2.value

      this.disableForm()

      this.obsApi.addCalibrationMseed(this.url, '', data).subscribe({
        next: value => {
          let sendData = {
            "url": value.url,
            "unit": this.controlForm2.get('unitst').value
          }

          this.matDialogRef.close(sendData)
        },
        error: err => {
          this.loadingSpinner = false
          this.loadingBarSpinner = false
          this.snackBar.open('⚠️ Fuera de Linea', 'cerrar', snackBar)
        },
        complete: () => {
          this.loadingBarSpinner = false
          this.loadingBarSpinner = false
        }
      })
    }
  }

  groupedData: { [key: string]: any[] } = {};
  selectedGroup: string | null = null;

  groupByNetworkAndStation(data: any[], inv: any[]): { [key: string]: any[] } {
    const groupedD: { [key: string]: any[] } = {};

    data.forEach(item => {
      const key = `${item.network}.${item.station}`;

      if (!groupedD[key]) {
        groupedD[key] = [];
      }

      groupedD[key].push(item);
    });

    return groupedD;
  }

  selectGroup(groupKey: string): void {
    this.selectedGroup = groupKey;
  }

  getGroupValues(group: any): any[] {
    return Object.values(group.value);
  }

  setColorStationChannel(value: string): any {

    const lastLetter = value.charAt(value.length - 1)

    if (lastLetter === 'e' || lastLetter === 'E') {
      return { 'background-color': 'blue' }
    } else if (lastLetter === 'n' || lastLetter === 'N') {
      return { 'background-color': 'green' }
    } else if (lastLetter === 'z' || lastLetter === 'Z') {
      return { 'background-color': 'red' }
    } else {
      return { 'background-color': 'black' }
    }
  }

  disableForm(){
    this.btnDisable = true
    this.controlForm.disable()
    this.controlForm2.disable()
  }

  deleteFile() {

    this.btnShow = false;
    this.btnCancel = true;
    this.btnDisableForm = false

    this.fileInput.nativeElement.value = ''
    this.arch = ''
    this.controlForm.get('url').enable()
    this.controlForm2.enable()
  }

  rellenarFactores(event : any){
    if(event.checked == true){
      this.controlForm.disable()
      this.btnDisable = true
      this.tempdata.forEach((element : any, index: number) => {
        this.controlForm2.get('c_' + index).setValue(1)
      });
    }else{
      this.controlForm.enable()
      this.btnDisable = false
      this.tempdata.forEach((element : any, index: number) => {
        this.controlForm2.get('c_' + index).setValue('')
      });
    }
    
  }

  clearData() {
    //localStorage.clear
    this.groupedData = {}
  }

  Close() {
    this.disableForm()
    let sendData = {
      "url": '',
      "unit": ''
    }
    this.matDialogRef.close(sendData)
  }

}
