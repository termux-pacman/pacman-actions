// Running a script that sets everything up

const exec = require('@actions/exec');
const core = require('@actions/core');

function returnError(message) {
	core.setFailed(message);
	process.exit(1);
}

async function installPkg(pkgname) {
	let attempts = 0;
	while (true) {
		try {
			await exec.exec("sudo apt update -y");
			await exec.exec("sudo apt install " + pkgname + " -y");
			break;
		} catch (error) {
			if (attempts > 3)
				returnError("Something went wrong :/");
			attempts += 1;
			continue;
		}
	}
}

async function start() {
	// Checking the Ubuntu version
	let myOutput = '';
	await exec.exec("grep", ["^DISTRIB_RELEASE=", "/etc/lsb-release"], {
		listeners: {
			stdout: (data) => {
				myOutput += data.toString();
			}
		}
	});
	if (myOutput.split("=").at(-1).split(".").at(0) != "24") {
		returnError("Old version of ubuntu, must be version 24 of ubuntu");
	}

	// Disabling the man-db setting
	await exec.exec("bash -c \"echo set man-db/auto-update false | sudo debconf-communicate\"");
	await exec.exec("sudo dpkg-reconfigure man-db");

	// Installing libarchive tools and pacman
	await installPkg("libarchive-tools pacman-package-manager");
}

start();
