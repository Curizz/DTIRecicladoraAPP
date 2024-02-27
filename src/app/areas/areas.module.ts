import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AreasListComponent } from './areas-list/areas-list.component';
import { AreasRoutingModule } from './areas-routing.module';

import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AreasCreateComponent } from './areas-create/areas-create.component';
import { AreasEditComponent } from './areas-edit/areas-edit.component';

@NgModule({
  declarations: [
        AreasListComponent,
        AreasCreateComponent,
        AreasEditComponent
    
  ],
  imports: [
    CommonModule,
    AreasRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    IonicModule
  ]
})
export class AreasModule { }
