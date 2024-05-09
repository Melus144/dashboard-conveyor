import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoPageRoutingModule } from '../info-page/info-page-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { InfoPageComponent } from './info-page.component';



@NgModule({
  declarations: [
    InfoPageComponent
  ],
  imports: [
    CommonModule,
    InfoPageRoutingModule,
  ]
})
export class InfoPageModule { }
