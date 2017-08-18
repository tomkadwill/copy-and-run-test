'use babel';

import CopyAndRunTestView from './copy-and-run-test-view';
import { CompositeDisposable } from 'atom';

export default {

  copyAndRunTestView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.copyAndRunTestView = new CopyAndRunTestView(state.copyAndRunTestViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.copyAndRunTestView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'copy-and-run-test:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.copyAndRunTestView.destroy();
  },

  serialize() {
    return {
      copyAndRunTestViewState: this.copyAndRunTestView.serialize()
    };
  },

  toggle() {
    /* HTMLElement - Copy
    <div id="copy-target">hello</div>
    <button class="copy-button" data-clipboard-action="copy" data-clipboard-target="#copy-target">Copy</button>
    */
    const editor = atom.workspace.getActivePaneItem()
    const relativePath = atom.project.relativizePath(editor.buffer.getPath())[1]

    atom.clipboard.write("rails test " + relativePath)
  }

};
