#!/usr/bin/env node
const chalk = require('chalk');
const program = require('commander');
const pkg = require('./package');
const path = require('path');
const fs = require('fs-extra');
const question = require('./utils/question');
const generator = require('./utils/generator');
let config = {
	name: '',
	pkg: ''
};
process.on("unhandledRejection", err => {
	throw err;
});
program
	.name(pkg.name)
	.version(pkg.version)
	.arguments('[projectName]')
	.option('-p, --package [package]', 'package manager [yarn | npm]', function(pkg) {
		console.log('pkg', pkg);
		if (pkg && pkg !== 'yarn' && pkg !== 'npm') {
			console.log(chalk.red('package just supported "yarn" or "npm"'));
			process.exit(-1);
		}
		config.pkg = pkg;
	})
	.action(execute)
	.parse(process.argv);

async function execute(projectName) {
	config.name = projectName;
	if (!config.name) {
		config.name = await question('project name?', 'input');
	}
	if(!/^[a-z\-_@]+$/.test(config.name)) {
		console.error(`Project names can only be composed of lowercase letters or -_@`)
		config.name = '';
		await execute()
		return
	}
	const targetDir = path.resolve(process.cwd(), config.name);
	console.log('Creating a new Awesome Api Project in ', chalk.green(targetDir), '.');
	console.log();
	console.log('config', chalk.green('package manager'), ': ', config.pkg);
	await generator(config);
}
