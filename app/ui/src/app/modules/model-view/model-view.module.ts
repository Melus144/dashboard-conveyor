import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModelViewComponent } from './model-view.component';
import { ModelViewRoutingComponent } from './model-view-routing.module';


@NgModule({
  declarations: [
    ModelViewComponent
  ],
  imports: [
    CommonModule,
    ModelViewRoutingComponent,
  ]
})
export class ModelViewModule { }