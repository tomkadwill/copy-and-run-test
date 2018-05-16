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
        atom.workspace.getActiveTextEditor().setCursorBufferPosition(new Point(0, 0));
      });
    });

    it('runs minitest', () => {
      expect(CopyAndRunTest.copyAndRunCommand()).toBe('rails test test/controllers/application_controller_test.rb')
    });
  });

  describe('RSpec file', () => {
    beforeEach(() => {
      waitsForPromise(function() {
        return atom.workspace.open(path.join(atom.project.getPaths()[0], 'spec', 'controllers', 'application_controller_spec.rb'));
        atom.workspace.getActiveTextEditor().setCursorBufferPosition(new Point(0, 0));
      });
    });

    it('runs RSpec', () => {
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
      atom.workspace.getActiveTextEditor().setCursorBufferPosition([2, 2]);
      expect(CopyAndRunTest.copyAndRunLineUnderCursorCommand()).toBe('rails test test/controllers/application_controller_test.rb:3')
    });
  });

  describe('RSpec file', () => {
    beforeEach(() => {
      waitsForPromise(function() {
        return atom.workspace.open(path.join(atom.project.getPaths()[0], 'spec', 'controllers', 'application_controller_spec.rb'));
      });
    });

    it('runs RSpec', () => {
      atom.workspace.getActiveTextEditor().setCursorBufferPosition([2, 2]);
      expect(CopyAndRunTest.copyAndRunLineUnderCursorCommand()).toBe('bundle exec rspec spec/controllers/application_controller_spec.rb:3')
    })
  })
});

describe('copyAndRunRerun', () => {
  let workspaceElement, activationPromise;

  describe('minitest file', () => {
    beforeEach(() => {
      waitsForPromise(function() {
        return atom.workspace.open(path.join(atom.project.getPaths()[0], 'test', 'controllers', 'application_controller_test.rb'));
      });
    });

    it('runs minitest', () => {
      atom.workspace.getActiveTextEditor().setCursorBufferPosition([2, 2]);
      CopyAndRunTest.storeCommand(CopyAndRunTest.copyAndRunLineUnderCursorCommand());
      expect(CopyAndRunTest.copyAndRunRerunCommand()).toBe('rails test test/controllers/application_controller_test.rb:3')
    });
  });

  describe('RSpec file', () => {
    beforeEach(() => {
      waitsForPromise(function() {
        return atom.workspace.open(path.join(atom.project.getPaths()[0], 'spec', 'controllers', 'application_controller_spec.rb'));
      });
    });

    it('runs RSpec', () => {
      atom.workspace.getActiveTextEditor().setCursorBufferPosition([2, 2]);
      CopyAndRunTest.storeCommand(CopyAndRunTest.copyAndRunLineUnderCursorCommand());
      expect(CopyAndRunTest.copyAndRunRerunCommand()).toBe('bundle exec rspec spec/controllers/application_controller_spec.rb:3')
    })
  })
});
