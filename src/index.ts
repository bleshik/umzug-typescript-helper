import keys = require('lodash/keys');
import * as Umzug from 'umzug';
import { UmzugOptions } from 'umzug';
const fs = require('fs');

export function migrate(migrations: object, umzugOptions: UmzugOptions) {
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
                    pattern: /\.js$/
                }
            }
        )
    ).up();
}

function migrationScript(migration: string): string {
    return "module.exports = {" +
        "up: function() {" +
        "return require(require('path').relative('" +
            process.argv[1] +
        "', './')).runMigration('" + migration + "')" +
            ".catch((err) => console.error(err));" +
        "}" +
    "}";
}
