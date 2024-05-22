import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { ChatService } from './services/chat.service';
import { DatePipe, Location, PopStateEvent } from '@angular/common';
import PerfectScrollbar from 'perfect-scrollbar';
import { Subscription, filter } from 'rxjs';

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

  private _router!: Subscription;
  private lastPoppedUrl: string | undefined;
  private yScrollStack: number[] = [];

  constructor(
    private router: Router,
    private chatService: ChatService,
    private datePipe: DatePipe,
    public location: Location
  ) { }

  ngOnInit() {
    console.log(this.router)
      const isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

      if (isWindows) {
          // if we are on windows OS we activate the perfectScrollbar function

          document.getElementsByTagName('body')[0].classList.add('perfect-scrollbar-on');
      } else {
          document.getElementsByTagName('body')[0].classList.remove('perfect-scrollbar-off');
      }
      const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
      const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');

      this.location.subscribe((ev:PopStateEvent) => {
          this.lastPoppedUrl = ev.url;
      });
       this.router.events.subscribe((event:any) => {
          if (event instanceof NavigationStart) {
             if (event.url != this.lastPoppedUrl)
                 this.yScrollStack.push(window.scrollY);
         } else if (event instanceof NavigationEnd) {
             if (event.url == this.lastPoppedUrl) {
                 this.lastPoppedUrl = undefined;
                 window.scrollTo(0, this.yScrollStack.pop()!);
             } else
                 window.scrollTo(0, 0);
         }
      });
      this._router = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
           elemMainPanel.scrollTop = 0;
           elemSidebar.scrollTop = 0;
      });
      if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
          let ps = new PerfectScrollbar(elemMainPanel);
          ps = new PerfectScrollbar(elemSidebar);
      }
  }
  ngAfterViewInit() {
      this.runOnRouteChange();
  }

  runOnRouteChange(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
      const ps = new PerfectScrollbar(elemMainPanel);
      ps.update();
    }
  }
  isMac(): boolean {
      let bool = false;
      if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
          bool = true;
      }
      return bool;
  }
  isMap(path: string): boolean{
      var titlee = this.location.prepareExternalUrl(this.location.path());
      titlee = titlee.slice( 1 );
      if(path == titlee){
          return false;
      }
      else {
          return true;
      }
  }

  onSubmitSettings() {
    this.router.navigate(['/settings-page']);
  }
  toHome() {
    this.router.navigate(['/home'])
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
