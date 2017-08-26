'use babel';

import { CompositeDisposable } from 'atom';

export default {

  copyAndRunTestView: null,
  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'copy-and-run-test': () => this.copyAndRun(),
      'copy-and-run-test-under-cursor': () => this.copyAndRunLineUnderCursor()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  editor() {
    return atom.workspace.getActivePaneItem()
  },

  relativePath() {
    return atom.project.relativizePath(this.editor().buffer.getPath())[1]
  },

  lineNumber() {
    return this.editor().getCursorBufferPosition().row + 1
  },

  copyAndRunCommand() {
    return 'rails test ' + this.relativePath()
  },

  copyAndRunLineUnderCursorCommand() {
    return 'rails test ' + this.relativePath() + ':' + this.lineNumber()
  },

  appleScriptCommands() {
    const command = []

    const focusWindow = atom.config.get('r-exec.focusWindow')

    if(focusWindow) {
      command.push('tell application "iTerm" to activate')
    }

    command.push('tell application "iTerm"')
    command.push('  tell the current window')
    command.push('    tell current session')
    command.push('      write text code')
    command.push('    end tell')
    command.push('  end tell')
    command.push('end tell')

    command.push('activate application "iTerm"')

    return command.join('\n')
  },

  copyAndRun() {
    // Although this isn't required it may be a good backup incase
    // Applescript doesn't work (eg: wrong tab)
    atom.clipboard.write(this.copyAndRunCommand())

    const osascript = require('node-osascript')

    osascript.execute(this.appleScriptCommands(), {code: this.copyAndRunCommand()}, function(error, result, raw) {
      if (error) return console.error(error)
      console.log(result, raw)
    });
  },

  copyAndRunLineUnderCursor() {
    // Although this isn't required it may be a good backup incase
    // Applescript doesn't work (eg: wrong tab)
    atom.clipboard.write(this.copyAndRunLineUnderCursorCommand())

    const osascript = require('node-osascript')

    osascript.execute(this.appleScriptCommands(), {code: this.copyAndRunLineUnderCursorCommand()}, function(error, result, raw) {
      if (error) return console.error(error)
      console.log(result, raw)
    });
  }
};
