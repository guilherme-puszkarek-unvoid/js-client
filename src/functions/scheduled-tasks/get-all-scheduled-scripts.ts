/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { ScheduledScript, ScheduledTask } from '~/models';
import { APIContext } from '../utils';
import { makeGetAllScheduledTasks } from './get-all-scheduled-tasks';

const isScheduledScript = (s: ScheduledTask): s is ScheduledScript => s.type === 'script';

export const makeGetAllScheduledScripts = (context: APIContext) => {
	const getAllScheduledTasks = makeGetAllScheduledTasks(context);

	return async (): Promise<Array<ScheduledScript>> => {
		const scheduledTasks = await getAllScheduledTasks();
		return scheduledTasks.filter(isScheduledScript);
	};
};
