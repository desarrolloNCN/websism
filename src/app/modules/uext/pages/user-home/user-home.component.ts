import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ObspyAPIService } from 'src/app/service/obspy-api.service';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {

  controlForm: FormGroup | any

  enproges = false

  arch: File | any
  rarch: File | any

  respData : any = []

  constructor(
    private obsApi: ObspyAPIService,
    private router: Router,
  ) { }

  ngOnInit(): void {

    this.controlForm = new FormGroup({
      archivo: new FormControl('', [Validators.required])
    })

  }

  drop(event:any): void {
    if(event.previousContainer === event.container){
      moveItemInArray(this.arch, event.previousIndex, event.currentIndex)
    }else{
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      )
    }
  }

  onFileSelected(event: any) {
    this.arch = event.target.files[0];
  }

  leerArchivo() {   
    // if (this.arch instanceof File) {
    //   this.obsApi.postFicha(this.arch).subscribe({
    //     next: value => {
    //       this.respData = value.data
    //     },
    //     error: err => console.error('Observable emitted an error: ' + err),
    //     complete: () => console.log('Observable emitted the complete notification')
    //   }
    //   )
    // } else {
    //   console.log('Selecciona un archivo');
    // }
  }

  redirecToVisor(){
    this.router.navigateByUrl('/user/visor')
  }

}
