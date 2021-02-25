import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

  @ViewChild('filterInput') filterInputElRef: ElementRef<HTMLInputElement>

  constructor(private notesService: NotesService) { }

  ngOnInit(): void {
    // Retreiving all the notes from NoteServices
    this.notes = this.notesService.getAll();
    this.filter("");
  }

  deleteNote(note: Note){
    let noteId: number = this.notesService.getId(note);
    this.notesService.delete(noteId);

    // When we delete a note, we need to filter the notes again to make sure the filtering is updated.
    this.filter(this.filterInputElRef.nativeElement.value);
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

    // Sort the notes by relevancy
    this.sortByRelevancy(allResults);
  }

  generateLinkUrlFromNote(note: Note) : string {
    return this.notesService.getId(note).toString();
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

  sortByRelevancy(searchResults: Note[]){
    // This method will caculate the relevancy of a note based on the number of times it appears in the search results.
    let noteCountObj: Object = {}; // NoteId -> number in the search result
    searchResults.forEach(note => {
      let noteId = this.notesService.getId(note);

      if (noteCountObj[noteId]) {
        noteCountObj[noteId] += 1;
      }
      else {
        noteCountObj[noteId] = 1;
      }
    })

    this.filteredNotes = this.filteredNotes.sort((a:Note, b:Note) => {
      let aId = this.notesService.getId(a);
      let bId = this.notesService.getId(b);

      let aCount = noteCountObj[aId];
      let bCount = noteCountObj[bId];

      return bCount - aCount;
    })
  }
}
