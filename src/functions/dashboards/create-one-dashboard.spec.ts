/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableDashboard, isDashboard } from '../../models';
import { integrationTest, myCustomMatchers } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeCreateOneGroup } from '../groups/create-one-group';
import { makeCreateOneDashboard } from './create-one-dashboard';

describe('createOneDashboard()', () => {
	const createOneDashboard = makeCreateOneDashboard({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});
	const createOneGroup = makeCreateOneGroup({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });

	// let groupIDs: Array<NumericID>;

	beforeEach(async () => {
		jasmine.addMatchers(myCustomMatchers);

		// groupIDs =
		await Promise.all(
			Array.from({ length: 3 })
				.map((_, i) => `G${i}`)
				.map(name => createOneGroup({ name })),
		);
	});

	it(
		'Should create a dashboard and return it',
		integrationTest(async () => {
			const data: CreatableDashboard = {
				name: 'name',
				description: 'description',
				labels: ['Label 1', 'Label 2'],
				// TODO: gravwell/gravwell#2453
				groupIDs: [],

				liveUpdate: { enabled: true, interval: 10 },
				gridOptions: { gutter: 32, margin: 2 },
				updateOnZoom: true,

				searches: [{ name: 'Search 1', type: 'query', query: 'tag=netflow' }],
				tiles: [
					{
						title: 'Tile 1',
						renderer: 'overview',
						dimensions: { columns: 4, rows: 4 },
						position: { x: 0, y: 0 },
						searchIndex: 0,
					},
				],
				timeframe: { durationString: 'PT1H', end: null, start: null, timeframe: 'PT1H' },
			};

			const dashboard = await createOneDashboard(data);
			expect(isDashboard(dashboard)).toBeTrue();
			expect(dashboard).toPartiallyEqual(data);
		}),
	);
});
