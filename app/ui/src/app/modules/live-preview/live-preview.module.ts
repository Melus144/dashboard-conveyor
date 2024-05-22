import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LivePreviewRoutingComponent } from './live-preview-routing.module';
import { LivePreviewComponent } from './live-preview.component';


@NgModule({
  declarations: [
    LivePreviewComponent
  ],
  imports: [
    CommonModule,
    LivePreviewRoutingComponent,
  ]
})
export class LivePreviewModule { }