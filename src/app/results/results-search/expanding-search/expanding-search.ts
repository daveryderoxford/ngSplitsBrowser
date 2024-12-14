import { Component, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-expanding-search',
    imports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, FormsModule],
    templateUrl: './expanding-search.html',
    styleUrl: './expanding-search.scss'
})
export class ExpandingSearch {

  expanded = signal(false);
  searchTerm = model('');

}

