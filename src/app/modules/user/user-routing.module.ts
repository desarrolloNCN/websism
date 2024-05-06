import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { VisorGraphComponent } from './pages/visor-graph/visor-graph.component';
import { UserProjectsComponent } from './pages/user-projects/user-projects.component';

const routes: Routes = [
  {
    path: '',
    children: [
      // {path: 'dashboard' , component: HomeComponent},
      {path: 'lectorAcel' , component: VisorGraphComponent},
      {path: 'proyectos' , component: UserProjectsComponent},
      {path: '**' , redirectTo: 'proyectos'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
