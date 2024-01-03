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

  arch: File | any
  rarch: File | any

  respData : any = []
  stationInfo : any = {}


  constructor(
    private obsApi: ObspyAPIService
  ) { }

  ngOnInit(): void {
    this.controlForm = new FormGroup({
      archivo: new FormControl('', [Validators.required])
    })
  }

  onFileSelected(event: any) {
    this.arch = event.target.files[0];
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
    if (this.arch instanceof File) {
      this.obsApi.postFicha(this.arch).subscribe({
        next: value => {
          this.respData = value.data
          this.groupedData = this.groupByNetworkAndStation(value.data)
        },
        error: err => console.error('Observable emitted an error: ' + err),
        complete: () => console.log('Observable emitted the complete notification')
      }
      )
    } else {
      console.log('Selecciona un archivo');
    }
  }

  leer(e :any){
    this.stationInfo = e
  }

}
