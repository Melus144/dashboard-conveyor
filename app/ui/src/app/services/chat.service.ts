import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from "socket.io-client";

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  public message$: BehaviorSubject<string> = new BehaviorSubject('');
  public image1$: BehaviorSubject<string> = new BehaviorSubject('');
  public image2$: BehaviorSubject<string> = new BehaviorSubject('');
  public image3$: BehaviorSubject<string> = new BehaviorSubject('');
  public image4$: BehaviorSubject<string> = new BehaviorSubject('');
  public image5$: BehaviorSubject<string> = new BehaviorSubject('');


  constructor() {
    this.socket = io('http://localhost:3000')
    this.listenForImages();
  }

  private socket: any;

  public listenForImages(): void {
    this.socket.on('image1', (imageUrl: string) => {
      this.image1$.next(imageUrl);
    });
    this.socket.on('image2', (imageUrl: string) => {
      this.image2$.next(imageUrl);
    });
  }

  // signalSocket = io('http://localhost:3001');

  public sendImage1(image1:any) {
    this.socket.emit('image1', image1);
  }

  public getNewImage1 = () => {
    return this.image1$.asObservable();
    /*    
    this.socket.on('image1', (image1: string) =>{
      this.image1$.next(image1);
    });
    */

  };

  public sendImage2(image2:any) {
    this.socket.emit('image2', image2);
  }

  public getNewImage2 = () => {
    /*this.socket.on('image2', (image2: string) =>{
      this.image2$.next(image2);
    });*/

    return this.image2$.asObservable();
  };

  public sendImage3(image3:any) {
    this.socket.emit('image3', image3);
  }

  public getNewImage3 = () => {
    this.socket.on('image3', (image3: string) =>{
      this.image3$.next(image3);
    });

    return this.image3$.asObservable();
  };

  public sendImage4(image4:any) {
    this.socket.emit('image4', image4);
  }

  public getNewImage4 = () => {
    this.socket.on('image4', (image4: string) =>{
      this.image4$.next(image4);
    });

    return this.image4$.asObservable();
  };

  public sendImage5(image5:any) {
    this.socket.emit('image5', image5);
  }

  public getNewImage5 = () => {
    this.socket.on('image5', (image5: string) =>{
      this.image5$.next(image5);
    });

    return this.image5$.asObservable();
  };

}
