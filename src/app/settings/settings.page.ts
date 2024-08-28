import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Location } from '@angular/common';
import { Storage } from '@ionic/storage-angular';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
})
export class SettingsPage {
  storageUsed = '0'; 
  addNewItemsToBottom = true;
  theme = 'light';
  appIcon = 'icon1';

  constructor(
    private toastController: ToastController,
    private location: Location,
    private storage: Storage,
    private settingsService: SettingsService
  ) { 
    this.init();
  }

  // initializing the storage and loading the settings
  async init() {
    await this.storage.create();
    await this.calculateStorageUsage();
    await this.loadSettings();
  }

  // function to calculate the storage usage
  async calculateStorageUsage() {
    try {
      let totalBytes = 0;
      const keys = await this.storage.keys();

      for (let key of keys) {
        const value = await this.storage.get(key);
        if (value) {
          totalBytes += this.calculateSizeInBytes(JSON.stringify(value));
        }
      }

      const storageInMB = (totalBytes / (1024 * 1024)).toFixed(2);
      this.storageUsed = storageInMB;
    } catch (error) {
      console.error('Error calculating storage usage:', error);
    }
  }

  calculateSizeInBytes(value: string): number {
    return new Blob([value]).size;
  }

  // loading the settings from the storage
  async loadSettings() {
    this.addNewItemsToBottom = await this.settingsService.getAddNewItemsToBottom();

    const savedTheme = localStorage.getItem('theme');
    const savedIcon = localStorage.getItem('appIcon');

    if (savedTheme) {
      this.theme = savedTheme;
      document.body.classList.toggle('dark-theme', savedTheme === 'dark');
    }
    if (savedIcon) {
      this.appIcon = savedIcon;
    }
  }  

  async toggleAddNewItems(event: any) {
    this.addNewItemsToBottom = event.detail.checked;
    await this.settingsService.setAddNewItemsToBottom(this.addNewItemsToBottom);
  }

  changeTheme(event: any) {
    this.theme = event.detail.value;
    document.body.classList.toggle('dark-theme', this.theme === 'dark');
    localStorage.setItem('theme', this.theme);
  }

  changeAppIcon(event: any) {
    this.appIcon = event.detail.value;
    localStorage.setItem('appIcon', this.appIcon);
  }

  async clearAllNotes() {
    await this.storage.clear();
  }

  async clearCache() {
    try {
      localStorage.clear();
      await this.clearAllNotes();
      await this.calculateStorageUsage(); 
      await this.presentToast('Cache cleared', 2000);  
      this.location.back();
    } catch (error) {
      console.error('Error clearing cache:', error);
      this.presentToast('Error clearing cache', 2000);
    }
  }

  async presentToast(message: string, duration: number = 2000) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: 'bottom',
      color: 'dark',
      cssClass: 'toast-custom',
    });
    toast.present();
  }
}
