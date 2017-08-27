'use babel';

import { CompositeDisposable } from 'atom';

export default class Iterm {
  command() {
    const command = []

    command.push('tell application "iTerm"')
    command.push('  tell the current window')
    command.push('    tell current session')
    command.push('      write text code')
    command.push('    end tell')
    command.push('  end tell')
    command.push('end tell')

    command.push('activate application "iTerm"')

    return command.join('\n')
  }
};
