import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ObspyAPIService } from 'src/app/service/obspy-api.service';

@Component({
  selector: 'app-visor-graph',
  templateUrl: './visor-graph.component.html',
  styleUrls: ['./visor-graph.component.css']
})
export class VisorGraphComponent implements OnInit {

  controlForm: FormGroup | any

  enproges = false

  arch: File | any = ''
  rarch: File | any

  respData: any = []
  stationInfo: any = {}
  tracedata: any = []
  btnShow = false
  btnCancel = true

  constructor(
    private obsApi: ObspyAPIService
  ) { }

  ngOnInit(): void {
    this.controlForm = new FormGroup({
      url: new FormControl(''),
      archivo: new FormControl('')
    })
  }

  onFileSelected(event: any) {
    this.controlForm.get('url').setValue('');
    this.arch = null
    const archivos = event.target.files;

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

  leerArchivo() {
    const textoValue = this.controlForm.get('url').value;
    const archivoValue = this.arch;

    this.groupedData = {}

    let valorNoVacio: string | File | undefined;

    if (archivoValue instanceof File || typeof textoValue === 'string') {
      valorNoVacio = archivoValue || textoValue
      this.obsApi.postFicha(valorNoVacio).subscribe({
        next: value => {
          this.groupedData = this.groupByNetworkAndStation(value.data)
          this.tracedata = value.traces
        },
        error: err => console.error('Respuesta API ERROR: ' + err),
        complete: () => console.log('Respuesta de API completada')
      }
      )
    } else {
      console.log('Selecciona un archivo');
    }
  }

  leer(e: any) {
    this.stationInfo = e
  }

  deleteFile() {
    this.btnShow = false;
    this.btnCancel = true;
    this.arch = ''
    this.groupedData = {}
  }

}
