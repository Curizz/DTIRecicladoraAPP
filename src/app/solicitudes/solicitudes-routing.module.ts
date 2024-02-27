import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SolicitudesListComponent } from './solicitudes-list/solicitudes-list.component';
import { SolicitudesCreateComponent } from './solicitudes-create/solicitudes-create.component';
import { SolicitudesEditComponent } from './solicitudes-edit/solicitudes-edit.component';

const routes: Routes = [
  {
    path: 'solicitudes-list',
    component: SolicitudesListComponent,
    // canActivate: [authGuard]
  },
  {
    path: 'solicitudes-create',
    component: SolicitudesCreateComponent
  },
  {
    path: 'solicitudes-edit/:id',
    component:SolicitudesEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitudesRoutingModule { }
