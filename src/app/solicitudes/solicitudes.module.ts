import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudesRoutingModule } from './solicitudes-routing.module';
import { SolicitudesListComponent } from './solicitudes-list/solicitudes-list.component';
import { SolicitudesEditComponent } from './solicitudes-edit/solicitudes-edit.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { SolicitudesCreateComponent } from './solicitudes-create/solicitudes-create.component';
@NgModule({
  declarations: [
   SolicitudesListComponent,
   SolicitudesCreateComponent,
   SolicitudesEditComponent
  ],
  imports: [
    CommonModule,
    SolicitudesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicModule
  ]
})
export class SolicitudesModule { }
