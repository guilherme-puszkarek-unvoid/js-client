/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isSearch2 } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeGetOnePersistentSearchStatus } from './get-one-persistent-search-status';
import { makeGetPersistentSearchStatusRelatedToMe } from './get-persistent-search-status-related-to-me';
import { makeSaveOneSearch } from './save-one-search';

describe('saveOneSearch()', () => {
	const getPersistentSearchStatusRelatedToMe = makeGetPersistentSearchStatusRelatedToMe(TEST_BASE_API_CONTEXT);
	const saveOneSearch = makeSaveOneSearch(TEST_BASE_API_CONTEXT);
	const getOnePersistentSearchStatus = makeGetOnePersistentSearchStatus(TEST_BASE_API_CONTEXT);

	xit(
		'Should save a search',
		integrationTest(async () => {
			// TODO: Create the search first

			const searches = await getPersistentSearchStatusRelatedToMe();
			expect(searches.length).toBeGreaterThanOrEqual(1);

			expect(searches[0].states).not.toContain('saved');
			const searchID = searches[0].id;

			await saveOneSearch(searchID);
			await new Promise(res => setTimeout(res, 1500));

			const savedSearch = await getOnePersistentSearchStatus(searchID);
			expect(isSearch2(savedSearch)).toBeTrue();
			expect(savedSearch.states).toContain('saved');
		}),
	);
});
