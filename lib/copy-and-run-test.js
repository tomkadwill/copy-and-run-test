'use babel';

import { CompositeDisposable } from 'atom';
import Iterm from "./iterm";

export default {

  copyAndRunTestView: null,
  subscriptions: null,

  config: {
    terminal: {
      type: 'string',
      title: 'Test runner',
      default: 'iterm2',
      enum: [
        {value: 'platformio', description: 'PlatformIO IDE Terminal'},
        {value: 'iterm2', description: 'iTerm2'}
      ],
      description: 'Choose the terminal app to run your tests in',
      order: 1
    },
    shell: {
      type: 'string',
      title: 'Shell type',
      default: 'bash',
      enum: [
        {value: 'bash', description: 'bash'},
        {value: 'fish', description: 'fish'}
      ],
      description: 'The type of shell that you are running',
      order: 2
    }
  },

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

  consumePlatformioIDETerminal(platformioIDETerminal) {
    this.terminalRunner = platformioIDETerminal;
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

  terminalType() {
    return atom.config.get('copy-and-run-test.terminal');
  },

  shellType() {
    return atom.config.get('copy-and-run-test.shell');
  },

  runCommand(command) {
    switch(this.terminalType()) {
      case 'platformio':
        this.runCommandPlatformio(command);
        break;
      case 'iterm2':
        this.runCommandIterm2(command);
        break;
    }
  },

  runCommandPlatformio(command) {
    this.storeCommand(command)
    // TODO: This should only be added if platformio-term setting 'Close terminal on exit' is set

    switch(this.shellType()) {
      case 'bash':
        this.terminalRunner.run([`${command} ; read -p "Press enter to continue" ; exit`]);
        break;
      case 'fish':
        this.terminalRunner.run([`${command} ; read -P "Press enter to continue" ; exit`]);
        break;
    }
  },

  runCommandIterm2(command) {
    const osascript = require('node-osascript')

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
