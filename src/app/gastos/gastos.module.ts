import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GastosRoutingModule } from './gastos-routing.module';
import { GastosListComponent } from './gastos-list/gastos-list.component';
import { GastosCreateComponent } from './gastos-create/gastos-create.component';
import { GastosEditComponent } from './gastos-edit/gastos-edit.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [
    GastosListComponent,
    GastosCreateComponent,
    GastosEditComponent
],
  imports: [
    CommonModule,
    GastosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicModule
  ]
})
export class GastosModule { }