import React from 'react';
import {Text, render} from 'ink';

type LogProps = {
	message: string;
	type: string;
	prefix?: string;
};
import {PackageProps, Package} from './package-json.js';

export class Console {
	schema: PackageProps;

	constructor(schema: PackageProps) {
		this.schema = schema;
	}

	banner = () => {
		return render(<Package {...this.schema} />);
	};

	info = (message: string) => {
		return render(
			<Log message={message} prefix={this.schema.name} type="info" />,
		);
	};

	success = (message: string) => {
		return render(
			<Log message={message} prefix={this.schema.name} type="success" />,
		);
	};

	warning = (message: string) => {
		return render(
			<Log message={message} prefix={this.schema.name} type="warning" />,
		);
	};

	error = (message: string) => {
		return render(
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
		</Text>
	);
};
