import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserPanelComponent } from './layout/user-panel/user-panel.component';

const routes: Routes = [
  {
    path: 'user',
    component: UserPanelComponent,
    loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule),
  },
  {
    path: '',
    loadChildren: () => import('./modules/uext/uext.module').then(m => m.UextModule),
  },
  {
    path: '**',
    redirectTo: 'user'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
