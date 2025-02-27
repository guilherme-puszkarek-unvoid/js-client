/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeBackup } from './backup';
import { makeRestore } from './restore';

xdescribe('backup()', () => {
	const backup = makeBackup(TEST_BASE_API_CONTEXT);
	const restore = makeRestore(TEST_BASE_API_CONTEXT);

	it(
		'Backup then restore',
		integrationTest(async () => {
			const f = await backup();
			await restore(f);
		}),
	);
});
