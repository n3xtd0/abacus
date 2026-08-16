import * as migration_20260816_085416_split_event_live_state from './20260816_085416_split_event_live_state'
import * as migration_20260816_091605_enable_live_event_realtime from './20260816_091605_enable_live_event_realtime'
import * as migration_20260816_115100_add_rebuy_deduction_setting from './20260816_115100_add_rebuy_deduction_setting'
import * as migration_20260816_120000_add_eliminated_players from './20260816_120000_add_eliminated_players'

export const migrations = [
  {
    up: migration_20260816_085416_split_event_live_state.up,
    down: migration_20260816_085416_split_event_live_state.down,
    name: '20260816_085416_split_event_live_state',
  },
  {
    up: migration_20260816_091605_enable_live_event_realtime.up,
    down: migration_20260816_091605_enable_live_event_realtime.down,
    name: '20260816_091605_enable_live_event_realtime',
  },
  {
    up: migration_20260816_115100_add_rebuy_deduction_setting.up,
    down: migration_20260816_115100_add_rebuy_deduction_setting.down,
    name: '20260816_115100_add_rebuy_deduction_setting',
  },
  {
    up: migration_20260816_120000_add_eliminated_players.up,
    down: migration_20260816_120000_add_eliminated_players.down,
    name: '20260816_120000_add_eliminated_players',
  },
]
