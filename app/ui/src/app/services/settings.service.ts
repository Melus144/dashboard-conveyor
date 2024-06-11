import { Injectable } from '@angular/core';

interface Settings {
  trainModel: boolean;
  pullImage: string;
  primaryColor: string;
  logoUrl: string;
  backgroundImage: string;
  logoPaddingVertical: string;
  logoPaddingHorizontal: string;
  logoWidth: number;
  logoHeight: number;
  showModelView: boolean;
  darkMode: boolean;
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
    backgroundImage: '/assets/images/sidebar-0.jpg',
    logoPaddingVertical: '20px',
    logoPaddingHorizontal: '0px',
    logoWidth: 100,
    logoHeight: 100,
    showModelView: true,
    darkMode: false
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
    const settings = this.getSettings();

    // Apply primary color
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.setAttribute('data-color', settings.primaryColor);
    }

    // Apply logo URL and styles
    const logoImg = document.querySelector('.logo-img img') as HTMLImageElement;
    const logoPlace = document.querySelector('.logo') as HTMLElement;
    if (logoImg && logoPlace) {
      logoImg.src = settings.logoUrl;
      logoImg.style.width = `${settings.logoWidth}px`;
      logoImg.style.height = `${settings.logoHeight}px`;
      logoPlace.style.paddingBottom = settings.logoPaddingVertical;
      logoPlace.style.paddingLeft = settings.logoPaddingHorizontal;
      logoPlace.style.paddingRight = settings.logoPaddingHorizontal;
    }

    // Apply background image
    const sidebarBg = document.querySelector('.sidebar-background') as HTMLElement;
    if (sidebarBg) {
      sidebarBg.style.backgroundImage = `url(${settings.backgroundImage})`;
    }

    // Apply dark mode
    const body = document.querySelector('body') as HTMLElement;
    if (body) {
      body.style.backgroundColor = settings.darkMode ? '#343a40' : 'whitesmoke';
      body.style.color = settings.darkMode ? '#ffffff' : '#000000';
    }

    // Apply dark mode to navbar
    const navbar = document.querySelector('.navbar') as HTMLElement;
    const footer = document.querySelector('.footer') as HTMLElement;
    if (navbar) {
      navbar.classList.toggle('navbar-dark', settings.darkMode);
      footer.classList.toggle('bg-dark', settings.darkMode);
      navbar.classList.toggle('navbar-light', !settings.darkMode);
      footer.classList.toggle('bg-light', !settings.darkMode);
      navbar.classList.toggle('bg-dark', settings.darkMode);
      navbar.classList.toggle('bg-light', !settings.darkMode);
    }

    // Show/Hide Model View
    const modelViewLink = document.querySelector('a[routerLink="model-view"]') as HTMLElement;
    if (modelViewLink) {
      modelViewLink.style.display = settings.showModelView ? 'block' : 'none';
    }
  }
}
