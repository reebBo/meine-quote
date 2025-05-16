import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loadUsers, loadUsersSuccess } from './user.actions';
import { mergeMap, map } from 'rxjs/operators';
import { UserService } from '../../services/user.service';

@Injectable()
export class UserEffects {
 loadUsers$;

  constructor(private actions$: Actions, private userService: UserService) {
    this.loadUsers$ = createEffect(() =>
      this.actions$.pipe(
        ofType(loadUsers),
        mergeMap(() => this.userService.getUsers().pipe(
          map(users => loadUsersSuccess({ users }))
        ))
      )
    );
  }
}