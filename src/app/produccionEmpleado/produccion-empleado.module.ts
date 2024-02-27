import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProduccionEmpleadoRoutingModule } from './produccion-empleado-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProduccionEmpleadoListComponent } from './produccion-empleado-list/produccion-empleado-list.component';
import { ProduccionEmpleCreateComponent } from './produccion-emple-create/produccion-emple-create.component';
import { ProduccionEmpleadoEditComponent } from './produccion-empleado-edit/produccion-empleado-edit.component';

@NgModule({
    declarations: [
      ProduccionEmpleadoListComponent,
      ProduccionEmpleCreateComponent,
      ProduccionEmpleadoEditComponent
    ],
    imports: [
      CommonModule,
      ProduccionEmpleadoRoutingModule,
      FormsModule,
      ReactiveFormsModule,
      IonicModule,
    ]
  })
  export class ProduccionEmpleadoModule { }
  