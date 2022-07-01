export class CalculoContenidoNacionalModel {
    public nombreFormula: string;
    public definicion: string;
    public resultado: number;
    public detalle: [{
        variable: string;
        valor: number;
        clasificacion: string;
        tipoDeContenido: string;
        porcentajeCN: number;
    }];
    
    constructor() { }
}