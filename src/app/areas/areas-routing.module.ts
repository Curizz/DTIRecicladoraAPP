import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AreasListComponent } from './areas-list/areas-list.component';
import { AreasCreateComponent } from './areas-create/areas-create.component';
import { AreasEditComponent } from './areas-edit/areas-edit.component';

const routes: Routes = [
  {
    path: 'areas-list',
    component: AreasListComponent,
    // canActivate: [authGuard]
  },
  {
    path: 'areas-create',
    component: AreasCreateComponent
  },
  {
    path: 'areas-edit/:id',
    component: AreasEditComponent
  }
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]

})
export class AreasRoutingModule { }
