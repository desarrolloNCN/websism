import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserHomeComponent } from './pages/user-home/user-home.component';
import { LectorDemoComponent } from './pages/lector-demo/lector-demo.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {path: 'home' , component: UserHomeComponent},
      {path: 'lectorDemo' , component: LectorDemoComponent},
      {path: '**' , redirectTo: 'home'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UextRoutingModule { }
