import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Note } from 'src/app/shared/note.model';
import { NotesService } from 'src/app/shared/notes.service';

@Component({
  selector: 'app-note-details',
  templateUrl: './note-details.component.html',
  styleUrls: ['./note-details.component.scss']
})
export class NoteDetailsComponent implements OnInit {

  note: Note;
  noteId: number;
  IsNewNote: boolean;

  constructor(private notesService: NotesService, private router:Router, private route:ActivatedRoute) { }

  ngOnInit(): void {

    // We want to find out if we are creating a new note or editing an existant one.
    this.route.params.subscribe((params: Params) => {
      this.note = new Note();
      if (params.id) {
        this.note = this.notesService.get(params.id);
        this.noteId = params.id;
        this.IsNewNote = false;
      }
      else {
        this.IsNewNote = true;
      }
    });
  }

  onSubmit(form: NgForm) {
    // Save the note
    if (this.IsNewNote) {
      this.notesService.add(form.value);
    }
    else {
      this.notesService.update(this.noteId, form.value.title, form.value.body);
    }
    this.router.navigateByUrl('/');
  }

  onCancel() {
     this.router.navigateByUrl('/');
  }
}
