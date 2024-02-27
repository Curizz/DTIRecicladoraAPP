import { Component, OnInit } from '@angular/core';
import { PeriodicElement } from '../PeriodicElement';
import { UserService } from '../Users.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent  implements OnInit {

  users: PeriodicElement []=[];


  constructor(
    private router: Router,
    private alertController: AlertController,
    private userService : UserService,
  ) { }

  crearUsuarios(){
    
    this.router.navigateByUrl('dashboard/users/usuarios-create');
  }

  mostrarDialogoDeConfirmacion2(element: PeriodicElement): void{

  }
  ngOnInit():void {
    this.userService.listaEmpleado().subscribe((respuesta: PeriodicElement[])=>{
      console.log(respuesta);
      this.users = respuesta;
    })
  }

}
