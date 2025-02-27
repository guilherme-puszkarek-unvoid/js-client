/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { omit } from 'lodash';
import { MailServerConfig, RawMailServerConfig } from '../../models/mail-server';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, parseJSONResponse } from '../utils';
import { toMailServerConfig } from './conversion';
import { MAIL_CONFIG_PATH } from './paths';

/**
 * Makes request to get mail server config
 * @param context
 */
export const makeGetConfig = (context: APIContext) => {
	return async (): Promise<Omit<MailServerConfig, 'password'>> => {
		const url = buildURL(MAIL_CONFIG_PATH, { ...context, protocol: 'http' });
		const req = buildHTTPRequestWithAuthFromContext(context);
		const res = await context.fetch(url, { ...req, method: 'GET' });
		const rawObj = await parseJSONResponse<RawMailServerConfig>(res);
		return omit(toMailServerConfig(rawObj), 'password');
	};
};
