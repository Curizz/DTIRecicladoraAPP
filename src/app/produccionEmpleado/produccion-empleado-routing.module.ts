import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ProduccionEmpleadoListComponent } from './produccion-empleado-list/produccion-empleado-list.component';
import { ProduccionEmpleCreateComponent } from './produccion-emple-create/produccion-emple-create.component';
import { ProduccionEmpleadoEditComponent } from './produccion-empleado-edit/produccion-empleado-edit.component';

const routes: Routes = [
  {
    path: 'produccionEmpleado-list',
    component:ProduccionEmpleadoListComponent
  },
  {
    path: 'produccionEmple-create',
    component:ProduccionEmpleCreateComponent
  },
  {
    path: 'produccionEmpleado-edit/:id',
    component:ProduccionEmpleadoEditComponent
  }
  /*{
    path: 'produccionEmpleadoDetails/:id',
    component:ProduccionEmpleadoEditComponent
  },*/
 ];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ProduccionEmpleadoRoutingModule { }
