/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { random } from 'lodash';
import { CreatableUser, isValidUser, User } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateOneUser } from './create-one-user';
import { makeDeleteOneUser } from './delete-one-user';
import { makeGetAllUsers } from './get-all-users';
import { makeGetMyUser } from './get-my-user';

describe('createOneUser()', () => {
	const createOneUser = makeCreateOneUser(TEST_BASE_API_CONTEXT);
	const deleteOneUser = makeDeleteOneUser(TEST_BASE_API_CONTEXT);
	const getAllUsers = makeGetAllUsers(TEST_BASE_API_CONTEXT);
	const getMyUser = makeGetMyUser(TEST_BASE_API_CONTEXT);

	let user: User;
	beforeEach(async () => {
		// Delete all users, except the admin
		const currentUsers = await getAllUsers();
		const myUser = await getMyUser();
		const currentUserIDs = currentUsers.map(u => u.id).filter(userID => userID !== myUser.id);
		const deleteUserPromises = currentUserIDs.map(userID => deleteOneUser(userID));
		await Promise.all(deleteUserPromises);

		const username = 'test-user-' + random(0, Number.MAX_SAFE_INTEGER);
		const data: CreatableUser = {
			name: 'Test',
			email: username + '@example.com',
			password: 'changeme',
			role: 'analyst',
			user: username,
		};

		user = await createOneUser(data);
	});

	afterEach(async () => {
		await deleteOneUser(user.id);
	});

	it(
		"Should create a user and return it's id",
		integrationTest(async () => {
			expect(isValidUser(user)).toBeTrue();
		}),
	);

	it(
		'Should have the .searchGroupID property with default value',
		integrationTest(async () => {
			expect(user.searchGroupID).toBeNull();
		}),
	);
});
