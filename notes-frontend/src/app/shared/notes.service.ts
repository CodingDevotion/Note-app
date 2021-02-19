import { Injectable } from '@angular/core';
import { Note } from './note.model';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  notes: Note[] = new Array<Note>();
  constructor() { }

  get(id: number) {
    return this.notes[id];
  }

  getAll() {
    return this.notes;
  }
  
  getId(note: Note) {
    return this.notes.indexOf(note);
  }

  add(note: Note){
    // This method will add a note to the notes array and return the id of the note 
    let newLenght = this.notes.push(note);
    let index = newLenght - 1;
    return index;
  }

  update(id: number, title: string, body: string){
    let note = this.notes[id];
    note.title = title;
    note.body = body;
  }

  delete(id: number){
    this.notes.splice(id, 1);
  }
}
