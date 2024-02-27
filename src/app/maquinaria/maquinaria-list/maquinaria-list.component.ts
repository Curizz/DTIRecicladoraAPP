import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { MaquinasService } from '../maquinaria.service';
import { PeriodicElement } from '../PeriocElement';

@Component({
  selector: 'app-maquinas-list',
  templateUrl: './maquinaria-list.component.html',
  styleUrls: ['./maquinaria-list.component.scss']
})
export class MaquinariaListComponent implements OnInit {
  
  @Output() maquinaChange: EventEmitter<string> = new EventEmitter<string>();

  usuarioTienePermisoSuper: boolean = false;
  Maquina: PeriodicElement[] = [];
  areas: any[] = []; // Lista de áreas
  selectedSerie: string = '';
  selectedArea: string = '';
  seEncontraronDatos: boolean = false;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private maquinaService: MaquinasService,
  ) {
    this.usuarioTienePermisoSuper = this.verificarPermisosDelUsuarioSuper();
  }

  ngOnInit(): void {
    this.maquinaService.getAreas().subscribe(data => {
      this.areas = data;
    });
    this.maquinaService.listarMaquina().subscribe((respuesta: PeriodicElement[]) => {
      console.log(respuesta);
      this.Maquina = respuesta;
    });
  }

  onMaquinaChange(event: CustomEvent): void {
    this.selectedSerie = event.detail.value;
    this.maquinaChange.emit(this.selectedSerie);
  }

  verDetalles(element: PeriodicElement) {
    const idMaquina = element.idMaquina;
    this.router.navigateByUrl(`/dashboard/maquinarias/maquinaria-edit/${idMaquina}`);
  }

  crearMaquina() {
    this.router.navigateByUrl('/dashboard/maquinarias/maquinarias-create');
  }

  eliminarElemento(element: PeriodicElement): void {
    const index = this.Maquina.indexOf(element);
    if (index >= 0) {
      const idMaquina = element.idMaquina;
      this.Maquina.splice(index, 1);
      console.log(`Elemento eliminado en el índice ${index}, ID de la máquina: ${idMaquina}`);
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

  applySerieFilter(event: any) {
    let filterValue = event.target.value.trim().toLowerCase();
    if (!filterValue) {
      // Si el filtro está vacío, restaura los datos originales
      this.maquinaService.listarMaquina().subscribe((respuesta: PeriodicElement[]) => {
        this.Maquina = respuesta;
      });
      return;
    }
    this.Maquina = this.Maquina.filter(
      element => element.Serie.toLowerCase().includes(filterValue)
    );
  }

  applyAreaFilter(event: any) {
    this.selectedArea = event.detail.value;
    if (!this.selectedArea) {
      // Si no se ha seleccionado un área, muestra todas las máquinas nuevamente
      this.maquinaService.listarMaquina().subscribe((respuesta: PeriodicElement[]) => {
        this.Maquina = respuesta;
      });
      return;
    }
    // Filtra las máquinas por el área seleccionada
    this.Maquina = this.Maquina.filter(
      element => element.Area.toLowerCase() === this.selectedArea.toLowerCase()
    );
  }
  regresar() {
    this.router.navigateByUrl('/dashboard/catalogos');
  }

  private verificarPermisosDelUsuarioSuper(): boolean {
    const nombreUsuario = localStorage.getItem("NombreTipoUser");
    return (nombreUsuario === "SuperAdministrador") || (nombreUsuario == "Administrador");
  }
}
