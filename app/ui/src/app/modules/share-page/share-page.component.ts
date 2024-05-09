import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { inject } from '@angular/core';
import { Firestore, doc, getDoc, onSnapshot } from '@angular/fire/firestore';
import { ChatService } from '../../services/chat.service';
import { Observable } from 'rxjs';

interface CameraData {
  img_src: string;
}
interface SettingsData {
  pullImageMode: string;
}
@Component({
  selector: 'app-share-page',
  templateUrl: './share-page.component.html',
  styleUrls: ['./share-page.component.scss']
})

export class SharePageComponent {

  imageList: string[] = [];
  image1: string = "";
  image2: string = "";
  image3: string = "";
  image4: string = "";
  image5: string = "";
  pullImageMode: string = "";

  constructor(
    private router: Router,
    private firestore: Firestore,
    private chatService: ChatService
  ) { }

  async ngOnInit() {
    this.chatService.getNewImage1().subscribe((image1: string) => {
      this.imageList.push(image1);
      this.image1 = image1;
    });
    this.chatService.getNewImage2().subscribe((image2: string) => {
      this.imageList.push(image2);
      this.image2 = image2;
    });

    this.chatService.getNewImage3().subscribe((image3: string) => {
      this.imageList.push(image3);
      this.image3 = image3;
    });

    this.chatService.getNewImage4().subscribe((image4: string) => {
      this.imageList.push(image4);
      this.image4 = image4;
    });

    this.chatService.getNewImage5().subscribe((image5: string) => {
      this.imageList.push(image5);
      this.image5 = image5;
    });
  }
  
  onSubmitSettings() {
    this.router.navigate(['/settings-page']);
  }

  toInfoPage(selectedImage: string) {
    this.router.navigate(['/info-page', { image: selectedImage }]);
  }
}
