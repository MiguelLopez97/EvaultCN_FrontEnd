export class CFDIDocModel {
    public idDoc?: number;
    public idEmpresa: number;
    public idUsuarioAutor: number;
    public idUsuarioRevisor: number;
    public idEstatusCFDI: number;
    public estatusCFDI: string;
    public rfcProveedor: string;
    public razonSocialProveedor: string;
    public rfcReceptor: string;
    public razonSocialReceptor: string;
    public fechaFactura: any;
    public numeroFactura: number;
    public categoriaTaxonomica: string;
    public clasificacion: string;
    public fechaCreacion: any;
    public fechaElaboracion: any;
    public fechaVencimiento: any;
    public descripcionDoc: any;
    public palabrasClave: any;
    public tipoDocumental: string;
    public valorDocumental: string;
    public versionDoc: number;
    public vigenteHasta: any;
    public contenidoDoc: any;
    public contenidoTxt: any;
    public extension: string;
    public fechaRevision: any;
    public fechaVencimientoRevision: any;
    public fechaRegistro: any;
    public xml?: {
        certificado: string,
        complementoFechaTimbrado: any,
        complementoNoCertificadoSAT: string,
        complementoRFCProvCertif: any,
        complementoSelloCFD: string,
        complementoSelloSAT: string,
        complementoUUID: string,
        complementoVersion: string,
        complementoxmlnstfd: string,
        complementoxsischemaLocation: string,
        conceptos: any,
        emisorDomicilioFiscalCalle: string,
        emisorDomicilioFiscalCodigoPostal: string,
        emisorDomicilioFiscalColonia: string,
        emisorDomicilioFiscalEstado: string,
        emisorDomicilioFiscalMunicipio: string,
        emisorDomicilioFiscalPais: string,
        emisorDomicilioFiscalnoExterior: string,
        emisorNombre: string,
        emisorRFC: string
        emisorRegimenFiscal: string,
        fecha: any,
        folio: string
        formaDePago: string,
        lugaExpedicion: string,
        metodoDePago: string,
        moneda: string,
        noCertificado: string,
        numCtaPago: any
        rawData: any,
        receptorDomicilioCalle: string,
        receptorDomicilioCodigoPostal: string,
        receptorDomicilioColonia: string,
        receptorDomicilioEstado: string,
        receptorDomicilioMunicipio: string,
        receptorDomicilioNoExterior: string,
        receptorDomicilioPais: string,
        receptorNombre: string,
        receptorRFC: string,
        receptorUsoCFDI: any
        sello: string
        subTotal: number
        tipoDeComprobante: string
        total: number,
        totalImpuestosRetenidos: number,
        traslados: any
        version: string
    };
    public partidas: any;
    public idTipoCFDIDoc: number;
    public noAsignacion: string;
    public nombreEmpresaSuministra: string;
    public ordenCompra: string;
    public tipoMaterial: string;
    public criterio: string;
    public fraccionArancelaria: number;
    public pcnmj: number;
    public vmj: number;
    public vmoj: number;
    public vnmoj: number;
    public uuid: string;
    public moneda: string;
    public tipoDeCambio: number;
    public revisar100: boolean;

    constructor(){}
}