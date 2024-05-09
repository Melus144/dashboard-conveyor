import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private userName!: string;
  private userPassword!: string;
  private pullImageMode!: string;
  constructor() { }
  //for pull image setting mode
  getSettingsData(): string {
    return this.pullImageMode;
  }
  setSettingsData(pullImage: string) {
    this.pullImageMode = pullImage;
  }
  //for Login 
  getUserCredentials(): string {
    return this.userName;
  }
  setUserCredentials(userCredentials: string) {
    this.userName = userCredentials;
    this.userPassword = userCredentials;
  }
}
