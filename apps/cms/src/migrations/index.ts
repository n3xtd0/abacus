import * as migration_20260816_085416_split_event_live_state from './20260816_085416_split_event_live_state';
import * as migration_20260816_091605_enable_live_event_realtime from './20260816_091605_enable_live_event_realtime';

export const migrations = [
  {
    up: migration_20260816_085416_split_event_live_state.up,
    down: migration_20260816_085416_split_event_live_state.down,
    name: '20260816_085416_split_event_live_state',
  },
  {
    up: migration_20260816_091605_enable_live_event_realtime.up,
    down: migration_20260816_091605_enable_live_event_realtime.down,
    name: '20260816_091605_enable_live_event_realtime'
  },
];
