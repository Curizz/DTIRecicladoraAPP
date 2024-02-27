import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SolicitudesService } from '../solicitudes.service';
import { Estado } from '../estado';

@Component({
  selector: 'app-solicitudes-edit',
  templateUrl: './solicitudes-edit.component.html',
  styleUrls: ['./solicitudes-edit.component.scss'],
})
export class SolicitudesEditComponent  implements OnInit {
  formularioSolicitud: FormGroup;
  proveedor: any[]=[];
  Estado:any;
  idRecibido: any;
  idSolicitud: any;
  usuarioTienePermisoSuper: boolean = false;
  usuarioTienePermisoDeAdmin: boolean=false;
  usuarioesEncargado: boolean=false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private solicitudService: SolicitudesService,
    public alertController: AlertController,
    private activeRoute: ActivatedRoute
  ) { 
    this.usuarioTienePermisoSuper = this.verificarPermisosDelUsuarioSuper();
    this.usuarioTienePermisoDeAdmin=this.verificarPermisosDeAdmin();
    this.usuarioesEncargado = this.verificarSiEsEncargado();
    const correoSave = this.solicitudService.getCorreo();
    const idFabrica = this.solicitudService.getIdFabrica();
    this.formularioSolicitud = this.formBuilder.group({
      nombreProducto: [],
      Peso:[],
      Dimensiones:[],
      FechaPeticion:[],
      Calibre:[],
      idProveedor:[],
      Composicion:[],
      FechaRecepcion: [],
      Estado:[],
      UsuarioActualizador: [correoSave]

    });
    this.activeRoute.paramMap.subscribe((params) => {
      this.idRecibido = params.get('id');
      console.log('ID Recibido:', this.idRecibido);
      this.solicitudService.consultarSolicitudes(this.idRecibido).subscribe(respuesta => {
        console.log('Respuesta del servicio:', respuesta);
        if (respuesta && typeof respuesta === 'object') {
          try {
            this.formularioSolicitud.setValue({
            nombreProducto: respuesta.nombreProducto,
            Peso: respuesta.Peso,
            Dimensiones:  respuesta.Dimensiones,
            FechaPeticion: respuesta.FechaPeticion,
            Calibre: respuesta.Calibre,
            idProveedor: respuesta.idProveedor.toString(),
            Composicion: respuesta.Composicion,
            FechaRecepcion: respuesta.FechaRecepcion,
            Estado: respuesta.Estado,
            UsuarioActualizador:respuesta.UsuarioActualizador || correoSave
            });
          } catch (error) {
            console.error('Error al asignar los datos JSON:', error);
          }
        } else {
          console.error('No se encontraron datos válidos para el ID proporcionado.');
        }
      });


    });
  }

  async UPDATEAPROBAR() {
    console.log('Se presionó el botón de aprobar');
    const idSolicitud = this.idRecibido;
    const Aprobador = this.solicitudService.getCorreo();
    const estado: Estado = {
      idSolicitud: idSolicitud,
      estado: 'Aprobada',
      usuarioAprobador: Aprobador
    };
  
    const confirmationAlert = await this.alertController.create({
      header: 'Confirmar aprobación',
      message: '¿Estás seguro de que deseas aprobar esta solicitud?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Aprobación cancelada');
          }
        },
        {
          text: 'Aceptar',
          handler: async () => {
            // Mostrar el alert de carga
            const loadingAlert = await this.alertController.create({
              message: 'Cargando...',
              translucent: true
            });
            await loadingAlert.present();
            // Llamar al servicio para aprobar la solicitud
            this.solicitudService.aprobarorechazarSoli(estado).subscribe(
              async response => {
                console.log('Respuesta del servidor:', response); 
                // Cerrar el alert de carga
                await loadingAlert.dismiss();
                if (response && response.success) {
                  if (response.success === 1) {
                    console.log('Estado de la solicitud actualizado correctamente');
                    this.mostrarDialogoAviso(response.mensaje);
                  } else if (response.success === 2) {
                    console.log('La solicitud ya ha sido aprobada o rechazada');
                    this.mostrarDialogError('Esta acción no se puede realizar porque. ' + response.mensaje);
                  } else {
                    console.log('Hubo un problema, no se pudo actualizar el estado');
                    this.mostrarDialogError(response.mensaje);
                  }
                } else {
                  console.log('Respuesta desconocida:', response);
                  this.mostrarDialogError('Respuesta desconocida del servidor');
                }
              },
              async error => {
                console.error('Error en la solicitud:', error);
    
                // Cerrar el alert de carga
                await loadingAlert.dismiss();
    
                this.mostrarDialogError('Hubo un error en la solicitud al servidor');
              }
            );
          }
        }
      ]
    });
  
    await confirmationAlert.present();
  }
  

  async UPDATERECHAZAR() {
    console.log('Se presionó el botón de rechazar');
    const idSolicitud = this.idRecibido;
    const Aprobador = this.solicitudService.getCorreo();
    const estado: Estado = {
      idSolicitud: idSolicitud,
      estado: 'Rechazada',
      usuarioAprobador: Aprobador
    };

    const confirmationAlert = await this.alertController.create({
      header: 'Confirmar rechazo',
      message: '¿Estás seguro de que deseas rechazar esta solicitud?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Rechazo cancelado');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            // Mostrar el alert de carga
            this.presentLoadingAlert();
            // Llamar al servicio para aprobar o rechazar la solicitud
            this.solicitudService.aprobarorechazarSoli(estado).subscribe(
              async response => {
                console.log('Respuesta del servidor:', response);
                // Cerrar el alert de carga
                await this.dismissLoadingAlert();
                if (response && response.success) {
                  if (response.success === 1) {
                    console.log('Estado de la solicitud actualizado correctamente');
                    this.mostrarDialogoAviso(response.mensaje);
                  } else if (response.success === 2) {
                    console.log('La solicitud ya ha sido aprobada o rechazada');
                    this.mostrarDialogError('Esta acción no se puede realizar porque. ' + response.mensaje);
                  } else {
                    console.log('Hubo un problema, no se pudo actualizar el estado');
                    this.mostrarDialogError(response.mensaje);
                  }
                } else {
                  console.log('Respuesta desconocida:', response);
                  this.mostrarDialogError('Respuesta desconocida del servidor');
                }
              },
              async error => {
                console.error('Error en la solicitud:', error);
                // Cerrar el alert de carga
                await this.dismissLoadingAlert();
                this.mostrarDialogError('Hubo un error en la solicitud al servidor');
              }
            );
          }
        }
      ]
    });

    await confirmationAlert.present();
  }

  async presentLoadingAlert() {
    const loadingAlert = await this.alertController.create({
      message: 'Cargando...',
      translucent: true
    });
    await loadingAlert.present();
  }

  async dismissLoadingAlert() {
    await this.alertController.dismiss();
  }

  enviarDatos(){
    console.log('Datos que se enviaran',this.formularioSolicitud.value);
    const EstadoSolicitud =this.formularioSolicitud.get('Estado')?.value;
    console.log('Estado de la solicitud:', EstadoSolicitud);
    if(EstadoSolicitud === 'Aprobada'){

      this.mostrarDialogError1('No se puede actualizar la solicitud porque ya fue aprobada');
    }
    else if(EstadoSolicitud === 'En proceso'){

      this.mostrarDialogError1('No se puede actualizar la solictud porque esta en proceso de aprobación');
    }

  }

  CANCELAR(){
    this.router.navigateByUrl('/dashboard/solicitudes/solicitudes-list');
  }

  private verificarSiEsEncargado(): boolean{
    const puesto = localStorage.getItem("Puesto");
    return (puesto==="Encargado de Área")
  }
  private verificarPermisosDelUsuarioSuper(): boolean {
    const nombreUsuario = localStorage.getItem("NombreTipoUser");
    return (nombreUsuario === "SuperAdministrador");
  }

  private verificarPermisosDeAdmin(): boolean {
    const nombreUsuario = localStorage.getItem("NombreTipoUser");
    return (nombreUsuario === "Administrador");
  }
  
  ngOnInit(): void{
    this.solicitudService.selectProveedor().subscribe((data)=>{
      this.proveedor=data;
    });

  }

  getColorClass(estado: string): string {
    switch (estado) {
      case 'Aprobada':
        return 'aprobada';
      case 'Rechazada':
        return 'rechazada';
      case 'En proceso':
        return 'en-proceso';
      default:
        return '';
    }
  }
  
  
async mostrarDialogoAviso(mensaje: string): Promise<void> {
  const alert = await this.alertController.create({
    header: 'Aviso',
    message: mensaje,
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
  await alert.present();
}

async mostrarDialogError(mensaje: string): Promise<void> {
  const alert = await this.alertController.create({
    header: 'Error',
    message: mensaje,
    buttons: ['OK']
  });

  await alert.present();
}

async mostrarDialogError1(message:string): Promise<void> {
  const alert = await this.alertController.create({
    header: 'Error',
    message: message,
    buttons: ['OK']
  });

  await alert.present();
}
}
