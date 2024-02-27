import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder } from '@angular/forms'
import { Router,ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserService } from '../Users.service';


@Component({
  selector: 'app-users-edit',
  templateUrl: './users-edit.component.html',
  styleUrls: ['./users-edit.component.scss'],
})
export class UsersEditComponent  implements OnInit {
  FormularioEditUsers : FormGroup;
  idRecibido: any;
  puestos: any[]=[];
  areas:any[]=[];
  tipoUsuarios : any[] = [];
  fabricas : any[]= [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private userService: UserService,
    private activeRouter: ActivatedRoute
  ) { 
    const correoSave = this.userService.getCorreo();
      const nombreUsuario = this.userService.getTipoUsuario();
      this.FormularioEditUsers = this.formBuilder.group({
        Nombre: [''],
        ApellidoPaterno: [''],
        ApellidoMaterno: [''],
        Correo: [''],
        Pass: [''],
        Practicante: [''],
        Sueldo : [''],
        Turno : [''],
        Domicilio : [''],
        idFabrica : [''],
        idTipoUsuario : [''],
        idAsignacion : [''],
        idArea : [''],
        UsuarioActualizador:[correoSave]
      });
  }

  enviarDatos(): void{
    if (this.FormularioEditUsers.valid) {
      console.log('Id recibido: ', this.idRecibido);
      console.log('Datos que se enviaran: ', this.FormularioEditUsers.value);
      this.userService.UpdateEmpleado(this.idRecibido, this.FormularioEditUsers.value).subscribe(
        (response) => {
         console.log('Respuesta del servidor: ', response);

         if (response.success === 1){
          console.log('La actualización fue exitosa');

          const usuarioActualizado = response.data;
          console.log('Datos del usuario actualizados: ', usuarioActualizado);
         //this.mostratDialogoAviso();
         this.presentAlert1();
         } else {
          console.error('Error al actualizar el usuario: ', response.error);
         }

        },
        (error) => {
          console.error('Error al actualizar el usuario con error: ', error);

          // Manejar errores del servicio aquí
        }
      );
    }
  }

  cancelar(){
    this.router.navigateByUrl('dashboard/users/usuarios-list');
  }
  ngOnInit():void {
    console.log('AQUI ABAJO SE MOSTRARIA EL CORREO QUE SE TRAE DESDE EL LOCALSTORAGE');
      const correoSave = this.userService.getCorreo();
      console.log('Correo desde el localStorage: ', correoSave);

      console.log('AQUI ABAJO SE MOSTRARIA EL NOMBRE QUE SE TRAE DESDE EL LOCALSTORAGE');
      const nombreSave = this.userService.getNombre();
      console.log('Nombre desde el localStorage: ', nombreSave);

      this.idRecibido = this.activeRouter.snapshot.paramMap.get('id');
        console.log('Obtenemos el ID: ',this.idRecibido);
        this.userService.EditarEmpleado(this.idRecibido).subscribe(
          respuesta => {
          console.log('Respuesta del servicio', respuesta);
          if (respuesta && typeof respuesta === 'object') {
            // Asegúrate de que los datos se serialicen como JSON válido
            try {
  
            this.FormularioEditUsers.setValue({
              Nombre: respuesta.Nombre,
              ApellidoPaterno: respuesta.ApellidoPaterno,
              ApellidoMaterno: respuesta.ApellidoMaterno,
              Correo: respuesta.Correo,
              Pass: respuesta.Pass,
              Practicante: respuesta.Practicante,
              Sueldo: respuesta.Sueldo,
              Turno: respuesta.Turno,
              Domicilio: respuesta.Domicilio,
              idFabrica: respuesta.idFabrica.toString(),
              idTipoUsuario: respuesta.idTipoUsuario.toString(),
              idAsignacion: respuesta.idAsignacion.toString(),
              idArea: respuesta.idArea.toString(),
              UsuarioActualizador: respuesta.UsuarioActualizador || correoSave,
            });
            // this.formularioEditarEmpleado.controls['Practicante'].setValue(respuesta.Practicante);
  
          } catch (error) {
            console.error('Error al deserializar los datos JSON:', error);
          }
        } else {
          console.error('No se encontraron datos válidos para el ID proporcionado.');
          // Aquí puedes mostrar un mensaje de error al usuario o redirigir a una página de error.
        }
  
        });
        
      this.FormularioEditUsers.controls['Practicante'].valueChanges.subscribe(
        (Practicante) => {
          if (Practicante === 'No') {
            this.FormularioEditUsers.controls['idAsignacion'].enable();
            this.FormularioEditUsers.controls['Turno'].enable();
            this.FormularioEditUsers.controls['idArea'].enable();
            this.FormularioEditUsers.controls['Sueldo'].enable();

          } else {
            this.FormularioEditUsers.controls['idAsignacion'].disable();
            this.FormularioEditUsers.controls['Turno'].disable();
            this.FormularioEditUsers.controls['idArea'].disable();
            this.FormularioEditUsers.controls['Sueldo'].disable();

            this.FormularioEditUsers.controls['idAsignacion'].reset();
            this.FormularioEditUsers.controls['Turno'].reset();
            this.FormularioEditUsers.controls['idArea'].reset();
            this.FormularioEditUsers.controls['Sueldo'].reset();

          }
        }

        );
         // Puedes realizar alguna inicialización adicional aquí si es necesario.
      this.userService.SelectAreas().subscribe((data) => {
        this.areas=data;
      });

      this.userService.SelectPuestos().subscribe((data) => {
        this.puestos=data;
      });

      this.userService.SelectTipoUsuarios().subscribe((data) => {
        this.tipoUsuarios=data;
      });

      this.userService.SelectFabricas().subscribe((data) => {
        this.fabricas=data;
      });
  }


  async presentAlert1(){
    const alert = await this.alertController.create({
      header: "Actualizacion",
      message: "El usuario se actualizo correctamente",
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          this.router.navigateByUrl('/dashboard/users/usuarios-list');
          setTimeout(() => {
            window.location.reload();
          }, 50); // Puedes ajustar el tiempo de espera según sea necesario
        }
      }]
    });
    await alert.present()
    let result = await alert.onDidDismiss();
    console.log(result);
  }
}
