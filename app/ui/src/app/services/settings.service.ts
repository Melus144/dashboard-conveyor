
import { Injectable } from '@angular/core';

interface Settings {
  trainModel: boolean;
  pullImage: string;
  primaryColor: string;
  logoUrl: string;
  backgroundImage: string;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settings: Settings = {
    trainModel: true,
    pullImage: 'Edge',
    primaryColor: 'blue',
    logoUrl: '/assets/images/gftlogo.png',
    backgroundImage: '/assets/images/sidebar-0.jpg'
  };

  constructor() {
    this.loadSettings();
  }

  getSettings(): Settings {
    return this.settings;
  }

  updateSettings(newSettings: Partial<Settings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
    this.applySettings();
  }

  private loadSettings(): void {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      this.settings = JSON.parse(savedSettings);
    }
  }

  private saveSettings(): void {
    localStorage.setItem('appSettings', JSON.stringify(this.settings));
  }

  applySettings(): void {
    // Apply primary color
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.setAttribute('data-color', this.settings.primaryColor);
    }

    // Apply logo URL
    const logoImg = document.querySelector('.logo-img img');
    if (logoImg) {
      logoImg.setAttribute('src', this.settings.logoUrl);
    }

    // Apply background image
    const sidebarBg = document.querySelector('.sidebar-background');
    if (sidebarBg) {
      sidebarBg.setAttribute('style', `background-image: url(${this.settings.backgroundImage})`);
    }
  }
}
