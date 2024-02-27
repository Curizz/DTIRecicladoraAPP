import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ProduccionEmpleadoService } from '../produccion-empleado.service';
import { PeriodicElement } from '../PeriodicElement';


@Component({
  selector: 'app-produccion-empleado-list',
  templateUrl: './produccion-empleado-list.component.html',
  styleUrls: ['./produccion-empleado-list.component.scss'],
})
export class ProduccionEmpleadoListComponent  implements OnInit {
  
  usuarioTienePermisoSuper: boolean = false;
  inventariosSalida: any[]=[];
  productosEntrada: any[]=[]; //Obtenemos los datos de la tabla productos
  Produccion: PeriodicElement[] = [];
  ProduccionenProceso: PeriodicElement[] = [];
  displayedColumns: string[]=[];

  constructor(
    private router: Router,
    private alertController: AlertController,
    private produccionempleadoService:ProduccionEmpleadoService,
  ) { 
    this.usuarioTienePermisoSuper = this.verificarPermisosDelUsuarioSuper();
  }


  crearRegistro(){
    this.router.navigateByUrl('dashboard/produccion-empleado/produccionEmple-create');
  }

  
  private verificarPermisosDelUsuarioSuper(): boolean {
    const nombreUsuario = localStorage.getItem("NombreTipoUser");
    return (nombreUsuario === "SuperAdministrador") || (nombreUsuario == "Administrador");
  }

  ngOnInit() :void{
    console.log('AQUI ABAJO SE MOSTRARIA EL CORREO QUE SE TRAE DESDE EL LOCALSTORAGE');
    const correoSave = this.produccionempleadoService.getCorreo();
    console.log('Correo desde el localStorage: ', correoSave);

    console.log('AQUI ABAJO SE MOSTRARIA EL NOMBRE QUE SE TRAE DESDE EL LOCALSTORAGE');
    const nombreSave = this.produccionempleadoService.getNombre();
    console.log('Nombre desde el localStorage: ', nombreSave);

    console.log('AQUI ABAJO SE MOSTRARIA EL id QUE SE TRAE DESDE EL LOCALSTORAGE');
    const idUsuario = this.produccionempleadoService.getId();
    console.log('ID desde el localStorage: ', idUsuario);


 
    this.produccionempleadoService.listarProduccionArea(idUsuario).subscribe((respuesta: PeriodicElement[]) => {
      console.log(respuesta);
      console.log('Obtenemos todos los registros',respuesta);

      this.Produccion = respuesta;
      //
    this.produccionempleadoService.selectInventarioSalida().subscribe((data)=>{
      this.inventariosSalida=data;
    });


    // Obtenemos los nombres de los registros de la tabla productos
    this.produccionempleadoService.selectProductoEntrada().subscribe((data)=>{
      this.productosEntrada=data;
    });


    });
    this.produccionempleadoService.listarProduccionAreEnProceso(idUsuario).subscribe((respuesta: PeriodicElement[]) =>{
      this.ProduccionenProceso = respuesta;
    });


  }
 
}
