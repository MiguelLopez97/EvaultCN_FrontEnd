import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterEstatusCFDI'
})
export class FilterEstatusCFDIPipe implements PipeTransform {

  transform(value: any = [], arg: any): any {
    const resultFacturas = [];
    
    for(const factura of value)
    {
      if(factura.estatusCFDI.indexOf(arg) > -1)
      {
        resultFacturas.push(factura);
      }
    }
    return resultFacturas;
  }

}
