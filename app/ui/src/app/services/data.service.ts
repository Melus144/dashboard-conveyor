import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private okCountSubject: BehaviorSubject<number> = new BehaviorSubject(0);
  private notOkCountSubject: BehaviorSubject<number> = new BehaviorSubject(0);
  private tableDataSubject: BehaviorSubject<TableData> = new BehaviorSubject<TableData>({
    headerRow: ['ID', 'Result', 'TimeStamp', 'Image'],
    dataRows: []
  });

  getTableData(): Observable<TableData> {
    return this.tableDataSubject.asObservable();
  }

  addTableRow(row: string[]): void {
    const currentData = this.tableDataSubject.value;
    currentData.dataRows.push(row);
    this.tableDataSubject.next(currentData);
  }

  addOkCount(): void {
    this.okCountSubject.next(this.okCountSubject.value + 1);
  }
  addNotOkCount(): void {
    this.notOkCountSubject.next(this.notOkCountSubject.value + 1);
  }

  getOkCount(): Observable<number> {
    return this.okCountSubject.asObservable();
  }

  getNotOkCount(): Observable<number> {
    return this.notOkCountSubject.asObservable();
  }

  getInspectionData(): { totalInspections: number[], failedInspections: number[] } {
    // Mock Daily Inspections Data 
    const totalInspections = [0, 20, 40, 100, 140, 190, 220, 240, 250];
    const failedInspections = [0, 2, 5, 15, 23, 25, 30, 35, 40];
    return { totalInspections, failedInspections };
  }

  getMonthlyData(): { ok: number[], notOk: number[] } {
    // Mock Monthly Inspections Data
    const ok = [800, 1200, 1600, 1800];
    const notOk = [250, 370, 480, 500];
    return { ok, notOk };
  }
}

export interface TableData {
  headerRow: string[];
  dataRows: string[][];
}
