'use babel';

import { CompositeDisposable } from 'atom';
import Iterm from "./iterm";

export default {

  copyAndRunTestView: null,
  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'copy-and-run-test:all': () => this.copyAndRun(),
      'copy-and-run-test:under-cursor': () => this.copyAndRunLineUnderCursor(),
      'copy-and-run-test:rerun': () => this.copyAndRunRerun()
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
    if(this.relativePath().includes('_test.rb')) {
      return `rails test ${this.relativePath()}`
    } else if (this.relativePath().includes('_spec.rb')) {
      return `bundle exec rspec ${this.relativePath()}`
    }
  },

  copyAndRunLineUnderCursorCommand() {
    if(this.relativePath().includes('_test.rb')) {
      return `rails test ${this.relativePath()}:${this.lineNumber()}`
    } else if (this.relativePath().includes('_spec.rb')) {
      return `bundle exec rspec ${this.relativePath()}:${this.lineNumber()}`
    }
  },

  copyAndRunRerunCommand() {
    return window.localStorage.getItem('copy-and-run-test:last-command')
  },

  terminalCommands() {
    terminal = new Iterm()

    return terminal.command()
  },

  storeCommand(command) {
    window.localStorage.setItem('copy-and-run-test:last-command', command);
  },

  runCommand(command) {
    // Although this isn't required it may be a good backup incase
    // Applescript doesn't work (eg: wrong tab)
    atom.clipboard.write(command)

    const osascript = require('node-osascript')

    this.storeCommand(command)

    osascript.execute(this.terminalCommands(), {code: command}, function(error, result, raw) {
      if (error) return console.error(error)
    });
  },

  copyAndRun() {
    this.runCommand(this.copyAndRunCommand())
  },

  copyAndRunLineUnderCursor() {
    this.runCommand(this.copyAndRunLineUnderCursorCommand())
  },

  copyAndRunRerun() {
    this.runCommand(this.copyAndRunRerunCommand());
  }
};
