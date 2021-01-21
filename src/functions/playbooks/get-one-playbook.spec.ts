/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatablePlaybook, isPlaybook } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { UUID } from '../../value-objects';
import { makeCreateOnePlaybook } from './create-one-playbook';
import { makeDeleteOnePlaybook } from './delete-one-playbook';
import { makeGetOnePlaybook } from './get-one-playbook';

describe('getOnePlaybook()', () => {
	const getOnePlaybook = makeGetOnePlaybook({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const createOnePlaybook = makeCreateOnePlaybook({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});
	const deleteOnePlaybook = makeDeleteOnePlaybook({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});

	let createdPlaybookUUID: UUID;

	beforeEach(async () => {
		const data: CreatablePlaybook = {
			name: 'Playbook test',
			body: 'This is my playbook',
		};
		createdPlaybookUUID = await createOnePlaybook(data);
	});

	afterEach(async () => {
		await deleteOnePlaybook(createdPlaybookUUID);
	});

	it(
		'Should return an playbook',
		integrationTest(async () => {
			const playbook = await getOnePlaybook(createdPlaybookUUID);
			expect(isPlaybook(playbook)).toBeTrue();
		}),
	);
});
