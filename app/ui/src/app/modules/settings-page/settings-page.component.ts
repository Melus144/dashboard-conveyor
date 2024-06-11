import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '../../services/settings.service';

interface Settings {
  trainModel: boolean;
  pullImage: string;
  primaryColor: string;
  logoUrl: string;
  backgroundImage: string;
}

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit {
  settings: Settings;
  availableColors: string[] = ['blue', 'azure', 'green', 'orange', 'red', 'purple'];
  availableBackgrounds: string[] = ['/assets/images/sidebar-0.jpg', '/assets/images/sidebar-1.jpg'];
pullImageMode: any;

  constructor(
    private router: Router,
    private settingsService: SettingsService
  ) {
    this.settings = this.settingsService.getSettings();
  }

  ngOnInit(): void {}

  onFileChange(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.settings.logoUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  onBackgroundChange(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.settings.backgroundImage = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  saveSettings(): void {
    this.settingsService.updateSettings(this.settings);
  }
}
