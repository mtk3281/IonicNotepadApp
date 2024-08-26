import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
})
export class SettingsPage {
  storageUsed = '50'; // Example value

  constructor() { }

  changeTheme(event: any) {
    const theme = event.detail.value;
    document.body.classList.toggle('dark-theme', theme === 'dark');
    localStorage.setItem('theme', theme);
  }

  changeFontSize(event: any) {
    const fontSize = event.detail.value;
    document.body.style.fontSize = fontSize;
    localStorage.setItem('fontSize', fontSize);
  }

  changeAppIcon(event: any) {
    const icon = event.detail.value;
    // Apply icon change logic
    localStorage.setItem('appIcon', icon);
  }

  clearCache() {
    // Logic to clear cache
  }

  exportNotes(format: string) {
    // Logic to export notes in the selected format
  }

  toggleAppLock(event: any) {
    const isEnabled = event.detail.checked;
    // Logic to enable or disable app lock
  }

  setAutoLockTime(event: any) {
    const minutes = event.detail.value;
    // Logic to set auto-lock time
  }
}
