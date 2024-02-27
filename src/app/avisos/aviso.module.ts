import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { HttpClientModule } from '@angular/common/http';
import { AvisoDialogComponent } from './aviso-dialog/aviso-dialog.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [
   
    AvisoDialogComponent,
  
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    IonicModule
  ]
})
export class AvisosModule { }
