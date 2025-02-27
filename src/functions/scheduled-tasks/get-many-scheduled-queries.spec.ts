/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { random } from 'lodash';
import { CreatableUser, isScheduledQuery, User } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeLoginOneUser } from '../auth/login-one-user';
import { makeCreateOneUser } from '../users';
import { makeCreateManyScheduledQueries } from './create-many-scheduled-queries';
import { makeDeleteAllScheduledQueries } from './delete-all-scheduled-queries';
import { makeGetAllScheduledQueries } from './get-all-scheduled-queries';
import { makeGetManyScheduledQueries } from './get-many-scheduled-queries';

describe('getManyScheduledQueries()', () => {
	const createOneUser = makeCreateOneUser(TEST_BASE_API_CONTEXT);
	const login = makeLoginOneUser(TEST_BASE_API_CONTEXT);
	const getAllScheduledQueries = makeGetAllScheduledQueries(TEST_BASE_API_CONTEXT);
	const deleteAllScheduledQueries = makeDeleteAllScheduledQueries(TEST_BASE_API_CONTEXT);
	const createManyScheduledQueries = makeCreateManyScheduledQueries(TEST_BASE_API_CONTEXT);
	const getManyScheduledQueries = makeGetManyScheduledQueries(TEST_BASE_API_CONTEXT);

	let user: User;
	let userAuth: string;

	beforeEach(async () => {
		await deleteAllScheduledQueries();

		// Create two scheduled queries as admin
		await createManyScheduledQueries([
			{
				name: 'Q1',
				description: 'D1',
				schedule: '0 1 * * *',
				query: 'tag=netflow',
				searchSince: { secondsAgo: 60 * 60 },
			},
			{
				name: 'Q2',
				description: 'D2',
				schedule: '0 1 * * *',
				query: 'tag=default',
				searchSince: { lastRun: true, secondsAgo: 90 },
			},
		]);

		// Creates an analyst
		const userSeed = random(0, Number.MAX_SAFE_INTEGER).toString();
		const data: CreatableUser = {
			name: 'Test',
			email: userSeed + '@example.com',
			password: 'changeme',
			role: 'analyst',
			user: userSeed,
		};
		user = await createOneUser(data);
		userAuth = await login(user.username, data.password);

		// Create three scheduled queries as analyst
		const createManyScheduledQueriesAsAnalyst = makeCreateManyScheduledQueries({
			...TEST_BASE_API_CONTEXT,
			authToken: userAuth,
		});

		await createManyScheduledQueriesAsAnalyst([
			{
				name: 'Q3',
				description: 'D3',
				schedule: '0 1 * * *',
				query: 'tag=netflow',
				searchSince: { secondsAgo: 60 * 60 },
			},
			{
				name: 'Q4',
				description: 'D4',
				schedule: '0 1 * * *',
				query: 'tag=default',
				searchSince: { lastRun: true, secondsAgo: 90 },
			},
			{
				name: 'Q5',
				description: 'D5',
				schedule: '0 1 * * *',
				query: 'tag=test',
				searchSince: { lastRun: true },
			},
		]);
	});

	xit(
		'Should return all scheduled queries of a user',
		integrationTest(async () => {
			const allScheduledQueries = await getAllScheduledQueries();
			const allScheduledQueryIDs = allScheduledQueries.map(s => s.id);
			const expectedAnalystScheduledQueryIDs = allScheduledQueries.filter(s => s.userID === user.id).map(s => s.id);
			expect(allScheduledQueryIDs.length).toBe(5);
			expect(expectedAnalystScheduledQueryIDs.length).toBe(3);

			const actualAnalystScheduledQueries = await getManyScheduledQueries({ userID: user.id });
			expect(actualAnalystScheduledQueries.length).toBe(expectedAnalystScheduledQueryIDs.length);
			expect(actualAnalystScheduledQueries.every(isScheduledQuery)).toBeTrue();
			expect(actualAnalystScheduledQueries.map(s => s.id).sort()).toEqual(expectedAnalystScheduledQueryIDs.sort());
		}),
	);
});
