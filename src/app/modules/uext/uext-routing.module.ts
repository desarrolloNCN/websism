import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserHomeComponent } from './pages/user-home/user-home.component';
import { LectorDemoComponent } from './pages/lector-demo/lector-demo.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {path: 'home' , component: UserHomeComponent},
      {path: 'lectorDemo' , component: LectorDemoComponent},
      {path: 'acerca' , component: AboutUsComponent},
      {path: '**' , redirectTo: 'home'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UextRoutingModule { }
