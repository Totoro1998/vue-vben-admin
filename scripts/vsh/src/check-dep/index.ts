import type { CAC } from 'cac';

import { getPackages } from '@shaolin/node-utils';

import depcheck from 'depcheck';

async function runDepcheck() {
  const { packages } = await getPackages();
  await Promise.all(
    packages.map(async (pkg) => {
      if (
        [
          '@shaolin/backend-mock',
          '@shaolin/commitlint-config',
          '@shaolin/eslint-config',
          '@shaolin/lint-staged-config',
          '@shaolin/node-utils',
          '@shaolin/prettier-config',
          '@shaolin/stylelint-config',
          '@shaolin/tailwind-config',
          '@shaolin/tsconfig',
          '@shaolin/vite-config',
          '@shaolin/vite-config',
          '@shaolin/vsh',
        ].includes(pkg.packageJson.name)
      ) {
        return;
      }

      const unused = await depcheck(pkg.dir, {
        ignoreMatches: [
          'vite',
          'vitest',
          'unbuild',
          '@shaolin/tsconfig',
          '@shaolin/vite-config',
          '@shaolin/tailwind-config',
          '@types/*',
          '@vben-core/design',
        ],
        ignorePatterns: ['dist', 'node_modules', 'public'],
      });

      // 删除file:前缀的依赖提示，该依赖是本地依赖
      Reflect.deleteProperty(unused.missing, 'file:');
      Object.keys(unused.missing).forEach((key) => {
        unused.missing[key] = (unused.missing[key] || []).filter(
          (item: string) => !item.startsWith('/'),
        );
        if (unused.missing[key].length === 0) {
          Reflect.deleteProperty(unused.missing, key);
        }
      });

      if (
        Object.keys(unused.missing).length === 0 &&
        unused.dependencies.length === 0 &&
        unused.devDependencies.length === 0
      ) {
        return;
      }
      console.error(
        '\n',
        pkg.packageJson.name,
        '\n missing:',
        unused.missing,
        '\n dependencies:',
        unused.dependencies,
        '\n devDependencies:',
        unused.devDependencies,
      );
    }),
  );
}

function defineDepcheckCommand(cac: CAC) {
  cac
    .command('check-dep')
    .usage(`Analysis of project circular dependencies.`)
    .action(async () => {
      await runDepcheck();
    });
}

export { defineDepcheckCommand };
