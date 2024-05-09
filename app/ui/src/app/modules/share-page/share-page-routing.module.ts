import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharePageComponent } from 'src/app/modules/share-page/share-page.component';

const routes: Routes = [
  {
    path: '',
    component: SharePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharePageRoutingModule { }
