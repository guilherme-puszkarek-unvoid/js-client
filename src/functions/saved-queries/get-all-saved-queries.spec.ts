/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableSavedQuery, isSavedQuery } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateOneSavedQuery } from './create-one-saved-query';
import { makeDeleteOneSavedQuery } from './delete-one-saved-query';
import { makeGetAllSavedQueries } from './get-all-saved-queries';

describe('getAllSavedQueries()', () => {
	const createOneSavedQuery = makeCreateOneSavedQuery(TEST_BASE_API_CONTEXT);
	const deleteOneSavedQuery = makeDeleteOneSavedQuery(TEST_BASE_API_CONTEXT);
	const getAllSavedQueries = makeGetAllSavedQueries(TEST_BASE_API_CONTEXT);

	beforeEach(async () => {
		// Delete all saved queries
		const currentSavedQueries = await getAllSavedQueries();
		const currentSavedQueryIDs = currentSavedQueries.map(m => m.id);
		const deletePromises = currentSavedQueryIDs.map(savedQueryID => deleteOneSavedQuery(savedQueryID));
		await Promise.all(deletePromises);
	});

	it(
		'Should return all saved queries',
		integrationTest(async () => {
			// Create two saved queries
			const creatableSavedQueries: Array<CreatableSavedQuery> = [
				{
					name: 'Q1',
					query: 'tag=netflow',
				},
				{
					name: 'Q2',
					query: 'tag=custom-test',
				},
			];
			const createPromises = creatableSavedQueries.map(creatable => createOneSavedQuery(creatable));
			await Promise.all(createPromises);

			const savedQueries = await getAllSavedQueries();
			expect(savedQueries.length).toBe(2);
			expect(savedQueries.every(isSavedQuery)).toBeTrue();
		}),
	);

	it(
		'Should return an empty array if there are no saved queries',
		integrationTest(async () => {
			const savedQueries = await getAllSavedQueries();
			expect(savedQueries.length).toBe(0);
		}),
	);
});
