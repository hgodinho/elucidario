import React from 'react';
import {Text, Box, Newline, render} from 'ink';

import type {PackageProps, PackageContributor} from '@elucidario/pkg-types';

export const renderPackage = (packageJson: PackageProps) => {
	render(<Package {...packageJson} />);
};

export const Author = ({name, email, url}: PackageContributor) => {
	return (
		<Text>
			<Text color="green">{name}</Text>
			{email ? (
				<Text>
					{' '}
					<Text color="cyan">&lt;{email}&gt;</Text>
				</Text>
			) : null}
			{url ? (
				<Text>
					{' '}
					<Text color="cyan">{url}</Text>
				</Text>
			) : null}
			<Newline />
		</Text>
	);
};

export const Package = ({
	name,
	version,
	author,
	contributors,
	license,
	homepage,
	description,
}: PackageProps) => {
	return (
		<Box borderStyle="single" borderColor={'cyan'}>
			<Text color="cyan">
				Package: <Text color="green">{name}</Text> v{version} {license}
				{homepage ? (
					<Text>
						<Newline />
						Homepage: <Text color="green">{homepage}</Text>
					</Text>
				) : null}
				{description ? (
					<Text>
						<Newline />
						Description: <Text color="green">{description}</Text>
					</Text>
				) : null}
				{author ? (
					<Text>
						<Newline />
						Author: <Author {...author} />
					</Text>
				) : null}
				{contributors ? (
					<Text>
						<Newline />
						Contributors:
						{contributors.map((contributor, index) => (
							<Text key={index}>
								<Newline />
								<Author {...contributor} />
							</Text>
						))}
					</Text>
				) : null}
				<Newline />
			</Text>
		</Box>
	);
};
