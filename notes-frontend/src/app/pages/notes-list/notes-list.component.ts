import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Note } from 'src/app/shared/note.model';
import { NotesService } from 'src/app/shared/notes.service';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
  animations: [
    trigger('itemAnim', [
      // Entry animation
      transition('void => *', [
        // Initial state
        style({
          height:0,
          opacity:0,
          transform: 'scale(0.85)',
          'margin-bottom': 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingRight: 0,
          paddingLeft: 0
        }),
        animate('50ms', style({
          height: '*',
          'margin-bottom': '*',
          paddingTop:  '*',
          paddingBottom:  '*',
          paddingRight:  '*',
          paddingLeft:  '*'
        })),
        animate(68)
      ]),

      transition('* => void', [
        // First scale up while deleting a card
        animate(50, style({
          transform: 'scale(1.05)'
        })),

        // Then scale down to normal size ehile beginning to fade out

        animate(50, style({
          transform: 'scale(1)',
          opacity: 0.75
        })),

        // Scale down and fade out
        animate('120ms ease-out', style({
          transform: 'scale(0.68)',
          opacity: 0,
        })),

        // Then animate the spacing
        animate('150ms ease-out', style({
          height:0,
          opacity:0,
          'margin-bottom': 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingRight: 0,
          paddingLeft: 0
        }))
      ])
    ]),

    trigger('listAnim', [
      transition('* => *', [
        query(':enter', [
          style({
            opacity: 0,
            height: 0
          }),
          stagger(100, [
            animate('0.2s ease')
          ])
        ], {
          optional: true
        })
      ])
    ])
  ]
})
export class NotesListComponent implements OnInit {

  notes: Note[] = new Array<Note>();
  filteredNotes: Note[] = new Array<Note>();

  constructor(private notesService: NotesService) { }

  ngOnInit(): void {
    // Retreiving all the notes from NoteServices
    this.notes = this.notesService.getAll();
    this.filteredNotes = this.notes;

  }

  deleteNote(id: number){
    this.notesService.delete(id);
  }

  filter(query: string) {
    query = query.toLowerCase().trim();
    let allResults: Note[] = new Array<Note>();

    // Split up the seach query into individual words
    let terms: string[] = query.split(' ');
    
    // Remove duplicate terms
    terms = this.removeDuplicates(terms);
    
    // Compile all relevant results into the allResults array
    terms.forEach(term => {
      let newResults: Note[] = this.findRelevantNotes(term);
      allResults = [...allResults, ...newResults];
    });
    let uniqueResults = this.removeDuplicates(allResults);
    this.filteredNotes = uniqueResults;
  }

  private removeDuplicates(arr: Array<any>) : Array<any> {
    let uniqueResults: Set<any> = new Set<any>();
    arr.forEach(element => uniqueResults.add(element));
    return Array.from(uniqueResults);
  }

  findRelevantNotes(query: string) : Array<Note>{
    query = query.toLowerCase().trim();
    let relevantNotes = this.notes.filter(note => {
      if (note.title && note.title.toLowerCase().includes(query)){
        return true;
      }
      if (note.body && note.body.toLowerCase().includes(query)) {
        return true;
      }

      return false;
    })
    return relevantNotes;
  }
}
