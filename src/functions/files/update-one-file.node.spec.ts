/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { createReadStream, ReadStream } from 'fs';
import { omit } from 'lodash';
import { join } from 'path';
import { CreatableFile, FileMetadata, isFileMetadata, UpdatableFile } from '~/models';
import { integrationTest, myCustomMatchers, TEST_ASSETS_PATH, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateOneFile } from './create-one-file';
import { makeDeleteOneFile } from './delete-one-file';
import { makeGetAllFiles } from './get-all-files';
import { makeGetOneFileContent } from './get-one-file-content';
import { makeUpdateOneFile } from './update-one-file';

describe('updateOneFile()', () => {
	const createOneFile = makeCreateOneFile(TEST_BASE_API_CONTEXT);
	const updateOneFile = makeUpdateOneFile(TEST_BASE_API_CONTEXT);
	const deleteOneFile = makeDeleteOneFile(TEST_BASE_API_CONTEXT);
	const getAllFiles = makeGetAllFiles(TEST_BASE_API_CONTEXT);
	const getOneFileContent = makeGetOneFileContent(TEST_BASE_API_CONTEXT);

	let createdFile: FileMetadata;

	beforeEach(async () => {
		jasmine.addMatchers(myCustomMatchers);

		// Delete all files
		const currentFiles = await getAllFiles();
		const currentFileIDs = currentFiles.map(f => f.globalID);
		const deletePromises = currentFileIDs.map(fileID => deleteOneFile(fileID));
		await Promise.all(deletePromises);

		// Create one file
		const data: CreatableFile = {
			name: 'F1',
			file: createReadStream(join(TEST_ASSETS_PATH!, 'file-a.txt')),
		};
		createdFile = await createOneFile(data);
	});

	const updateTests: Array<Omit<UpdatableFile, 'id'>> = [
		{ name: 'New Name' },

		{ description: 'New description' },
		{ description: null },

		{ groupIDs: ['1'] },
		{ groupIDs: ['1', '2'] },
		{ groupIDs: [] },

		{ labels: ['Label 1'] },
		{ labels: ['Label 1', 'Label 2'] },
		{ labels: [] },

		{ isGlobal: true },
		{ isGlobal: false },

		// TODO: Enable test below
		// { file: createReadStream(join(TEST_ASSETS_PATH!, 'auto-extractors.config')) },
	];
	updateTests.forEach((_data, testIndex) => {
		const updatedFields = Object.keys(_data);
		const formatedUpdatedFields = updatedFields.join(', ');
		const formatedTestIndex = (testIndex + 1).toString().padStart(2, '0');

		it(
			`Test ${formatedTestIndex}: Should update a file ${formatedUpdatedFields} and return itself updated`,
			integrationTest(async () => {
				const current = createdFile;
				expect(isFileMetadata(current)).toBeTrue();

				// !WARNING: Using globalID because gravwell/gravwell#2509
				const data: UpdatableFile = { ..._data, id: current.globalID };
				const updated = await updateOneFile(data);

				if (data.file) {
					const stream = createReadStream(join(TEST_ASSETS_PATH!, 'auto-extractors.config'));
					const expectedContent = await streamToString(stream);
					const actualContent = await getOneFileContent(data.id);
					expect(actualContent).toBe(expectedContent);
				}

				expect(isFileMetadata(updated)).toBeTrue();
				expect(updated).toPartiallyEqual(omit(data, ['file', 'id']));
			}),
			20000,
		);
	});
});

const streamToString = (stream: ReadStream): Promise<string> => {
	const chunks: Array<Buffer> = [];
	return new Promise((resolve, reject) => {
		stream.on('data', (chunk: Buffer) => chunks.push(chunk));
		stream.on('error', reject);
		stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
	});
};
