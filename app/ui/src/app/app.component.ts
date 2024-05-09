import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ChatService } from './services/chat.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  newMessage: string = '';
  messageList: string[] = [];
  currentDate = new Date();
  formattedDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
  task:string = '112233';

  constructor(
    private router: Router,
    private chatService: ChatService,
    private datePipe: DatePipe
  ) { }

  onSubmitSettings() {
    this.router.navigate(['/settings-page']);
  }

  toSharePage() {
    this.router.navigate(['/share-page'])
  }

  toInfoPage() {
    this.router.navigate(['/info-page']);
  }

  toLogInPage() {
    this.router.navigate(['/login']);
  }
}
