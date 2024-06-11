import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Firestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { collection, query, where, getDocs } from "firebase/firestore";
import { DataService, TableData } from '../../services/data.service';

@Component({
  selector: 'app-info-page',
  templateUrl: './info-page.component.html',
  styleUrls: ['./info-page.component.scss']
})

export class InfoPageComponent implements OnInit {
  selectedImage: string = "";
  selectedResult: string = "";
  public tableData2: TableData = { headerRow: [], dataRows: [] };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestore: Firestore,
    private dataService: DataService
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
    this.dataService.getTableData().subscribe(data => {
      this.tableData2 = data;
    });
  }

  toInfoPage(selectedImage: string): void {
    this.router.navigate(['/info-page', { image: selectedImage }]);
    this.updateDetails(selectedImage);
  }

  updateDetails(imagePath: string): void {
    if (imagePath.includes('NOTOK')) {
      this.selectedResult = 'NOT OK';
    } else {
      this.selectedResult = 'OK';
    }
  }

}