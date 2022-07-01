import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-datos-generales',
  templateUrl: './datos-generales.component.html',
  styleUrls: ['./datos-generales.component.scss']
})
export class DatosGeneralesComponent implements OnInit {

  //Propiedades para los Tab Usuario, Empresa y Buzón
  public pages: string[] = ["tab-1", "tab-2", 'tab-3'];
  public disableEmpresa: boolean = false; //true
  public disableBuzon: boolean = false; //true
  public actualPage = 1
  
  constructor() { }

  ngOnInit() {}

  //-------------------- Métodos para desbloquear los Tabs Empresa y Buzón -------------------//
  goToEmpresa(tabSet,event)
  {
    this.disableEmpresa = false;
    var that = this
    setTimeout(function () 
    {
      tabSet.select(that.pages[1]);
    }, 1);
  }

  goToBuzon(tabSet)
  {
    this.disableBuzon = false;
    var that = this
    setTimeout(function () 
    {
      tabSet.select(that.pages[2]);
    }, 1);
  }

  tabChange(evt) { }
  //-------------------- End Métodos para desbloquear los Tabs Empresa y Buzón ----------------// 

}
