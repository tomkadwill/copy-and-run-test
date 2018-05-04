'use babel';

import CopyAndRunTest from '../lib/copy-and-run-test';
import path from 'path'

Point = require('atom').Point;

describe('copyAndRunCommand', () => {
  let workspaceElement, activationPromise;

  describe('minitest file', () => {
    beforeEach(() => {
      waitsForPromise(function() {
        return atom.workspace.open(path.join(atom.project.getPaths()[0], 'test', 'controllers', 'application_controller_test.rb'));
      });
    });

    it('runs minitest', () => {
      editor = atom.workspace.getActiveTextEditor();
      editor.setCursorBufferPosition(new Point(0, 0));
      expect(CopyAndRunTest.copyAndRunCommand()).toBe('rails test test/controllers/application_controller_test.rb')
    });
  });

  describe('RSpec file', () => {
    beforeEach(() => {
      waitsForPromise(function() {
        return atom.workspace.open(path.join(atom.project.getPaths()[0], 'spec', 'controllers', 'application_controller_spec.rb'));
      });
    });

    it('runs RSpec', () => {
      editor = atom.workspace.getActiveTextEditor();
      editor.setCursorBufferPosition(new Point(0, 0));
      expect(CopyAndRunTest.copyAndRunCommand()).toBe('bundle exec rspec spec/controllers/application_controller_spec.rb')
    })
  })
});

describe('copyAndRunLineUnderCursorCommand', () => {
  let workspaceElement, activationPromise;

  describe('minitest file', () => {
    beforeEach(() => {
      waitsForPromise(function() {
        return atom.workspace.open(path.join(atom.project.getPaths()[0], 'test', 'controllers', 'application_controller_test.rb'));
      });
    });

    it('runs minitest', () => {
      editor = atom.workspace.getActiveTextEditor();
      editor.setCursorBufferPosition(new Point(1, 1));
      expect(CopyAndRunTest.copyAndRunLineUnderCursorCommand()).toBe('rails test test/controllers/application_controller_test.rb:1')
    });
  });

  describe('RSpec file', () => {
    beforeEach(() => {
      waitsForPromise(function() {
        return atom.workspace.open(path.join(atom.project.getPaths()[0], 'spec', 'controllers', 'application_controller_spec.rb'));
      });
    });

    it('runs RSpec', () => {
      editor = atom.workspace.getActiveTextEditor();
      editor.setCursorBufferPosition(new Point(1, 1));
      expect(CopyAndRunTest.copyAndRunLineUnderCursorCommand()).toBe('bundle exec rspec spec/controllers/application_controller_spec.rb:1')
    })
  })
});
