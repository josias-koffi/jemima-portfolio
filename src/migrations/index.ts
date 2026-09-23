import * as migration_20260923_112825_initial from './20260923_112825_initial';

export const migrations = [
  {
    up: migration_20260923_112825_initial.up,
    down: migration_20260923_112825_initial.down,
    name: '20260923_112825_initial'
  },
];
