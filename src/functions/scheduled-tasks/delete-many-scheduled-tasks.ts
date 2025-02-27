/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { APIContext } from '../utils';
import { makeDeleteScheduledTasksByUser } from './delete-scheduled-tasks-by-user';
import { ScheduledTasksFilter } from './get-many-scheduled-tasks';

export const makeDeleteManyScheduledTasks = (context: APIContext) => {
	const deleteScheduledTasksByUser = makeDeleteScheduledTasksByUser(context);

	return async (filter: Required<ScheduledTasksFilter>): Promise<void> => {
		return deleteScheduledTasksByUser(filter.userID);
	};
};
