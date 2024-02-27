import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SolicitudesService } from '../solicitudes.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-solicitudes-create',
  templateUrl: './solicitudes-create.component.html',
  styleUrls: ['./solicitudes-create.component.scss'],
})
export class SolicitudesCreateComponent  implements OnInit {

  formularioSolicitud: FormGroup;
  areas: any[] = [];
  proveedor: any[]=[];
  
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private solicitudService: SolicitudesService,
    public alertController: AlertController
  ) { 
    const correoSave = this.solicitudService.getCorreo();
    const idFabrica = this.solicitudService.getIdFabrica();
    const idUsuario = this.solicitudService.getidUsuario();
    this.formularioSolicitud = this.formBuilder.group({
      nombreProducto: [],
      Peso:[],
      Dimensiones:[],
      FechaPeticion:[],
      Calibre:[],
      idProveedor:['',[Validators.required]],
      Composicion:[],
      //FechaRecepcion: ['', [Validators.required]],
      UsuarioCreador:[correoSave],
      idFabrica:[idFabrica],
      idUsuario:[idUsuario]
      
    });

  }

  ngOnInit(): void {
    this.solicitudService.selectProveedor().subscribe((data)=>{
      this.proveedor=data;
    });

  }


  enviarDatos():void{
    if(this.formularioSolicitud.valid){
      console.log('Datos que se enviaran: ', this.formularioSolicitud.value);
      console.log('Formulario Correcto');
      console.log('Se presionó el botón');
      console.log(this.formularioSolicitud.value);
      this.solicitudService.agregarSolicitud(this.formularioSolicitud.value).subscribe(
        (response) => {
          if (response.success === 1) {
           console.log('Registro exitoso');
           this.presentAlert1();
       } else {
           console.error('Error al registrar en la Base de Datos:', response.error);
           //this.mostrarDialogError();
       }
         },
         (error) => {
           // Manejar errores del servicio aquí
           //this.mostrarDialogError();
         }
      );
    }else{
      console.log('Datos que se enviaran: ', this.formularioSolicitud.value);
      console.log('Formulario incorrecto')
     this.presentAlertError();
    
    }

  }
  CANCELAR(){
    this.router.navigateByUrl('/dashboard/solicitudes/solicitudes-list');
  }


    async presentAlert1(){
    const alert = await this.alertController.create({
      header: "Aviso",
      message: "Se registro correctamente la solicitud",
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          this.router.navigateByUrl('/dashboard/solicitudes/solicitudes-list');
          setTimeout(() => {
            window.location.reload();
          }, 10); // Puedes ajustar el tiempo de espera según sea necesario
        }
      }]
    });
    await alert.present()
    let result = await alert.onDidDismiss();
    console.log(result);
  }
  async presentAlertError(){
    const alert = await this.alertController.create({
      header: "Error",
      message: "No se pudo registrar la solicitud",
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          this.router.navigateByUrl('/dashboard/solicitudes/solicitudes-list');
          setTimeout(() => {
            window.location.reload();
          }, 10); // Puedes ajustar el tiempo de espera según sea necesario
        }
      }]
    });
    await alert.present()
    let result = await alert.onDidDismiss();
    console.log(result);
  }
}
