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

  sendData: { [key: string]: any; } = {
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

  columnDetector: any = []
  columHead: any = []
  channels: any = []

  msgLoad = 'Cargando...'

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
            this.msgLoad = '⚠️ Error al leer Datos'
            this.snackBar.open('⚠️ Error al leer Archivo', 'cerrar', snackBar)
            this.loadingSpinnerText = false
            this.showText = false
          },
          complete: () => {
            this.msgLoad = '✅ Leyendo Datos ...'
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

    const regexFecha_hora = /# HORA INICIO \(UTC-0\): (\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}Z)/;

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

      const coinFeHo = linea.match(regexFecha_hora)
      const coinFreq = linea.match(regexfrecuencia)
      const coinNet = linea.match(regexnetwork)
      const coinSta = linea.match(regexstation)

      if (coinFreq) {
        this.sendData['delta'] = (1 / parseFloat(coinFreq[1])).toString()
      }

      if (coinNet) {
        this.sendData['network'] = coinNet[1]
      }

      if (coinSta) {
        this.sendData['station'] = coinSta[1]
      }

      if (coinFeHo) {
        fechaHora = new Date(coinFeHo[1])
      }
      // if (coincidencias && coincidenciasH) {
      //   fecha = coincidencias[0]
      //   hora = coincidenciasH[0]
      // }

      // fechaHora = new Date(fecha + ' ' + hora)

    })

    if (fechaHora instanceof Date && !isNaN(fechaHora.getTime())) {
      this.sendData['starttime'] = fechaHora
      // this.controlForm.controls['starttime'].setValue(fechaHora)
    } else {
      let fechaHoy = new Date()
      this.sendData['starttime'] = fechaHoy
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
      this.sendData['fr_line'] = fila.toString()
      // this.controlForm.controls['fr_line'].setValue(fila);
      this.splitCols()
      this.crearSteam()
    } else {
      return
    }
  }

  splitCols() {
    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 5 * 1000;
    snackBar.panelClass = ['snackBar-validator'];

    let encabezados: string[] = []

    const lineas = this.infoText.trim().split('\n');

    let indiceInicioDatos = parseInt(this.sendData['fr_line']) - 1;
    const datosPrimeraLinea = lineas[indiceInicioDatos].trim().split(/[,;]\s*|\s+/).filter(Boolean);

    try {
      encabezados = lineas[indiceInicioDatos - 1].trim().split(/[^\w\s]+|\s+/).filter(Boolean)
    } catch (error) {
      encabezados = []
    }

    if (encabezados.length < datosPrimeraLinea.length) {
      for (let i = encabezados.length; i < datosPrimeraLinea.length; i++) {
        encabezados.push(`C${i + 1}`);
      }
    }

    if (encabezados.length > datosPrimeraLinea.length) {
      this.snackBar.open('✅ Verificar Encabezados', 'cerrar', snackBar)
      encabezados = []
      for (let i = 0; i < datosPrimeraLinea.length; i++) {
        encabezados.push(`C${i + 1}`);
      }
    }

    const numeroColumnas = datosPrimeraLinea.length;

    const valoresAgrupados: any[] = [];

    for (let j = 0; j < numeroColumnas; j++) {
      valoresAgrupados.push([]);
    }

    for (let i = indiceInicioDatos; i < lineas.length; i++) {
      const valoresLinea = lineas[i].trim().split(/[,;]\s*|\s+/).filter(Boolean);
      if (valoresLinea.length === numeroColumnas) {
        for (let j = 0; j < numeroColumnas; j++) {
          valoresAgrupados[j].push(parseFloat(valoresLinea[j]));
        }
      }
    }

    this.columnDetector = valoresAgrupados
    this.columHead = encabezados
    this.encabezadosGen(valoresAgrupados, encabezados)

  }

  encabezadosGen(valores: any, headers: any) {

    // ! Remueve los controles que empiezan por 'c_'

    Object.keys(this.sendData).forEach(key => {
      if (key.startsWith('c_') || key.startsWith('cc_') || key.startsWith('ccc_')) {
        delete this.sendData[key]
      }
    })

    valores.forEach((valores: any, index: string) => {
      Object.assign(this.sendData, { ['c_' + index]: valores })
      // this.controlForm.addControl('c_' + index, new FormControl(valores, Validators.required));
    });

    headers.forEach((headers: any, index: string) => {
      Object.assign(this.sendData, { ['cc_' + index]: headers })
      // this.controlForm.addControl('cc_' + index, new FormControl('', Validators.required));
    });

    // headers.forEach((headers: any, index: string) => {
    //   Object.assign(this.sendData, { ['ccc_' + index] : valores })
    //   this.controlForm.addControl('ccc_' + index, new FormControl(1, Validators.required));
    // });

  }

  crearSteam() {

    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 5 * 1000;
    snackBar.panelClass = ['snackBar-validator'];
    console.log(this.sendData);

    this.obsApi.convertToStream(this.sendData).subscribe({
      next: value => {
        let respData = {
          "url": value.url,
          "unit": this.sendData['unidad']
        }
        this.matDialogRef.close(respData)
      },
      error: err => {
        this.snackBar.open('⚠️ Error CTS', 'cerrar', snackBar)
      }
    })

  }
}
