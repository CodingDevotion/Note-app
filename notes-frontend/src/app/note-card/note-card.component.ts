import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss']
})
export class NoteCardComponent implements OnInit {

  @Input('title') title: string; 
  @Input('body') body: string; 
  @ViewChild('truncator') truncator: ElementRef<HTMLElement>;
  @ViewChild('bodyText') bodyText: ElementRef<HTMLElement>;

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {

  }
  ngAfterViewInit(): void {
      // If the text is no overflowing, hide the truncator element.
      let style = window.getComputedStyle(this.bodyText.nativeElement, null);
      let viewableHeight = parseInt(style.getPropertyValue("height"), 10);

      console.log(this.bodyText.nativeElement.scrollHeight);
      console.log(viewableHeight);
    

      if (this.bodyText.nativeElement.scrollHeight > viewableHeight) {
        // If there is a text overflow, show fade out truncator
        this.renderer.setStyle(this.truncator.nativeElement, 'display', 'block');
      }
        // There is no text overflow, hide the fade out truncator
      else {
        this.renderer.setStyle(this.truncator.nativeElement, 'display', 'none');
      }
  }

}
