import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaquinariaListComponent } from './maquinaria-list/maquinaria-list.component';
import { MaquinariaCreateComponent } from './maquinaria-create/maquinaria-create.component';
import { MaquinariaEditComponent } from './maquinaria-edit/maquinaria-edit.component';

const routes: Routes = [
  {
    path: 'maquinarias-list',
    component: MaquinariaListComponent,
    // canActivate: [authGuard]
  },
  {
    path: 'maquinarias-create',
    component: MaquinariaCreateComponent,
    // canActivate: [authGuard]
  },
  {
    path: 'maquinaria-edit/:id',
    component: MaquinariaEditComponent,
    // canActivate: [authGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaquinasRoutingModule { }
