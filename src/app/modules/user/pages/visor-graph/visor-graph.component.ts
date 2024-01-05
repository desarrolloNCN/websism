import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ObspyAPIService } from 'src/app/service/obspy-api.service';

@Component({
  selector: 'app-visor-graph',
  templateUrl: './visor-graph.component.html',
  styleUrls: ['./visor-graph.component.css']
})
export class VisorGraphComponent implements OnInit {

  controlForm: FormGroup | any

  enproges = false

  arch: File[] | any = ''

  respData: any = []
  stationInfo: any = {}

  loadingSpinner = false

  btnShow = false
  btnCancel = true

  hideStaPanel = true

  constructor(
    private obsApi: ObspyAPIService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.controlForm = new FormGroup({
      url: new FormControl(''),
      archivo: new FormControl('')
    })
  }

  onFileSelected(event: any) {
    let archivos = event.target.files;
    this.controlForm.get('url').setValue('')

    if (archivos && archivos.length > 0) {
      this.arch = archivos[0];
      this.btnShow = true;
      this.btnCancel = false;
    } else {
      console.log('No se seleccionó ningún archivo');
      this.btnShow = false;
      this.btnCancel = true;
      this.arch = null;
    }
  }

  leerArchivo() {

    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 3 * 1000;
    snackBar.panelClass = ['snackBar-validator'];

    let textoValue = this.controlForm.get('url').value;
    let archivoValue = this.arch;

    this.groupedData = {}

    let valorNoVacio: string | File | undefined;

    this.loadingSpinner = true
    this.controlForm.get('url').disable()
    
    if (archivoValue instanceof File || typeof textoValue === 'string' && textoValue.trim() !== '') {

      valorNoVacio = archivoValue || textoValue
      console.log(valorNoVacio);
      
      this.obsApi.postFicha(valorNoVacio).subscribe({
        next: value => {
          this.groupedData = this.groupByNetworkAndStation(value.data)
        },
        error: err => console.error('Respuesta API ERROR: ' + err.message),
        complete: () => {
          this.controlForm.get('url').enable()
          this.loadingSpinner = false
        }
      }
      )
    } else {
      this.snackBar.open('No se encontro ARCHIVO o URL', 'cerrar', snackBar)
      this.loadingSpinner = false
      this.controlForm.get('url').enable()
    }
  }

  leer(e: any) {
    this.stationInfo = e
  }

  @ViewChild('fileInput') fileInput!: ElementRef

  deleteFile() {
    this.btnShow = false;
    this.btnCancel = true;
    this.controlForm.get('url').setValue('');
    this.fileInput.nativeElement.value = ''
    this.groupedData = {}
  }

  togglePanel() {
    this.hideStaPanel = !this.hideStaPanel
  }

  groupedData: { [key: string]: any[] } = {};
  selectedGroup: string | null = null;

  groupByNetworkAndStation(data: any[]): { [key: string]: any[] } {
    const grouped: { [key: string]: any[] } = {};

    data.forEach(item => {
      const key = `${item.network}.${item.station}`;

      if (!grouped[key]) {
        grouped[key] = [];
      }

      grouped[key].push(item);
    });

    return grouped;
  }

  selectGroup(groupKey: string): void {
    this.selectedGroup = groupKey;
  }

  getGroupValues(group: any): any[] {
    return Object.values(group.value);
  }

}
