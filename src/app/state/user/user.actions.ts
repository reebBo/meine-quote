import { createAction, props } from '@ngrx/store';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export const loadUsers = createAction('[User API] Load Users');
export const loadUsersSuccess = createAction(
  '[User API] Load Users Success',
  props<{ users: User[] }>()
);