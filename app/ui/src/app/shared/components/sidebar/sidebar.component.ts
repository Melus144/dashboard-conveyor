import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/home', title: 'Dashboard',  icon: 'pe-7s-graph', class: '' },
    { path: '/live-preview', title: 'Live Preview',  icon:'pe-7s-video', class: '' },
    { path: '/info-page', title: 'Results',  icon:'pe-7s-note2', class: '' },
    { path: '/model-view', title: 'Model View',  icon:'pe-7s-box1', class: '' },
    { path: '/settings-page', title: 'Settings',  icon:'pe-7s-settings', class: '' },
    { path: '/login', title: 'Login',  icon:'pe-7s-user', class: 'active-pro' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  menuItems: any[] = [];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
