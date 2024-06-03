import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ObspyAPIService } from 'src/app/service/obspy-api.service';
import { LectorDemoComponent } from '../../pages/lector-demo/lector-demo.component';

@Component({
  selector: 'app-autotxtread',
  templateUrl: './autotxtread.component.html',
  styleUrls: ['./autotxtread.component.css']
})
export class AutotxtreadComponent implements OnInit {

  infoText = ''
  maxRows = 0

  loadingSpinnerText = false

  showTooltip = false
  showText = true

  sendData = {
    fr_line: '',
    ls_line: '',
    delta: '0',
    unidad: 'gal',
    network: 'NC',
    station: 'NCN',
    location: '',
    starttime: new Date(),
    ckInfo: '',
    ckOneTrace: '',
  }

  constructor(
    private matDialogRef: MatDialogRef<LectorDemoComponent>,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private obsApi: ObspyAPIService,
    @Inject(MAT_DIALOG_DATA) public url: any
  ) { }

  ngOnInit(): void {

    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 5 * 1000;
    snackBar.panelClass = ['snackBar-validator'];

    const headers = new HttpHeaders().set('No-Interceptor', 'true');
    this.loadingSpinnerText = true

    this.http.get(this.url, { responseType: 'text', headers })
      .subscribe(
        {
          next: value => {
            const lineas = value.split('\n')
            this.infoText = value
            this.maxRows = lineas.length

          },
          error: err => {
            this.snackBar.open('⚠️ Error al leer Archivo', 'cerrar', snackBar)
            this.loadingSpinnerText = false
            this.showText = false
          },
          complete: () => {
            this.snackBar.open('✅ Archivo Cargado con Exito', 'cerrar', snackBar)
            this.loadingSpinnerText = false
            this.showText = false
            this.buscarCoincidencia()
          }
        }
      )
  }

  buscarCoincidencia(): void {
    // const regex = /^\s*(?:-?\d+\.\d+|[.,;]?\d+(?:\.\d+)?(?:[.,;]\d+)?(?:\.\d+)?)\s*(?:[.,;]?(?:-?\d+\.\d+|[.,;]?\d+(?:\.\d+)?(?:[.,;]\d+)?(?:\.\d+)?)\s*)*$/;
    const regex = /^\s*(?:-?\d+(?:[.,;]\d+)?(?:\s*[.,;]?\s*-?\d+(?:[.,;]\d+)?)*\s*)$/
    const regexFecha = /(\d{4}[-/]\d{2}[-/]\d{2}|\d{1,2}[-/]\d{1,2}[-/]\d{4})/
    const regexHora = /([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]/
    const regexfrecuencia = /# FRECUENCIA DE MUESTREO \(Hz\): (\d+(\.\d+)?)/
    const regexnetwork = /# GRUPO: ([A-Za-z]+)/
    const regexstation = /# ESTACION: ([A-Za-z\s]+) \(/;

    const lineas = this.infoText.split(/\r?\n/);

    let fecha = ''
    let hora = ''

    let fechaHora: Date | any

    lineas.forEach((linea, index) => {
      const coincidencias = linea.match(regexFecha)
      const coincidenciasH = linea.match(regexHora)

      const coinFreq = linea.match(regexfrecuencia)
      const coinNet = linea.match(regexnetwork)
      const coinSta = linea.match(regexstation)

      if (coinFreq) {
        this.sendData.delta = coinFreq[0]
      }

      if (coinNet && coinSta) {
        this.sendData.network = coinNet[0]
        this.sendData.station = coinSta[0]
      }

      if (coincidencias && coincidenciasH) {
        fecha = coincidencias[0]
        hora = coincidenciasH[0]
      }

      fechaHora = new Date(fecha + ' ' + hora)

    })

    if (fechaHora instanceof Date && !isNaN(fechaHora.getTime())) {
      this.sendData.starttime = fechaHora
      // this.controlForm.controls['starttime'].setValue(fechaHora)
    } else {
      let fechaHoy = new Date()
      this.sendData.starttime = fechaHoy
      // this.controlForm.controls['starttime'].setValue(fechaHoy)
    }

    let fila = 0;

    for (let i = 0; i < lineas.length; i++) {
      if (regex.test(lineas[i])) {
        fila = i + 1;
        break;
      }
    }
    if (fila !== 0) {
      // this.controlForm.controls['fr_line'].setValue(fila);
      // this.splitCols()
    } else {
      return
    }
  }

  crearSteam() {

    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 5 * 1000;
    snackBar.panelClass = ['snackBar-validator'];

    this.obsApi.convertToStream(this.sendData).subscribe({
      next: value => {
        let respData = {
          "url": value.url,
          "unit": this.sendData.unidad
        }
        this.matDialogRef.close(respData)
      },
      error: err => {
        this.snackBar.open('⚠️ Error CTS', 'cerrar', snackBar)
      }
    })

  }
}
