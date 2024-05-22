import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '/home', title: 'Dashboard'},
    { path: '/live-preview', title: 'Live Preview'},
    { path: '/info-page', title: 'Results'},
    { path: '/model-view', title: 'Model View'},
    { path: '/notifications', title: 'Notifications'},
    { path: '/settings-page', title: 'Settings'},
    { path: '/login', title: 'Login'},
];


@Component({
    selector: 'footer-cmp',
    templateUrl: 'footer.component.html'
})


export class FooterComponent{
    test : Date = new Date();
    footerItems: any[] = [];
    constructor() { }

    ngOnInit() {
      this.footerItems = ROUTES.filter(footerItem => footerItem);
    }
}
