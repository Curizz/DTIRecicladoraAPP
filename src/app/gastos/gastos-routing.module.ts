import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GastosListComponent } from './gastos-list/gastos-list.component';
import { GastosCreateComponent } from './gastos-create/gastos-create.component';
import { GastosEditComponent } from './gastos-edit/gastos-edit.component';
const routes: Routes = [
  {
    path: 'gastos-list',
    component: GastosListComponent,
    // canActivate: [authGuard]
  },
  
  {
    path: 'gastos-create',
    component: GastosCreateComponent
  },
  {
    path: 'gastos-edit/:id',
    component:GastosEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GastosRoutingModule { }
