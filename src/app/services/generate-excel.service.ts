import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class GenerateExcelService {
  
  constructor () {}

  public exportAsExcelFile(rows: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(rows);
    const workbook: XLSX.WorkBook = { Sheets: {'data': worksheet}, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array'} );
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});

    //Obtiene la fecha actual para adjuntarla como nombre de archivo
    let date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    var today;
    
    if (month < 10)
    {
      today = day + '-0' + month + '-' + year;
    }
    else
    {
      today = day + '-' + month + '-' + year;
    }

    FileSaver.saveAs(data, fileName + '_' + today + EXCEL_EXTENSION);
  }
}