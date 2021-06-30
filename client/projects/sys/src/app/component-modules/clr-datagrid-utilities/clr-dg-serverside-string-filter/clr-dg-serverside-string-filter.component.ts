import { Component, Input } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ClrServerSideStringFilter } from '../datagrid-filters';

@Component({
  selector: 'audi-sys-clr-dg-serverside-string-filter',
  templateUrl: './clr-dg-serverside-string-filter.component.html',
  styleUrls: ['./clr-dg-serverside-string-filter.component.scss'],
})
export class ClrDgServersideStringFilterComponent {
  @Input()
  stringFilter: ClrServerSideStringFilter;

  debounce: any;

  triggerFilterChanges(stringFilterInputEl: HTMLInputElement) {
    this.stringFilter.value = stringFilterInputEl.value;

    // couldn't pipe debounceTime into stringFilter.changes.next() because it's a subject
    // gotta use setTimeout to manually mimick this effect, and everytime the user types
    // we clear the timeout until the typing has stopped and next() the subject after 200ms
    // see: https://stackoverflow.com/questions/50275945/how-to-implement-a-debounce-time-in-keyup-event-in-angular-6
    clearTimeout(this.debounce);
    this.debounce = setTimeout( () => {
      this.stringFilter.changes.next();
    }, 200);
  }
}
