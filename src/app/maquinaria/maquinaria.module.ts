import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MaquinariaListComponent } from './maquinaria-list/maquinaria-list.component';
import { MaquinariaCreateComponent } from './maquinaria-create/maquinaria-create.component';
import { IonicModule } from '@ionic/angular';
import { MaquinasRoutingModule } from './maquinaria-routing.module';
import { MaquinariaEditComponent } from './maquinaria-edit/maquinaria-edit.component';


@NgModule({
  declarations: [
    MaquinariaListComponent,
    MaquinariaCreateComponent,
    MaquinariaEditComponent
  ],
  imports: [
    CommonModule,
    MaquinasRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    
    IonicModule
  ]
})
export class MaquinariaModule { }
