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
import { isUUID } from '../../value-objects';
import { makeCreateOnePlaybook } from './create-one-playbook';
import { makeDeleteOnePlaybook } from './delete-one-playbook';
import { makeGetOnePlaybook } from './get-one-playbook';

describe('deleteOnePlaybook()', () => {
	const deleteOnePlaybook = makeDeleteOnePlaybook({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});
	const createOnePlaybook = makeCreateOnePlaybook({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});
	const getOnePlaybook = makeGetOnePlaybook({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });

	it(
		'Should delete an playbook',
		integrationTest(async () => {
			const data: CreatablePlaybook = {
				name: 'Playbook test',
				body: 'This is my playbook',
			};

			const playbookUUID = await createOnePlaybook(data);
			expect(isUUID(playbookUUID)).toBeTrue();
			const playbook = await getOnePlaybook(playbookUUID);
			expect(isPlaybook(playbook)).toBeTrue();

			await expectAsync(deleteOnePlaybook(playbookUUID)).toBeResolved();
			await expectAsync(getOnePlaybook(playbookUUID)).toBeRejected();
		}),
	);
});
