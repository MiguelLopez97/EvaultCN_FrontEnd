export class UsuarioModel {    
    public idUsuario: string;
    public idEmpresa: string;
    public cuentaDeUsuario: string;
    public nombreUsuario: string;
    public apellidoPat: string;
    public apellidoMat: string;
    public genero: string;
    public direccion: string;
    public fechaNacimiento: any;
    public correoElectronico: string;
    public celular: string;
    public contrasenia: string;
    public pin: string;
    public imei: string;
    public idRol: number;
    public token: string;
    public nuevaContrasenia: string;

    constructor()
    {
        //this.idUsuario = 1;
        //this.idEmpresa = 0;
        //this.idRol = 4;
    }
}