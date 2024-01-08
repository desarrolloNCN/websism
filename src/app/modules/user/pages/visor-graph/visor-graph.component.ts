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

  urlFile = ''
  idFile = ''
  stringdata = ''

  plotedimages: any = []

  constructor(
    private obsApi: ObspyAPIService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    localStorage.clear()
    this.controlForm = new FormGroup({
      url: new FormControl(''),

    })
  }

  onFileSelected(event: any) {
    let archivos = event.target.files;
    this.controlForm.get('url').setValue('')

    if (archivos && archivos.length > 0) {
      this.arch = archivos[0];
      this.btnShow = true;
      this.btnCancel = false;
      this.controlForm.get('url').disable()
    } else {
      console.log('No se seleccionó ningún archivo');
      this.btnShow = false;
      this.btnCancel = true;
      this.arch = null;
    }
  }

  @ViewChild('fileInput') fileInput!: ElementRef

  leerArchivo() {

    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 3 * 1000;
    snackBar.panelClass = ['snackBar-validator'];

    let textoValue = this.controlForm.get('url').value;
    let archivoValue = this.arch;

    this.groupedData = {}

    let valorNoVacio: string | File | undefined;

    //this.loadingSpinner = true

    if (archivoValue instanceof File || typeof textoValue === 'string' && textoValue.trim() !== '') {

      valorNoVacio = archivoValue || textoValue

      this.obsApi.uploadFile(valorNoVacio).subscribe({
        next: value => {
          this.idFile = value.id,
            this.urlFile = value.file
          this.stringdata = value.string_data
          localStorage.setItem('idSesion', value.id)
          localStorage.setItem('urlFileUpload', value.file)
          localStorage.setItem('urlSearched', value.string_data)
        },
        error: err => console.error('REQUEST API ERROR: ' + err.message),
        complete: () => {

          if (this.urlFile == null) {
            this.obsApi.getData(this.stringdata).subscribe({
              next: value => {
                this.groupedData = this.groupByNetworkAndStation(value.data)
              },
              error: err => console.error('REQUEST API ERROR: ' + err.message),
              complete: () => {
                this.loadingSpinner = false
              }
            })

          } else if (this.stringdata == null) {
            this.obsApi.getData(this.urlFile).subscribe({
              next: value => {
                this.groupedData = this.groupByNetworkAndStation(value.data)
              },
              error: err => console.error('REQUEST API ERROR: ' + err.message),
              complete: () => {
                this.loadingSpinner = false
              }
            })
          } else {
            this.snackBar.open('No se puede leer Datos', 'cerrar', snackBar)
          }

        }
      })
    } else {
      this.snackBar.open('No se encontro ARCHIVO o URL', 'cerrar', snackBar)
      this.loadingSpinner = false
    }
  }

  leer(e: any) {

    this.stationInfo = e

    let dataFile: string = localStorage.getItem('urlFileUpload')!
    let dataString: string = localStorage.getItem('urlSearched')!

    let dataToUse: string = dataFile !== null ? dataFile : dataString !== null ? dataString : "";

    this.obsApi.getPlotStation(dataToUse, e.station, e.channel).subscribe({
      next: value => {
        this.plotedimages = value
      },
      error: err => console.error('REQUEST API ERROR: ' + err.message),
      complete: () => { }
    })

  }

  deleteFile() {
    this.btnShow = false;
    this.btnCancel = true;
    this.fileInput.nativeElement.value = ''
    this.groupedData = {}
    this.arch = ''
    this.controlForm.get('url').enable()
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
