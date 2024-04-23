import { Component, Inject, OnInit } from '@angular/core';
import { VisorGraphComponent } from '../../pages/visor-graph/visor-graph.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ObspyAPIService } from 'src/app/service/obspy-api.service';
import { RegisterUserService } from 'src/app/service/register-user.service';

@Component({
  selector: 'app-download-file',
  templateUrl: './download-file.component.html',
  styleUrls: ['./download-file.component.css']
})
export class DownloadFileComponent implements OnInit {

  min_time = ''
  max_time = ''
  dur_recorte = ''

  h = 0
  m = 0
  s = 0
  ms = 0

  og_h = 0
  og_m = 0
  og_s = 0
  og_ms = 0

  stream_info: any[] = []
  checked_sta: any[] = []

  loadData = false

  itemSelect: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<VisorGraphComponent>,
    private obsApi: ObspyAPIService,
    private userApi: RegisterUserService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {

    this.loadData = true

    const t_min = parseFloat(this.data.trim.t_min);
    const t_max = parseFloat(this.data.trim.t_max);

    let utc_min: any
    let utc_max: any

    let min = ''
    let max = ''

    if (isNaN(t_min) && isNaN(t_max)) {
      min = ''
      max = ''
    } else {

      utc_min = new Date(this.data.start_time);
      utc_max = new Date(this.data.end_time);

      const diff = utc_max.getTime() - utc_min.getTime();
      this.h = Math.floor(diff / (1000 * 60 * 60));
      this.m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      this.s = Math.floor((diff % (1000 * 60)) / 1000);
      this.ms = diff % 1000;

      utc_min.setUTCSeconds(utc_min.getUTCSeconds() + t_min);
      utc_max.setUTCSeconds(utc_max.getUTCSeconds() + t_max);

      min = utc_min.toISOString()
      max = utc_max.toISOString()

      this.min_time = this.dateConverter(min)
      this.max_time = this.dateConverter(max)

      const re_min = new Date(min)
      const re_max = new Date(max)

      const diff_2 = re_max.getTime() - re_min.getTime();
      this.og_h = Math.floor(diff_2 / (1000 * 60 * 60));
      this.og_m = Math.floor((diff_2 % (1000 * 60 * 60)) / (1000 * 60));
      this.og_s = Math.floor((diff_2 % (1000 * 60)) / 1000);
      this.og_ms = diff_2 % 1000;
    }

    this.data.urls.forEach((e: any) => {
      this.obsApi.getData(e.url_gen).subscribe({
        next: value => {
          this.stream_info = value.data
        },
        complete: () => {
          this.loadData = false
          const find_og = this.stream_info.find(item => item.network == this.data.og_data.network && item.station == this.data.og_data.station && item.location == this.data.og_data.location && item.channel == this.data.og_data.channel)
          if (find_og) {
            this.checked_sta.push(find_og)
            this.itemSelect = true
          }
        }
      })
    });

  }

  sendDatatoProcess() {
    let base = this.data.base
    let f_type = this.data.filter.type
    let f_fre_min = this.data.filter.freqmin
    let f_fre_max = this.data.filter.freqmax
    let f_order = this.data.filter.order
    let f_zero = this.data.filter.zero
    let t_min = this.data.trim.t_min
    let t_max = this.data.trim.t_max

    this.userApi.mseedDownload(this.data.urls, this.data.og_data, this.checked_sta, base, f_type, f_fre_min, f_fre_max, f_order, f_zero, t_min, t_max, '', '')
      .subscribe({

      })
  }

  onChange(event: any, item: any) {
    const index = this.checked_sta.findIndex(i => i === item);

    if (index === -1) {
      this.checked_sta.push(item)
    } else {
      this.checked_sta.splice(index, 1);
    }

    console.log(this.checked_sta);
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

  dateConverter(date: string) {

    const fechaHora = new Date(date);
    const formatoFechaHora = fechaHora.toISOString().replace('T', ' ').replace(/\.\d+Z$/, '');

    return formatoFechaHora
  }

}
