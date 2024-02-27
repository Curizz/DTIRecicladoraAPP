
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProveedoresListComponent } from './proveedores-list/proveedores-list.component';
import { ProveedoresCreateComponent } from './proveedores-create/proveedores-create.component';
import { ProveedoresEditComponent } from './proveedores-edit/proveedores-edit.component';

const routes: Routes = [
    {
      path: 'proveedores-list',
      component: ProveedoresListComponent,
      // canActivate: [authGuard]
    },
    {
      path: 'proveedores-create',
      component: ProveedoresCreateComponent,
      // canActivate: [rolesGuard],
      // data: { puesto: 'Administrador' }
    },{
      path: 'proveedores-edit/:id',
      component: ProveedoresEditComponent,
    }
    /*{
      path: 'proveedorEdit/:id',
      component: ProveedorEditComponent,
      // canActivate: [rolesGuard],
      // data: { puesto: 'Administrador' }
    },*/
  ];
  
  @NgModule({
    imports: [CommonModule,RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ProveedoresRoutingModule { }
  

