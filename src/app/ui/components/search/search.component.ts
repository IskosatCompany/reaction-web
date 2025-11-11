import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { outputFromObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search',
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent {
  inputValue = '';
  searchTerm$ = new Subject<string>();
  searchTerm = outputFromObservable<string>(
    this.searchTerm$.pipe(debounceTime(300), distinctUntilChanged())
  );
}
