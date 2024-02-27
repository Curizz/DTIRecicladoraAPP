
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UsersCreateComponent } from './users-create/users-create.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UsersEditComponent } from './users-edit/users-edit.component';


const routes: Routes = [
    {
      path: 'usuarios-list',
      component: UsersListComponent,
      // canActivate: [authGuard]
    },
    {
      path: 'usuarios-create',
      component: UsersCreateComponent,
      // canActivate: [rolesGuard],
      // data: { puesto: 'Administrador' }
    },
    {
      path: 'users-edit/:id',
      component: UsersEditComponent,
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
  export class UsersRoutingModule { }
  

