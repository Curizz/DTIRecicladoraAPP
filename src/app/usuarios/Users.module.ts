import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersCreateComponent } from './users-create/users-create.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UsersRoutingModule } from './Users-routing.module';
import { UsersEditComponent } from './users-edit/users-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [
    UsersCreateComponent,
    UsersListComponent,
    UsersEditComponent
],
  imports: [
    CommonModule,
    FormsModule,
    UsersRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicModule
  ]
})
export class UsersModule { }
