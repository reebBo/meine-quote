import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { loadUsers, User } from './state/user/user.actions';
import { Store } from '@ngrx/store';
import { selectAllUsers, selectUsersLoading } from './state/user/user.selectors';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'meine-quote';

   users$: Observable<User[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store) {
    this.users$ = this.store.select(selectAllUsers);
    this.loading$ = this.store.select(selectUsersLoading); 
  }

  ngOnInit(): void {
    this.store.dispatch(loadUsers());
  }
}
