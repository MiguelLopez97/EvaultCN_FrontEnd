import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterMes'
})
export class FilterMesPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const resultMeses = [];
    for(const factura of value)
    {
      if(factura.fechaFactura.toLowerCase().indexOf(arg.toLowerCase()) > -1)
      {
        resultMeses.push(factura);
      }
    }
    return resultMeses;
  }

}
