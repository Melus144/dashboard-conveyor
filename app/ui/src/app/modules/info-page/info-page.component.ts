import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Firestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { collection, query, where, getDocs } from "firebase/firestore";


@Component({
  selector: 'app-info-page',
  templateUrl: './info-page.component.html',
  styleUrls: ['./info-page.component.scss']
})

export class InfoPageComponent implements OnInit {

  items: any[] = [];
  selectedImage: string = "";

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
    this.route.paramMap.subscribe((params: any) => {
      this.selectedImage = params.get('image')
    });
  }



  backToSharePage() {
    this.router.navigate(['/share-page']);
  }

}