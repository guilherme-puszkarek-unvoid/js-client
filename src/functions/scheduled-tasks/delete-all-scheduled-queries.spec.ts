/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { random } from 'lodash';
import { CreatableUser, User } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeLoginOneUser } from '../auth/login-one-user';
import { makeCreateOneUser } from '../users';
import { makeCreateManyScheduledQueries } from './create-many-scheduled-queries';
import { makeDeleteAllScheduledQueries } from './delete-all-scheduled-queries';
import { makeGetAllScheduledQueries } from './get-all-scheduled-queries';

describe('deleteAllScheduledQueries()', () => {
	const createOneUser = makeCreateOneUser(TEST_BASE_API_CONTEXT);
	const login = makeLoginOneUser(TEST_BASE_API_CONTEXT);

	const getAllScheduledQueries = makeGetAllScheduledQueries(TEST_BASE_API_CONTEXT);
	const deleteAllScheduledQueries = makeDeleteAllScheduledQueries(TEST_BASE_API_CONTEXT);
	const createManyScheduledQueries = makeCreateManyScheduledQueries(TEST_BASE_API_CONTEXT);

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
		'Should delete all scheduled queries',
		integrationTest(async () => {
			const allScheduledQueriesBefore = await getAllScheduledQueries();
			const allScheduledQueryIDsBefore = allScheduledQueriesBefore.map(s => s.id);
			const analystScheduledQueryIDsBefore = allScheduledQueriesBefore.filter(s => s.userID === user.id).map(s => s.id);
			expect(allScheduledQueryIDsBefore.length).toBe(5);
			expect(analystScheduledQueryIDsBefore.length).toBe(3);

			await deleteAllScheduledQueries();

			const allScheduledQueriesAfter = await getAllScheduledQueries();
			const allScheduledQueryIDsAfter = allScheduledQueriesAfter.map(s => s.id);
			const analystScheduledQueryIDsAfter = allScheduledQueriesAfter.filter(s => s.userID === user.id).map(s => s.id);
			expect(allScheduledQueryIDsAfter.length).toBe(0);
			expect(analystScheduledQueryIDsAfter.length).toBe(0);
		}),
	);
});
