import { Component, OnInit } from '@angular/core';
import { PeriodicElement } from '../PeriodicElement';
import { ProveedorService } from '../proveedores.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-proveedores-list',
  templateUrl: './proveedores-list.component.html',
  styleUrls: ['./proveedores-list.component.scss'],
})
export class ProveedoresListComponent  implements OnInit {

  proveedores: PeriodicElement[] = [];
  inventarioFabrica: any[]=[];


  constructor(
    private router: Router,
    private alertController: AlertController,
    private proveedorService: ProveedorService
  ) { 

  }


  crearRegistro(){
    this.router.navigateByUrl('dashboard/proveedores/proveedores-create');
  }

  ngOnInit(): void {
    this.proveedorService.listarProveedor().subscribe((respuesta: PeriodicElement[]) =>{
      console.log(respuesta);
      console.log('Obtenemos los registros',respuesta);
      this.proveedores = respuesta;
    } );

    this.proveedorService.selectInventarioFabrica().subscribe((data)=>{
      this.inventarioFabrica=data
    })
  }

  obtenerNombreInsumo(idInventarioFabrica: any): string {
    const inventario = this.inventarioFabrica.find(item => item.idInventarioFabrica === idInventarioFabrica);
    return inventario ? inventario.NombreInsumo : '';
  }


  eliminarElemento(element: PeriodicElement): void {
    const correoSave = this.proveedorService.getCorreo();
    const index = this.proveedores.indexOf(element);

    if (index >= 0) {
      const idProveedor = element.idProveedor;
      this.proveedores.splice(index, 1);
      this.proveedorService.borrarProveedor(idProveedor,correoSave).subscribe();
      console.log(`Elemento eliminado en el índice ${index}, ID del proveedor: ${idProveedor}`);
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
