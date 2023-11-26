import chalk from 'chalk';

import type {
	PackageProps,
	LogOptions,
	LogProps,
	LogType,
} from '@elucidario/pkg-types';

export class Console {
	schema: PackageProps;

	constructor(schema: PackageProps) {
		this.schema = schema;
	}

	log(
		message: string | any,
		options: LogOptions<LogType> = {type: 'info', defaultLog: false},
	) {
		let color = chalk.cyan;
		let bg = chalk.bgCyanBright;
		const {type, defaultLog, title} = options;
		if (type) {
			switch (type) {
				case 'error':
					color = chalk.red;
					bg = chalk.bgRedBright;
					break;
				case 'warning':
					color = chalk.yellow;
					bg = chalk.bgYellowBright;
					break;
				case 'info':
					color = chalk.cyan;
					bg = chalk.bgCyanBright;
					break;
				case 'success':
					color = chalk.green;
					bg = chalk.bgGreenBright;
					break;
			}
		}

		if (defaultLog) {
			console.log(bg(chalk.black(chalk.bold(` ${this.schema.name} `))));
			if (title) console.log(color(`--- ${title} ---`));
			console.log(message);
			console.log(color(`---`));
			return;
		}

		console.log(
			bg(chalk.black(chalk.bold(` ${this.schema.name} `))),
			color(message),
		);
	}

	info = ({message, defaultLog, title}: LogProps<'info'>) => {
		this.log(message, {type: 'info', defaultLog, title});
	};

	success = ({message, defaultLog, title}: LogProps<'success'>) => {
		this.log(message, {type: 'success', defaultLog, title});
	};

	warning = ({message, defaultLog, title}: LogProps<'warning'>) => {
		this.log(message, {type: 'warning', defaultLog, title});
	};

	error = ({message, defaultLog, title}: LogProps<'error'>) => {
		this.log(message, {type: 'error', defaultLog, title});
	};
}
