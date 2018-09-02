[![Build Status](https://travis-ci.org/bleshik/umzug-typescript-helper.svg?branch=master)](https://travis-ci.org/bleshik/umzug-typescript-helper)
# umzug-typescript-helper
A micro library helping using TypeScript in your [umzug](https://github.com/sequelize/umzug) migrations.

## Why?
[umzug](https://github.com/sequelize/umzug) may run JS scripts only. Thus, in order to run a TypeScript migration you will have to compile all the migrations before umzug may run this.

This little library makes things a bit easier. All you need is just 1 TypeScript file that acts as an entry point for your migration. Something like this:
```
import * as migrations from './migrations';
import { migrate } from 'umzug-typescript-helper';

const umzugOptions = {
    // your umzug config, see https://github.com/sequelize/umzug for more info
};

migrate(migrations, umzugOptions).catch((err: any) => {
    console.error(err);
    process.exit(1);
});
```

And then your migrations go like this (e.g. in `src/migrations/index.ts`):
```
export function _20180902_initial() {
    return Promise.resolve("The migration ran successfully!");
}
```

Then you just compile (or/and bundle) everything and just run the migrations entrypoint script.
