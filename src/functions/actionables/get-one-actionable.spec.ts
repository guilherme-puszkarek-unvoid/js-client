/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableActionable, isActionable } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { UUID } from '../../value-objects';
import { makeCreateOneActionable } from './create-one-actionable';
import { makeDeleteOneActionable } from './delete-one-actionable';
import { makeGetOneActionable } from './get-one-actionable';

describe('getOneActionable()', () => {
	const getOneActionable = makeGetOneActionable({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});
	const createOneActionable = makeCreateOneActionable({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});
	const deleteOneActionable = makeDeleteOneActionable({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});

	let createdActionableUUID: UUID;

	beforeEach(async () => {
		const data: CreatableActionable = {
			name: 'Actionable test',
			actions: [{ name: 'Action test', command: { type: 'query', userQuery: 'tag=netflow' } }],
			triggers: [{ pattern: /abc/g, activatesOn: 'clicks and selection' }],
		};
		createdActionableUUID = await createOneActionable(data);
	});

	afterEach(async () => {
		await deleteOneActionable(createdActionableUUID);
	});

	// gravwell/gravwell#2425
	xit(
		'Should return an actionable',
		integrationTest(async () => {
			const actionable = await getOneActionable(createdActionableUUID);
			expect(isActionable(actionable)).toBeTrue();
		}),
	);
});
