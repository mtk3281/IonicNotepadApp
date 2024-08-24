// notes.service.ts
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

  async saveNote(note: any) {
    if (this.localStorage) {
      // await this.localStorage.set('note_' + Date.now(), note);
        await this.localStorage.set(note.id, note); // Use the note's id as the key
    
    } else {
      console.error('Storage is not initialized');
    }
  }

  async getNotes(): Promise<any[]> {
    const notes: any[] = [];
    if (this.localStorage) {
      const keys = await this.localStorage.keys();
      for (const key of keys) {
        if (key.startsWith('note_')) {
          const note = await this.localStorage.get(key);
          if (note) {
            notes.push(note);
          }
        }
      }
    } else {
      console.error('Storage is not initialized');
    }
    return notes;
  }

  async getNoteById(id: string) {
    const notes = await this.getNotes();
    return notes.find((note: any) => note.id === id);
  }

    async deleteNoteById(id: string) {
      if (this.localStorage) {
        await this.localStorage.remove(id);
      } else {
        console.error('Storage is not initialized');
      }
    }
  

  async updateNote(note: any) {
    const notes = await this.getNotes();
    const index = notes.findIndex((n: any) => n.id === note.id);
    if (index > -1) {
      notes[index] = note;
      await this.storage.set('notes', JSON.stringify(notes));
    }
  }
}
