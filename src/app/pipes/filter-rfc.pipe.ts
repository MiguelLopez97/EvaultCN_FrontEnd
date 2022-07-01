import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterRFC'
})
export class FilterRFCPipe implements PipeTransform {

  transform(value: any = [], arg: any): any {
    const resultRFC = [];
    for(const factura of value)
    {
      if(factura.rfcProveedor.toLowerCase().indexOf(arg.toLowerCase()) > -1)
      {
        resultRFC.push(factura);
      }
    }
    return resultRFC;
  }

}
