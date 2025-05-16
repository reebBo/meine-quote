import { createReducer, on } from '@ngrx/store';
import { loadUsers, loadUsersSuccess, User } from './user.actions';

export interface UserState {
  users: User[];
  loading: boolean;
}

export const initialState: UserState = {
  users: [],
  loading: false
};

export const userReducer = createReducer(
  initialState,
  on(loadUsers, (state) => ({ ...state, loading: true })),
  on(loadUsersSuccess, (state, { users }) => ({ ...state, users, loading: false }))
);