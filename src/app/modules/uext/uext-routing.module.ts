import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserHomeComponent } from './pages/user-home/user-home.component';
import { LectorDemoComponent } from './pages/lector-demo/lector-demo.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { ReadDataComponent } from './componentes/read-data/read-data.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {path: 'home' , component: UserHomeComponent},
      // {path: 'lectorData/:url', component: ReadDataComponent},
      {path: 'lectorDemo/:url' , component: LectorDemoComponent},
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
