/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { LocalKit, RawLocalKit, toLocalKit } from '~/models';
import { NumericID } from '~/value-objects';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, parseJSONResponse } from '../utils';

export const makeGetOneLocalKit = (context: APIContext) => {
	return async (kitID: NumericID): Promise<LocalKit> => {
		const templatePath = '/api/kits/{kitID}';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { kitID } });

		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = await parseJSONResponse<RawLocalKit>(raw);
		return toLocalKit(rawRes);
	};
};
