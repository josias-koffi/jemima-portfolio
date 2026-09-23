import * as migration_20260923_112825_initial from './20260923_112825_initial';
import * as migration_20260923_131906_content_structure from './20260923_131906_content_structure';

export const migrations = [
  {
    up: migration_20260923_112825_initial.up,
    down: migration_20260923_112825_initial.down,
    name: '20260923_112825_initial',
  },
  {
    up: migration_20260923_131906_content_structure.up,
    down: migration_20260923_131906_content_structure.down,
    name: '20260923_131906_content_structure'
  },
];
