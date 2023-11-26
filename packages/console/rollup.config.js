import lcdrRollupConfig from '@elucidario/pkg-rollup';

import pkg from './package.json' assert {type: 'json'};

const minified = [
	{
		file: pkg.exports['.'].import,
		format: 'esm',
		sourcemap: true,
	},
	{
		file: pkg.exports['.'].require,
		format: 'cjs',
		sourcemap: true,
	},
];

const unMinified = minified.map(({file, ...rest}) => ({
	...rest,
	file: file.replace('.min.', '.'),
}));

const external = [...Object.keys(pkg.devDependencies)];

export default lcdrRollupConfig({
	external,
	output: [...unMinified, ...minified],
	plugins: {
		typescript: {
			emitDeclarationOnly: false,
			declaration: false,
			declarationDir: null,
		},
	},
});
