import React from 'react';
import {Text, Newline, render} from 'ink';
import chalk from 'chalk';

type LogType = 'error' | 'warning' | 'info' | 'success';

type LogProps = {
	message: string;
	type: string;
	prefix?: string;
};
import {PackageProps, Package} from './package-json.js';

export type LogOptions = {
	type?: LogType;
	title?: string;
	defaultLog?: boolean;
};

export class Console {
	schema: PackageProps;

	constructor(schema: PackageProps) {
		this.schema = schema;
	}

	log(
		message: string | any,
		options: LogOptions = {type: 'info', defaultLog: false},
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

	banner = () => {
		render(<Package {...this.schema} />);
	};

	info = (message: string) => {
		render(<Log message={message} prefix={this.schema.name} type="info" />);
	};

	success = (message: string) => {
		render(
			<Log message={message} prefix={this.schema.name} type="success" />,
		);
	};

	warning = (message: string) => {
		render(
			<Log message={message} prefix={this.schema.name} type="warning" />,
		);
	};

	error = (message: string) => {
		render(
			<Log message={message} prefix={this.schema.name} type="error" />,
		);
	};
}

export const Log = ({message, type, prefix}: LogProps) => {
	let color = 'green';
	switch (type) {
		case 'error':
			color = 'red';
			break;
		case 'warning':
			color = 'yellow';
			break;
		case 'info':
			color = 'cyan';
			break;
		case 'success':
			color = 'green';
			break;
		default:
			color = 'green';
			break;
	}
	return (
		<Text color={color}>
			{prefix && (
				<Text backgroundColor={color} inverse>
					{' '}
					{prefix}{' '}
				</Text>
			)}{' '}
			{message}
			<Newline />
		</Text>
	);
};
