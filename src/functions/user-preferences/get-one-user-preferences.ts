/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { UserPreferences } from '~/models';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, parseJSONResponse } from '../utils';

export const makeGetOneUserPreferences = (context: APIContext) => async (userID: string): Promise<UserPreferences> => {
	const templatePath = '/api/users/{userID}/preferences';
	const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { userID } });

	const req = buildHTTPRequestWithAuthFromContext(context);

	const raw = await context.fetch(url, { ...req, method: 'GET' });
	return parseJSONResponse(raw);
};
