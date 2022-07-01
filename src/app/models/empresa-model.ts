export class EmpresaModel {
    public idEmpresa: number;
    public idTipoPersona: string;
    public idEntidadFederativa: string;
    public idMunicipio: string;
    public idCiudad: string;
    public idTipoActividad: number;
    public codigoPostal: string;
    public colonia: string;
    public municipio: string;
    public ciudad: string;
    public estado: string;
    public razonSocial: string;
    public rfc: any;
    public direccion: string;
    public correoElectronico: string;
    public telefono: string;
    public ext: string;
    public noInstrumentoPublico: any;
    public logo: string;
    public repLegalNombre: string;
    public repLegalAPaterno: string;
    public repLegalAMaterno: string;
    public repCNNombre: string;
    public repCNAPaterno: string;
    public repCNAMaterno: string;
    public representante: {
        nombre: string,
        apellidoPaterno: string
        apellidoMaterno: string
        nombreCompleto: string
    };
    public fechaRegistro: string;
    public fechaActualizacion: string;
    
    constructor() { }
}

export class LogoEmpresaModel {
    public idEmpresa: number;
    public logo: string;
    public fileContentBase64: string;
    public fileName: string;
    public fileExt: string;
    public fileArray: string;

    constructor() { }
}

/*export interface representanteLegal {
    nombre: string
    apellidoPaterno: string
    apellidoMaterno: string
    nombreCompleto: string
}*/
