/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { ScheduledQuery, UpdatableScheduledQuery } from '~/models';
import { APIContext } from '../utils';
import { makeUpdateOneScheduledTask } from './update-one-scheduled-task';

export const makeUpdateOneScheduledQuery = (context: APIContext) => {
	const updateOneScheduleTask = makeUpdateOneScheduledTask(context);

	return (data: UpdatableScheduledQuery): Promise<ScheduledQuery> => {
		return updateOneScheduleTask({ ...data, type: 'query' });
	};
};
