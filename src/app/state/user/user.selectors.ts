import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UserState } from './user.reducer';

export const selectUserFeature = createFeatureSelector<UserState>('user');

export const selectAllUsers = createSelector(
  selectUserFeature,
  (state) => state.users
);
export const selectUsersLoading = createSelector(
  selectUserFeature,
  (state) => state.loading
);