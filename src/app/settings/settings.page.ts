import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Location } from '@angular/common';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
})
export class SettingsPage {
  storageUsed = '0'; // Example value
  addNewItemsToBottom = true;
  theme = 'light';
  appIcon = 'icon1';

  constructor(
    private toastController: ToastController,
    private location: Location,
    private storage: Storage
  ) { 
    this.storage.create(); // Ensure storage is initialized
    this.calculateStorageUsage();
    this.loadSettings();
  }


  async calculateStorageUsage() {
    let totalBytes = 0;

    // Get all keys from the storage
    const keys = await this.storage.keys();

    // Iterate through each key and calculate the size of the stored value
    for (let key of keys) {
      const value = await this.storage.get(key);
      if (value) {
        totalBytes += this.calculateSizeInBytes(JSON.stringify(value));
      }
    }

    // Convert bytes to MB and update storageUsed
    const storageInMB = (totalBytes / (1024 * 1024)).toFixed(2);
    this.storageUsed = storageInMB;
  }

  // Helper method to calculate size in bytes
  calculateSizeInBytes(value: string): number {
    return new Blob([value]).size;
  }

  loadSettings() {
    const savedPreference = localStorage.getItem('addNewItemsToBottom');
    const savedTheme = localStorage.getItem('theme');
    const savedIcon = localStorage.getItem('appIcon');

    if (savedPreference !== null) {
      this.addNewItemsToBottom = JSON.parse(savedPreference);
    }
    if (savedTheme) {
      this.theme = savedTheme;
      document.body.classList.toggle('dark-theme', savedTheme === 'dark');
    }
    if (savedIcon) {
      this.appIcon = savedIcon;
    }
  }  

  toggleAddNewItems(event: any) {
    this.addNewItemsToBottom = event.detail.checked;
    localStorage.setItem('addNewItemsToBottom', JSON.stringify(this.addNewItemsToBottom));
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

  clearCache() {
    localStorage.clear();
    this.clearAllNotes();
    this.calculateStorageUsage(); // Recalculate after clearing cache
    alert('Cache cleared successfully!');
    this.presentToast('Cache cleared');  // Show toast message
    this.location.back();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,  // Duration in milliseconds
      position: 'bottom',  // Position on the screen
      color: 'dark',  // Customize the color if needed
      cssClass: 'toast-custom',
    });
    toast.present();
  }
}