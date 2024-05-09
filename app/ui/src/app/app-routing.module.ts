import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'share-page',
    loadChildren: () => import('./modules/share-page/share-page.module').then(m => m.SharePageModule)
  },
  {
    path: 'info-page',
    loadChildren: () => import('./modules/info-page/info-page.module').then(m => m.InfoPageModule)
  },
  {
    path: 'settings-page',
    loadChildren: () => import('./modules/settings-page/settings-page.module').then(m => m.SettingsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule)
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
