import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../Users.service';
import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';




@Component({
  selector: 'app-users-create',
  templateUrl: './users-create.component.html',
  styleUrls: ['./users-create.component.scss'],
})
export class UsersCreateComponent  implements OnInit {
  FomularioUsers : FormGroup;
  usuarioTienePermiso : boolean=false;
  puestos: any[]=[];
  areas: any[]=[];
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    public alertController:AlertController
  ) { 
    const correoSave = this.userService.getCorreo();
    const nombreUsuario = this.userService.getTipoUsuario();
    const idFabricaUsuario = this.userService.getIdFabricaUsuario();
    this.FomularioUsers = this.formBuilder.group({
      Nombre: [''],
      ApellidoPaterno: [''],
      ApellidoMaterno: [''],
      Correo: [''],
      Pass: [''],
      Practicante: ['No'],
      Sueldo : [''],
      Turno : [''],
      Domicilio : [''],
      idFabrica: [idFabricaUsuario],
      idTipoUsuario : [1],
      idAsignacion : [1],
      idArea : ['General'],
      UsuarioCreador : [correoSave]
    })

  }


  cancelar(){
    this.router.navigateByUrl('dashboard/users/usuarios-list');
  }
  enviarDatos(){
        if(this.FomularioUsers.valid){
          console.log('Se presiono el boton de registro');
          console.log('El formulario', this.FomularioUsers.value);
          this.userService.AgregarUsuartio(this.FomularioUsers.value).subscribe(
            (response)=>{
              console.log('Se registro correctamente');

            },
            (error)=>{
              console.log('No se pudo registrar');
              console.error(error);
            }
          );
        }
  }
  ngOnInit(): void {

    this.FomularioUsers.controls['Practicante'].valueChanges.subscribe(
      (Practicante) =>{
        if (Practicante === 'No'){
          console.log('Pusieron que no es practicante');
          this.FomularioUsers.controls['idAsignacion'].enable();
          this.FomularioUsers.controls['Turno'].enable();
          this.FomularioUsers.controls['idArea'].enable();
          this.FomularioUsers.controls['Sueldo'].enable();
        }else{
          console.log('Si es practicante ');
          this.FomularioUsers.controls['idAsignacion'].disable();
          this.FomularioUsers.controls['Turno'].disable();
          this.FomularioUsers.controls['idArea'].disable();
          this.FomularioUsers.controls['Sueldo'].disable();
          this.FomularioUsers.controls['idAsignacion'].reset();
          this.FomularioUsers.controls['Turno'].reset();
          this.FomularioUsers.controls['idArea'].reset();
          this.FomularioUsers.controls['Sueldo'].reset();
        }
      }
    );
    this.userService.SelectPuestos().subscribe((data) => {
      this.puestos=data;
    });

    this.userService.SelectAreas().subscribe((data)=>{
      this.areas=data;
    });

  }

}
