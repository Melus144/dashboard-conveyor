import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Firestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { collection, query, where, getDocs } from "firebase/firestore";


declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}

@Component({
  selector: 'app-info-page',
  templateUrl: './info-page.component.html',
  styleUrls: ['./info-page.component.scss']
})

export class InfoPageComponent implements OnInit {

  items: any[] = [];
  selectedImage: string = "";
  results: any[] = [
    { result: 'OK', id: '123456', timestamp: '2023-05-21 14:30:00' },
    { result: 'NOT OK', id: '123457', timestamp: '2023-05-21 14:32:00' },
    { result: 'OK', id: '123458', timestamp: '2023-05-21 14:34:00' }
  ];
  public tableData2: TableData = { headerRow: [], dataRows: [] };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestore: Firestore,
  ) {

    // // Función para obtener los datos de Firestore
    // async function getFirestoreData(): Promise<any[]> {
    //   const snapshot = await firestore.collection('information').get();
    //   return snapshot.docs.map((doc: { id: any; data: () => any; }) => ({ id: doc.id, ...doc.data() }));
    // }

    // // Ejecutar la función para obtener los datos y luego mostrarlos en la tabla HTML
    // getFirestoreData().then(data => {
    //   const table = document.getElementById('data-table');
    //   if (table) {
    //     data.forEach(item => {
    //       const row = table.insertRow();
    //       row.insertCell().textContent = item.id;
    //       row.insertCell().textContent = item.campo1;
    //       row.insertCell().textContent = item.campo2;
    //       row.insertCell().textContent = item.campo3;
    //     });
    //   }
    // });

  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.selectedImage = params.get('image') || '';
    });
    this.tableData2 = {
      headerRow: [ 'ID', 'Result', 'TimeStamp'],
      dataRows: [
          ['1', 'OK', '2024-05-21 14:30:00'],
          ['2', 'NOT OK', '2024-05-21 14:32:00'],
          ['3', 'OK', '2024-05-21 14:33:00'],
          ['4', 'OK', '2024-05-21 14:34:00']
      ]
  };
  }
}