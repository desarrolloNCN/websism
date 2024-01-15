import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { VisorGraphComponent } from './pages/visor-graph/visor-graph.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {path: 'dashboard' , component: HomeComponent},
      {path: 'visor' , component: VisorGraphComponent},
      {path: '**' , redirectTo: 'dashboard'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
