const Spinner = require('cli-spinner').Spinner;
const { execSync, exec, spawn } = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const download = require('download-git-repo');
const owner = 'YSMJ1994';

function downloadTemplate(dest) {
	return new Promise((resolve, reject) => {
		download(`direct:http://gitlab.jinbill.com/template-project-front/awesome-api-template.git`, dest, {}, function(
			err
		) {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}

async function copyReadme(targetDir) {
	const src = path.resolve(__dirname, '../../project_readme.md');
	const dest = path.resolve(targetDir, 'README.md');
	await fs.copy(src, dest);
}

async function generator({ name, pkg }) {
	console.log();
	const targetDir = path.resolve(process.cwd(), name);
	if (fs.existsSync(targetDir)) {
		console.log(`目录 ${chalk.red(name)} 已存在！`);
		return;
	} else {
		fs.ensureDirSync(targetDir);
	}
	console.log('Installing packages. This might take a couple of minutes.');
	const spin = new Spinner('downloading... ');
	spin.setSpinnerString(18);
	spin.start();

	// 下载模板项目至目标目录
	await downloadTemplate(targetDir);
	spin.stop(true);
	console.log(chalk.green('download success！'));
	// 复制readme
	await copyReadme(targetDir);
	console.log();
	execSync(`cd ${name} && ${pkg} install`, {
		stdio: 'inherit'
	});
	console.log();
	console.log('Initialized a git repository.');
	console.log();
	execSync(`cd ${name} && git init`);
	// 修改pkg name
	const targetPkgPath = path.resolve(targetDir, 'package.json');
	const targetPkg = require(targetPkgPath);
	targetPkg.name = name;
	Reflect.deleteProperty(targetPkg, 'private');
	await fs.writeJSON(targetPkgPath, targetPkg, { spaces: 2 });
	console.log(`Success! Created ${name} at ${targetDir}`);
	console.log('Inside that directory, you can run several commands:');
	console.log();
	console.log(chalk.cyan(`  ${pkg}${pkg === 'npm' ? ' run' : ''} start`));
	console.log(`    Starts the development server to test api in browser.`);
	console.log();
	console.log(chalk.cyan(`  ${pkg}${pkg === 'npm' ? ' run' : ''} build`));
	console.log(`    Bundles the api library into static files for production.`);
	console.log();
	console.log(chalk.cyan(`  ${pkg}${pkg === 'npm' ? ' run' : ''} publish-api`));
	console.log(`    publish library.`);
	console.log();
	console.log(chalk.cyan(`  ${pkg}${pkg === 'npm' ? ' run' : ''} build&publish`));
	console.log(`    Bundles the api library and publish it.`);
	console.log();
	console.log(chalk.cyan(`  ${pkg}${pkg === 'npm' ? ' run' : ''} test`));
	console.log(`    Running All Test Specs.`);
	console.log();
	console.log(chalk.cyan(`  ${pkg}${pkg === 'npm' ? ' run' : ''} test-single`));
	console.log(`    Running The Custom Test Spec.`);
	console.log();
	console.log('We suggest that you begin by typing:');
	console.log();
	console.log(`  ${chalk.cyan('cd')} ${name}`);
	console.log(chalk.cyan(`  ${pkg} start`));
	console.log();
	console.log('Happy coding!');
}

module.exports = generator;
