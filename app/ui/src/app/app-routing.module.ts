import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'live-preview',
    loadChildren: () => import('./modules/live-preview/live-preview.module').then(m => m.LivePreviewModule)
  },
  {
    path: 'info-page',
    loadChildren: () => import('./modules/info-page/info-page.module').then(m => m.InfoPageModule)
  },
  {
    path: 'model-view',
    loadChildren: () => import('./modules/model-view/model-view.module').then(m => m.ModelViewModule)
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
    path: 'user',
    loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule)
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
