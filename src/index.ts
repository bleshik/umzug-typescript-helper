import keys = require('lodash/keys');
import * as Umzug from 'umzug';
import { UmzugOptions } from 'umzug';
const fs = require('fs');

export function migrate(migrations: object, umzugOptions: UmzugOptions) {
    if (process.env.MIGRATION) {
        return doRunMigration(migrations, process.env.MIGRATION as string);
    }
    const dir = require('path').dirname(process.argv[1]) + "/migrations";
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    const migrationNames = keys(migrations).sort();
    migrationNames.forEach((name) => {
        const data: Buffer = Buffer.from(migrationScript(name));
        const scriptName = dir + "/" + name + ".js";
        if (!fs.existsSync(scriptName)) {
            fs.writeFileSync(scriptName, data, { flag: 'w' });
        }
    });
    return new Umzug(
        Object.assign(
            {},
            umzugOptions,
            {
                migrations: {
                    path: dir,
                    pattern: /\.js$/,
                    // using eval to make it work with webpack, to enforce lazy loading and avoid bundling
                    customResolver: (path: string) => eval("require('" + path + "')")
                }
            }
        )
    ).up();
}

function migrationScript(migration: string): string {
    const cmd = process.argv[0];
    const args = process.argv.slice(1);
    return "module.exports = {" +
        "up: function() {" +
            "process.env.MIGRATION = '" + migration + "';" +
            "const spawn = process.platform === 'win32' ? require('cross-spawn') : require('child_process').spawn;" +
            "return new Promise((resolve, reject) => {" +
                "spawn('" + cmd.replace(/\\/g,"\\\\").replace(/ /g, '\\ ') + "', [" + args.map((a) => "'" + a.replace(/\\/g,"\\\\") + "'").join(",") + "]," +
                "{ env: process.env, stdio: 'inherit', customFds: [0,1,2] })" +
                ".on('exit', function(code) { if (code !== 0) reject(code); else resolve(code); });" +
            "});" +
        "}" +
    "}";
}

function doRunMigration(migrations: object, migration: string) {
    console.log('Running ' + migration);
    const migrationFn = migrations[migration];
    if (!migrationFn) {
        console.error('Migration ' + migration + ' is not found');
        process.exit(1);
    } else {
        return migrationFn();
    }
}
