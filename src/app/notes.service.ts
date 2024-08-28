import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})

export class NotesService {
  private localStorage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  private async init() {
    this.localStorage = await this.storage.create();
  }

  // Save a note to the storage
  async saveNote(note: any) {
    if (this.localStorage) {
      await this.localStorage.set(note.id, note); 
    } else {
      console.error('Storage is not initialized');
    }
  }

  // Get all notes from the storage based on the archive status
  async getNotes(archiveStatus: boolean): Promise<any[]> {
    const notes: any[] = [];
    if (this.localStorage) {
      const keys = await this.localStorage.keys();
      for (const key of keys) {
        if (key.startsWith('note_')) {
          const note = await this.localStorage.get(key);
          if (note && note.isArchived === archiveStatus) {
            notes.push(note);
          }
        }
      }
    } else {
      console.error('Storage is not initialized');
    }
    return notes;
  }

  //get note by id 
  async getNoteById(id: string) {
    if (this.localStorage) {
      return await this.localStorage.get(id);
    }
    return null;
  }

  // delete note by id
  async deleteNoteById(id: string) {
    if (this.localStorage) {
      await this.localStorage.remove(id);
    } else {
      console.error('Storage is not initialized');
    }
  }

  async updateNote(note: any) {
    if (this.localStorage) {
      await this.localStorage.set(note.id, note); 
    } else {
      console.error('Storage is not initialized');
    }
  }

  // Get all notes from the storage based on the date
  async getNoteByDate(date: string): Promise<any[]> {
    const notes: any[] = [];
    if (this.localStorage) {
      const keys = await this.localStorage.keys();
      for (const key of keys) {
        if (key.startsWith('note_')) {
          const note = await this.localStorage.get(key);
          if (note && note.date && note.isArchived === false) { 
            const noteDate = new Date(note.date).toLocaleDateString('en-GB'); // Convert to dd/mm/yyyy format
            if (noteDate === date) {
              notes.push(note);
            }
          }
        }
      }
    } else {
      console.error('Storage is not initialized');
    }
    return notes;
  }
  
}
