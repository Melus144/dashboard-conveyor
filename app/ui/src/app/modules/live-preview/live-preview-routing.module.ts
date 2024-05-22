import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LivePreviewComponent } from './live-preview.component';

const routes: Routes = [
  {
    path: '',
    component: LivePreviewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LivePreviewRoutingComponent { }
