import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ProveedorService } from '../proveedores.service';


@Component({
  selector: 'app-proveedores-create',
  templateUrl: './proveedores-create.component.html',
  styleUrls: ['./proveedores-create.component.scss'],
})
export class ProveedoresCreateComponent  implements OnInit {
  formularioProveedores: FormGroup;
  inventariosSalida : any[]=[];
  constructor(
    private router:Router,
    private formBuilder: FormBuilder,
    private proveedorService: ProveedorService,
    private alertController: AlertController
  ) { 
    const correoSave= this.proveedorService.getCorreo();
    const idFabricaUsuario = this.proveedorService.getIdFabricaUsuario();
    this.formularioProveedores = this.formBuilder.group({
      NombreProveedor: [''],
      DireccionProveedor: [''],
      Telefono: [''],
      Correo: ['', Validators['required']],
      RFCProveedor: [''],
      DescripcionProveedor: [''],
      EstatusProveedor: ['Activo'],
      idInventarioFabrica: [''],
      UsuarioCreador: [correoSave],
      idFabrica: [idFabricaUsuario]
    });
  }

  enviarDatos(){  
    if (this.formularioProveedores.valid) {
      console.log('Este es el formulario');
      console.log('Datos del formulario', this.formularioProveedores.value);
      this.proveedorService.agregarProveedor(this.formularioProveedores.value).subscribe(
        (response) =>{
          console.log('Respuesta del servidor', response);
          if(response.success === 1){
            console.log('Registro exitoso');
            this.presentAlert1();
          }else{

          }

        }
      )
    }
    else{
      console.log('EL formulario no es valido')
    }

  }



  
  async presentAlert1(){
    const alert = await this.alertController.create({
      header: "Aviso",
      message: "El proveedor se  registro correctamente",
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          this.router.navigateByUrl('dashboard/proveedores/proveedores-list');
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

  cancelar(){
    this.router.navigateByUrl('dashboard/proveedores/proveedores-list');
  }
  ngOnInit() {
    this.proveedorService.selectInventarioFabrica().subscribe((data)=>{
      this.inventariosSalida=data;
    });

  }

}
