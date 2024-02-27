import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PeriodicElement } from './PeriodicElement';
import { Produccion } from './produccion';
import { Produccionproceso } from './produccionproceso';
@Injectable({
  providedIn: 'root'
})
export class ProduccionEmpleadoService {
  // URL DE LA LLAMADA A LA API
 // API: string = 'https://recicladora.arvispace.com/PhpAngular/produccionarea/';

   API: string = 'http://localhost/PhpAngular/produccionarea/';
  private correo: string='';
  private nombre: string='';
  private iduser: string='';
  private area: string='';
  private fabrica: string='';
  private tipoUsuario: string='';

  constructor(
    private clientService: HttpClient
  ) { }

    getTurno(id:any){
      const url = this.API + "?selectTurno=" +id;
      return this.clientService.get<any[]>(url)
    }

  getAreas(){
    return this.clientService.get<any[]>(this.API+"?selectArea=1");
  }

  selectInventarioSalida1(id:any){
    return this.clientService.get<any[]>(this.API+"?selectInventarioSalida1=" + id);
  }

  getMaquinas(id:any){
    const url = this.API + "?selectMaquina=" + id;

  return this.clientService.get<any[]>(url);
  }

  getmaquinaria(){
    return this.clientService.get<any[]>(this.API+"?selectmaqui=1");
  }

  // CONEXION DE FRONTEND CON BACKEND
  // SERVICIO PARA TRAER TODOS LOS REGISTROS
  // SERVICIO PARA TRAER TODOS LOS REGISTROS A NIVEL ADMIN
  listarProduccionGeneral(): Observable<PeriodicElement[]> {
    return this.clientService.get<PeriodicElement[]>(this.API+"?obtenerProduccionAdmin=1");
  }

  //Con procedimiento almacenado
  listarProduccionArea(id:any): Observable<PeriodicElement[]> {
    return this.clientService.get<PeriodicElement[]>(this.API+"?obtenerProduccionArea="+id);
  }

  listarProduccionAreEnProceso(id:any): Observable<PeriodicElement[]>{
    return this.clientService.get<PeriodicElement[]>(this.API+"?obtenerProduccionArea1="+id);
  }
  // SERVICIO PARA AGREGAR UN REGISTRO
  agregarProduccionArea(datosProduccionArea:Produccion):Observable<any>{
    return this.clientService.post(this.API+"?insertarProduccionArea2=1",datosProduccionArea);
  }

  // SERVICIO PARA VER LOS DETALLES DE UN REGISTRO
  verDetallesProduccionArea(idProduccionArea:any): Observable<any> {
    return this.clientService.get(this.API+"?consultarProduccionArea="+idProduccionArea);
  }

  //SERVICIO PARA ACTUALIZAR EL REGISTRO
  actualizarProduccionArea(idProduccionArea:any, datosProduccionArea:Produccion):Observable<any>{
    return this.clientService.post(this.API+"?actualizarProduccionArea="+idProduccionArea,datosProduccionArea);
  }

    //SERVICIO PARA ACTUALIZAR EL REGISTRO
    actualizarProduccionAreaproceso(idProduccionArea:any, datosProduccionArea:Produccion):Observable<any>{
      return this.clientService.post(this.API+"?actualizarProduccionAreaproceso="+idProduccionArea,datosProduccionArea);
    }

  // SERVICIO PARA TRAER TODOS LOS REGISTROS DE LA TABLA MAQUINARIA
  selectMaquinaria(){
    return this.clientService.get<any[]>(this.API+"?selectMaquinaria");
  }

  // SERVICIO PARA TRAER LOS REGISTROS DE LA TABLA AREAS
  selectAreas(){
    return this.clientService.get<any[]>(this.API+"?selectArea");
  }

  // SERVICIO PARA TRAER LOS REGISTROS DE LA TABLA INVENTARIO SALIDA
  selectInventarioSalida(){
    return this.clientService.get<any[]>(this.API+"?selectInventarioSalida");
  }

  // SERVICIO PARA TRAER LOS REGISTROS DE LA TABLA PRODUCTOS
  selectProductoEntrada(){
    return this.clientService.get<any[]>(this.API+"?selectProductoEntrada");
  }

  selectUsuarios(){
    return this.clientService.get<any[]>(this.API+"?selectUsuarios");
  }

  // OBTENEMOS EL CORREO DEL LOCALSTORAGE  A LA LISTA DE LOS REGISTROS
  getId(): string {
    return this.iduser = localStorage.getItem("id_user") || '';
  }

  // OBTENEMOS EL CORREO DEL LOCALSTORAGE  A LA LISTA DE LOS REGISTROS
  getCorreo(): string {
    return this.correo = localStorage.getItem("Correo") || '';
  }

  // OBTENEMOS EL NOMBRE DEL LOCALSTORAGE  A LA LISTA DE LOS REGISTROS
  getNombre(): string {
    return this.nombre = localStorage.getItem("Nombre") || '';
  }

  getidArea(): string{
    return this.area = localStorage.getItem("idArea") || '';
  }

  getidFabrica(): string{
    return this.fabrica = localStorage.getItem("idFabrica") || '';
  }

  getTipoUsuario(): string {
    return this.tipoUsuario =localStorage.getItem("NombreTipoUser") || '';
  }


}
