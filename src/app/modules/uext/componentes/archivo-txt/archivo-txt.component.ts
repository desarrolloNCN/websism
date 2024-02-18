import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { LectorDemoComponent } from '../../pages/lector-demo/lector-demo.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ObspyAPIService } from 'src/app/service/obspy-api.service';

@Component({
  selector: 'app-archivo-txt',
  templateUrl: './archivo-txt.component.html',
  styleUrls: ['./archivo-txt.component.css']
})
export class ArchivoTXTComponent implements OnInit {

  infoText = ''
  maxRows = 0

  controlForm: FormGroup | any
  controlForm_2: FormGroup | any

  columnDetector: any = []
  columHead: any = []
  channels: any = []

  showTooltip = false
  showText = true

  loadingSpinnerText = false

  constructor(
    private matDialogRef: MatDialogRef<LectorDemoComponent>,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private obsApi: ObspyAPIService,
    @Inject(MAT_DIALOG_DATA) public url: any
  ) {
    this.controlForm = new FormGroup({
      fr_line: new FormControl('', Validators.required),
      ls_line: new FormControl('', Validators.required),
      delta: new FormControl('', Validators.required),
      unidad: new FormControl('', Validators.required),
      network: new FormControl('NC'),
      station: new FormControl('NCN01', Validators.required),
      location: new FormControl('00', Validators.required),
    })

    this.controlForm_2 = new FormGroup({

    })
  }

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
            this.controlForm.controls['ls_line'].setValue(lineas.length);
          },
          error: err => {
            this.snackBar.open('⚠️ Error GET-CP', 'cerrar', snackBar)
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

  @ViewChild('myPre') myPre!: ElementRef<HTMLPreElement>;

  rowNum: number = 1;
  colNum: number = 1;

  onPreClick(event: MouseEvent) {

    const target = event.target as HTMLPreElement;
    const selection = window.getSelection();

    if (selection) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();

      preCaretRange.selectNodeContents(target);
      preCaretRange.setEnd(range.endContainer!, range.endOffset!);

      const textBeforeCursor = target.textContent?.substring(0, range.endOffset!);
      const lastNewLineIndex = textBeforeCursor?.lastIndexOf('\n');

      const col = lastNewLineIndex !== -1 ? textBeforeCursor!.length - lastNewLineIndex! : range.endOffset!;
      const row = (textBeforeCursor?.match(/\n/g) || []).length + 1;

      this.rowNum = row;
      this.colNum = col;

      this.controlForm.controls['fr_line'].setValue(row);
      this.controlForm.controls['ls_line'].setValue(this.maxRows);

      this.splitCols()
    }
  }

  splitCols() {

    const lineas = this.infoText.trim().split('\n');
    // -?\d+\.\d+\s+-?\d+\.\d+\s+-?\d+\.\d+(?![^\n]*\n\n)
    let indiceInicioDatos = parseInt(this.controlForm.get('fr_line').value) - 1;

    const datosPrimeraLinea = lineas[indiceInicioDatos].trim().split(/[,;]\s*|\s+/).filter(Boolean);
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

    // TODO:Pendiente indicar Canales

    // this.columnDetector.forEach((item: any, index: number) => {
    //   if (index === 0) {
    //     this.channels.push('Z');
    //   } else if (index === 1) {
    //     this.channels.push('N');
    //   } else if (index === 2) {
    //     this.channels.push('E');
    //   } else {
    //     this.channels.push('C' + (index + 3)); 
    //   }
    // });


    Object.keys(this.controlForm.controls).forEach(key => {
      if (key.startsWith('c_')) {
        this.controlForm.removeControl(key);
      }
    });

    this.columnDetector.forEach((columna: any, index: string) => {
      this.controlForm.addControl('c_' + index, new FormControl('', Validators.required));
      // this.controlForm.addControl('cc_' + index, new FormControl('', Validators.required));
    });

  }

  crearSteam() {
    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 5 * 1000;
    snackBar.panelClass = ['snackBar-validator'];

    if (this.controlForm.valid) {

      this.obsApi.convertToStream(this.controlForm.value).subscribe({
        next: value => {
          let respData = {
            "url" : value.url,
            "unit" : this.controlForm.get('unidad').value
          }
          this.matDialogRef.close(respData)
        },
        error: err => {
          this.snackBar.open('⚠️ Error CTS', 'cerrar', snackBar)
        }
      })


    } else {
      this.snackBar.open('⚠️ Llene los Campos Necesarios', 'cerrar', snackBar)
    }

  }

  // ^\s*-?\d*\.?\d+\s+-?\d*\.?\d+\s+-?\d*\.?\d+\s*$

  buscarCoincidencia(): void {
    const regex = /^\s*-?\d*\.?\d+\s+-?\d*\.?\d+\s+-?\d*\.?\d+\s*$/;

    const lineas = this.infoText.split(/\r?\n/);
    let fila = 0;

    for (let i = 0; i < lineas.length; i++) {
      if (regex.test(lineas[i])) {
        fila = i + 1;
        break;
      }
    }
    if (fila !== 0) {
      this.controlForm.controls['fr_line'].setValue(fila);
      this.splitCols()
    } else {
      return
    }
  }

  Close() {
    let respData = {
      "url" : '',
      "unit" : ''
    }
    this.matDialogRef.close(respData)
  }

}
