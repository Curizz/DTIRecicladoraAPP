import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { GastosService } from '../gastos.service';
import { PeriodicElement } from '../PeriodicElement';
@Component({
  selector: 'app-gastos-list',
  templateUrl: './gastos-list.component.html',
  styleUrls: ['./gastos-list.component.scss'],
})
export class GastosListComponent  implements OnInit {

  
  usuarioTienePermisoSuper: boolean = false;
  Solicitud: PeriodicElement[]=[];
  SolicitudGenerales: PeriodicElement[]=[];
  usuarioEsEncargado: boolean= false;
  UsuarioAdmin: boolean=false;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private gastosService: GastosService,
  ) { 
    this.usuarioTienePermisoSuper = this.verificarPermisosDelUsuarioSuper();
    this.usuarioEsEncargado = this.verificarusuarioEncargado();
    this.UsuarioAdmin = this.verificarusuarioAdmin();
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
  crearRegistro(){
    this.router.navigateByUrl('dashboard/gastos/gastos-create');
  }

  Editar(element:PeriodicElement){
    const idGastos = element.idGastosFabrica;
    this.router.navigateByUrl(`/dashboard/gastos/gastos-edit/${idGastos}`);
  }
  mostrarDialogoDeConfirmacion2(element:PeriodicElement){
    
  }
  ngOnInit(): void {
    this.gastosService.listarGastos().subscribe((respuesta: PeriodicElement[])=>
    {
      console.log(respuesta);
      this.SolicitudGenerales=respuesta;
    })

  }

}
