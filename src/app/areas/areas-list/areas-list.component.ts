import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { areasList } from '../areasList';
import { AreasService } from '../areas.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-areas-list',
  templateUrl: './areas-list.component.html',
  styleUrls: ['./areas-list.component.scss'],
})
export class AreasListComponent implements OnInit {

  @Output() areaChange: EventEmitter<string> = new EventEmitter<string>();

  usuarioTienePermisoSuper: boolean=false;
  areas: areasList[] = [];
  selectedArea: string = '';
  seEncontraronDatos: boolean = false;
  sortDirection = 0;



  constructor(private router: Router,
              private areasService: AreasService, 
              public alertController: AlertController) { 
    this.usuarioTienePermisoSuper = this.verificarPermisosDelUsuarioSuper();
  }

  ngOnInit(): void {
    this.areasService.listarAreas().subscribe((respuesta: areasList[]) => {
      console.log(respuesta);
      this.areas = respuesta;
    });
  }

  onAreaChange(event: CustomEvent): void {
    this.selectedArea = event.detail.value;
    this.areaChange.emit(this.selectedArea);
  }

  verDetalles(element: areasList) {
    const idArea = element.idArea;
    this.router.navigateByUrl(`/dashboard/areas/areas-edit/${idArea}`);
  }

  crearArea() {
    this.router.navigateByUrl('/dashboard/areas/areas-create');
  }

  eliminarElemento(element: areasList): void {
    const correoSave = this.areasService.getCorreo();
    const index = this.areas.indexOf(element);
    if (index >= 0) {
      const idArea = element.idArea;
      this.areas.splice(index, 1);
      this.areasService.eliminarArea(idArea, correoSave).subscribe();
      console.log(`Elemento eliminado en el índice ${index}, ID del área: ${idArea}`);
    }
  }

  aplicarFiltro() {
    console.log('Este es el valor del selectedArea:', this.selectedArea);
    if (this.selectedArea) {
      const filtro = this.selectedArea.trim().toLowerCase();
      this.areas = this.areas.filter(area =>
        area.NombreArea.toLowerCase().includes(filtro)
      );
      this.seEncontraronDatos = this.areas.length > 0;
      console.log('Se Encontraron Datos:', this.seEncontraronDatos);
    } else {
      this.areasService.listarAreas().subscribe((respuesta: areasList[]) => {
        console.log(respuesta);
        this.areas = respuesta;
      });
      this.seEncontraronDatos = this.areas.length > 0;
      console.log('Se Encontraron Datos // Si no hay filtro, muestra todos los Datos:', this.seEncontraronDatos);
    }
  }

  regresar() {
    this.router.navigateByUrl('/dashboard/catalogos');
  }

  private verificarPermisosDelUsuarioSuper(): boolean {
    const nombreUsuario = localStorage.getItem("NombreTipoUser");
    // Realiza la lógica para determinar si el usuario tiene permiso basado en su rol
    return ((nombreUsuario === "SuperAdministrador")|| (nombreUsuario == "Administrador")); // Ejemplo: el usuario con rol "SuperAdmin" tiene permiso
  }



  async mostrarDialogoDeConfirmacion(element: areasList) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas eliminar este registro?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelado');
          }
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


  sortBy(key:any){

  }
}
