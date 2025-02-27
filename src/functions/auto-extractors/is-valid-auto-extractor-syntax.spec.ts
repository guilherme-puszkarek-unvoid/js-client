/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableAutoExtractor } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeIsValidAutoExtractorSyntax } from './is-valid-auto-extractor-syntax';

describe('isValidAutoExtractorSyntax()', () => {
	const isValidAutoExtractorSyntax = makeIsValidAutoExtractorSyntax(TEST_BASE_API_CONTEXT);

	it(
		'Should validate an auto extractor syntax',
		integrationTest(async () => {
			const data: CreatableAutoExtractor = {
				name: 'name',
				description: 'description',
				labels: ['Label 1', 'Label 2'],

				groupIDs: ['1', '2', '3'],
				isGlobal: false,

				tag: 'netflow',
				module: 'csv',

				parameters: 'a b c',
				arguments: '1 2 3',
			};

			const validation = await isValidAutoExtractorSyntax(data);
			expect(validation).not.toBeUndefined();
		}),
	);
});
