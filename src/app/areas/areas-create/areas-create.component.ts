import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AreasService } from '../areas.service';

@Component({
  selector: 'app-areas-create',
  templateUrl: './areas-create.component.html',
  styleUrls: ['./areas-create.component.scss'],encapsulation: ViewEncapsulation.None
})
export class AreasCreateComponent  implements OnInit {
  formularioAreas: FormGroup;
  
  constructor( 
      private router:Router,
      private formBuilder: FormBuilder,
     // private dialog: MatDialog,
      private areasService: AreasService
    ) { 
      const idFabrica = this.areasService.getidFabrica();
      const correoSave = this.areasService.getCorreo();
      this.formularioAreas = this.formBuilder.group({
        NombreArea: ['', [Validators.required]],
        DescripcionArea: [''],
        EstadoArea: ['', [Validators.required]],
        UsuarioCreador:[correoSave],
        Fabrica: [idFabrica]
      });
    }

  enviarDatosArea(){
    if (this.formularioAreas.valid) {
      console.log('el formulario esta bien :3');
      console.log(this.formularioAreas.value);
      this.areasService.agregarArea(this.formularioAreas.value).subscribe(
        (response)=>{
          if(response.success === 1){
            console.log('Registro existoso');
            //this.mostratDialogoAviso('Registro exitoso');
            this.formularioAreas.reset();
          }else{
            console.error('Error al registrar en la Base de Datos:', response.error);
          }
        },
        (error) => {
          // Manejar errores del servicio aquí
            console.error('Aqui se maneja el error');
        } 
        );
    }
  }
 
  CANCELAR(){
    this.router.navigateByUrl('/dashboard/areas/areas-list');
  }
  

 /* mostratDialogoAviso(mensaje: string): void {
    const dialogAviso = this.dialog.open(AvisoDialogComponent, {
        data: { message: mensaje }
    });
    dialogAviso.afterClosed().subscribe(result => {
        if (result) {
            this.router.navigateByUrl('/areas');
        }
    });
}*/

  ngOnInit() {}

}
