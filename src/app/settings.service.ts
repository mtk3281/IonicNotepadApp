import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private addNewItemsToBottomKey = 'addNewItemsToBottom';

  constructor(private storage: Storage) {
    this.init();
  }

  private async init() {
    await this.storage.create();
  }

  // Save a note to the storage
  async setAddNewItemsToBottom(value: boolean) {
    await this.storage.set(this.addNewItemsToBottomKey, value);
  }

  // Get all notes from the storage based on the archive status
  async getAddNewItemsToBottom(): Promise<boolean> {
    const value = await this.storage.get(this.addNewItemsToBottomKey);
    return value !== null ? value : true; // Default to true if not set
  }
  
}
