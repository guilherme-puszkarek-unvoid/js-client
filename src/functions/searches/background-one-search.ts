/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID } from '~/value-objects';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, parseJSONResponse } from '../utils';

export const makeBackgroundOneSearch = (context: APIContext) => {
	return async (searchID: NumericID): Promise<void> => {
		const templatePath = '/api/searchctrl/{searchID}/background';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { searchID } });

		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'PATCH' });
		return parseJSONResponse(raw, { expect: 'void' });
	};
};
