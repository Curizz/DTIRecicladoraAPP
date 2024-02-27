import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProveedoresCreateComponent } from './proveedores-create/proveedores-create.component';
import { ProveedoresListComponent } from './proveedores-list/proveedores-list.component';
import { ProveedoresRoutingModule } from './proveedores-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { ProveedoresEditComponent } from './proveedores-edit/proveedores-edit.component';

@NgModule({
  declarations: [
    ProveedoresListComponent,
    ProveedoresCreateComponent,
    ProveedoresEditComponent
],
  imports: [
    CommonModule,
    FormsModule,
    ProveedoresRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicModule
  ]
})
export class ProveedoresModule { }
