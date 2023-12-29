import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ObspyAPIService } from 'src/app/service/obspy-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  controlForm: FormGroup | any

  enproges = false

  arch: File | any
  rarch: File | any

  respData : any = []

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

  leerArchivo() {   
    if (this.arch instanceof File) {
      this.obsApi.postFicha(this.arch).subscribe({
        next: value => {
          this.respData = value.data
        },
        error: err => console.error('Observable emitted an error: ' + err),
        complete: () => console.log('Observable emitted the complete notification')
      }
      )
    } else {
      console.log('Selecciona un archivo');
    }
  }

}
