/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableSavedQuery, isSavedQuery, SavedQuery } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeCreateOneSavedQuery } from './create-one-saved-query';
import { makeDeleteOneSavedQuery } from './delete-one-saved-query';
import { makeGetAllSavedQueries } from './get-all-saved-queries';
import { makeGetOneSavedQuery } from './get-one-saved-query';

describe('getOneSavedQuery()', () => {
	const getOneSavedQuery = makeGetOneSavedQuery({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const createOneSavedQuery = makeCreateOneSavedQuery({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});
	const getAllSavedQueries = makeGetAllSavedQueries({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});
	const deleteOneSavedQuery = makeDeleteOneSavedQuery({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});

	let createdSavedQuery: SavedQuery;

	beforeEach(async () => {
		// Delete all saved queries
		const currentSavedQueries = await getAllSavedQueries();
		const currentSavedQueryIDs = currentSavedQueries.map(m => m.id);
		const deletePromises = currentSavedQueryIDs.map(savedQueryID => deleteOneSavedQuery(savedQueryID));
		await Promise.all(deletePromises);

		// Create a saved query
		const data: CreatableSavedQuery = {
			name: 'Q1',
			query: 'tag=netflow',
		};
		createdSavedQuery = await createOneSavedQuery(data);
	});

	it(
		'Returns a saved query',
		integrationTest(async () => {
			const savedQuery = await getOneSavedQuery(createdSavedQuery.id);
			expect(isSavedQuery(savedQuery)).toBeTrue();
			expect(savedQuery).toEqual(createdSavedQuery);
		}),
	);

	it(
		"Returns an error if the saved query doesn't exist",
		integrationTest(async () => {
			await expectAsync(getOneSavedQuery('non-existent')).toBeRejected();
		}),
	);
});
