#! /usr/bin/env node
'use strict';

// Summary:
//  Build scalable web applications with React, Redux and React-router.
// Usage:
//  rekit action [...args]

const path = require('path');
const fs = require('fs');
const ArgumentParser = require('argparse').ArgumentParser;
const rekitPkgJson = require('../package.json');
const create = require('./create');

// If runs under a project
function getLocalRekitCore() {
  let cwd = process.cwd();
  let lastDir = null;
  let prjRoot = null;
  // Traverse above until find the package.json.
  while (cwd && lastDir !== cwd) {
    if (fs.existsSync(path.join(cwd, 'package.json'))) {
      prjRoot = cwd;
      break;
    }
    lastDir = cwd;
    cwd = path.join(cwd, '..');
  }

  if (!prjRoot || !fs.existsSync(path.join(prjRoot, 'node_modules/rekit-core/package.json'))) {
    return null;
  }
  return require(path.join(prjRoot, 'node_modules/rekit-core'));
}

const rekitCore = getLocalRekitCore();

const parser = new ArgumentParser({
  version: rekitPkgJson.version,
  addHelp: true,
  description: 'Build scalable web applications with React, Redux and React-router.'
});

// parser.addArgument('action', {
//   help: 'The action to take. Rekit core provides [add, remove, move]',
// });

const subparsers = parser.addSubparsers({
  title: 'Sub commands',
  dest: 'commandName',
});

// Create project
const createCmd = subparsers.addParser('create',
  {
    addHelp: true,
    description: 'Create a new Rekit project.',
  }
);

createCmd.addArgument('name', {
  help: 'The project name',
});

createCmd.addArgument(['--plugin', '-p'], {
  help: 'Indicate its a Rekit plugin project',
  action: 'storeTrue',
});

createCmd.addArgument(['--sass'], {
  help: 'Use sass rather than less.',
  action: 'storeTrue',
});

// Add sub-command
const addCmd = subparsers.addParser('add',
  {
    addHelp: true,
    description: 'Add an element to the project.',
  }
);

addCmd.addArgument('type', {
  help: 'The type of the element to add.'
});

addCmd.addArgument('name', {
  help: 'The element name to add, in format of <feature>/<name>, e.g.: \'rekit add component user/list-view\'. Name is unnecessary if add a feature.'
});

// Remove sub-command
const rmCmd = subparsers.addParser('remove',
  {
    aliases: ['rm'],
    addHelp: true,
    description: 'Remove an element from the project.',
  }
);

rmCmd.addArgument('type', {
  help: 'The type of the element to remove.'
});

rmCmd.addArgument('name', {
  help: 'The element name to remove, in format of <feature>/<name>, e.g.: \'rekit remove component user/list-view\'. Name is unnecessary if remove a feature.'
});

// Move sub-command
const mvCmd = subparsers.addParser('move',
  {
    aliases: ['mv'],
    addHelp: true,
    description: 'Move or rename an element.',
  }
);

mvCmd.addArgument('type', {
  help: 'The type of the element to move.'
});

mvCmd.addArgument('source', {
  help: 'The source element to move, in format of <feature>/<name>, e.g.: \'rekit move component user/list-view employee/list\'. Name is unnecessary if move a feature.'
});

mvCmd.addArgument('target', {
  help: 'The target element to reach, in format of <feature>/<name>, e.g.: \'rekit move component user/list-view employee/list\'. Name is unnecessary if move a feature.'
});

const args = parser.parseArgs();

console.time('😃  Done');
// Convert aliases
const aliases = { rm: 'remove', mv: 'move' };
Object.keys(aliases).forEach((k) => {
  if (args.commandName === k) {
    args.commandName = aliases[k];
  }
});

switch (args.commandName) {
  case 'create':
    // Only create command is handled rekit
    create(args);
    break;
  default:
    // Other command are handled by rekit-core
    if (!rekitCore) {
      console.log('Error: please ensure rekit-core is already installed.');
      process.exit(1);
    }
    rekitCore.handleCommand(args);
    rekitCore.vio.flush();
    console.timeEnd('😃  Done'); // create command doesn't need time end.
    break;
}

