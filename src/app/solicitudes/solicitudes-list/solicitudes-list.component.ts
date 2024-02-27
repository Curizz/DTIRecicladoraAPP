import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SolicitudesService } from '../solicitudes.service';
import { PeriodicElement } from '../PeriodicElement';

@Component({
  selector: 'app-solicitudes-list',
  templateUrl: './solicitudes-list.component.html',
  styleUrls: ['./solicitudes-list.component.scss'],
})
export class SolicitudesListComponent  implements OnInit {

  usuarioTienePermisoSuper: boolean = false;
  Solicitud: PeriodicElement[]=[];
  SolicitudGenerales: PeriodicElement[]=[];
  usuarioEsEncargado: boolean= false;
  UsuarioAdmin: boolean=false;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private solicitudesService: SolicitudesService,
  ) { 
    this.usuarioTienePermisoSuper = this.verificarPermisosDelUsuarioSuper();
    this.usuarioEsEncargado = this.verificarusuarioEncargado();
    this.UsuarioAdmin = this.verificarusuarioAdmin();
  }


  crearRegistro(){
    this.router.navigateByUrl('dashboard/solicitudes/solicitudes-create');
  }


  ngOnInit(): void{
    console.log('AQUI ABAJO SE MOSTRARIA EL id QUE SE TRAE DESDE EL LOCALSTORAGE');
    const idUsuario = this.solicitudesService.getidUsuario();
    console.log('ID desde el localStorage: ', idUsuario);


  this.solicitudesService.listarSolicitudPorUsuario(idUsuario).subscribe((respuesta: PeriodicElement[])=>
  {
    console.log(respuesta);
    this.Solicitud=respuesta;
  })
  
  this.solicitudesService.listarSolicitud().subscribe((respuesta: PeriodicElement[])=>
  {
    console.log(respuesta);
    this.SolicitudGenerales=respuesta;
  })

  }

  //Checar si es el super administrador que puede rechazar o aceptar la solicitud
  private verificarPermisosDelUsuarioSuper(): boolean {
    const nombreUsuario = localStorage.getItem("NombreTipoUser");
    return (nombreUsuario === "SuperAdministrador");
  }

  //Que puede editar o eliminar la solicitud
  private verificarusuarioAdmin(): boolean {
    const nombreUsuario = localStorage.getItem("NombreTipoUser");
    return (nombreUsuario === "Administrador");
  }

  
  //Que puede ver o eliminar la  solicitud que realiza
  private verificarusuarioEncargado(): boolean {
    const nombreUsuario = localStorage.getItem("Puesto");
    return (nombreUsuario === "Encargado de Área");
  }

  Editar(element:PeriodicElement){
    const idSolicitud = element.idSolicitud;
    this.router.navigateByUrl(`/dashboard/solicitudes/solicitudes-edit/${idSolicitud}`);
  }


  VerdetalleEmpleado(element:PeriodicElement){
    const idSolicitud = element.idSolicitud;
    this.router.navigateByUrl(`/dashboard/solicitudes/solicitudes-edit/${idSolicitud}`)
  }
  eliminarElemento(element: PeriodicElement): void {
    const correoSave = this.solicitudesService.getCorreo();
    const index = this.Solicitud.indexOf(element);

    if (index >= 0) {
      const idSolicitud = element.idSolicitud;
      this.Solicitud.splice(index, 1);
      this.SolicitudGenerales.splice(index,1)
      this.solicitudesService.borrarSolicitud(idSolicitud,correoSave).subscribe();
      console.log(`Elemento eliminado en el índice ${index}, ID del proveedor: ${idSolicitud}`);
    }
  }

  
  async mostrarDialogoDeConfirmacion2(element: PeriodicElement) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas eliminar este registro?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.eliminarElemento(element);
          }
        }
      ]
    });

    await alert.present();
  }

}
