/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isUndefined } from 'lodash';
import { RawResource, Resource, toRawUpdatableResourceMetadata, toResource, UpdatableResource } from '~/models';
import {
	APIContext,
	buildHTTPRequestWithAuthFromContext,
	buildURL,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';
import { makeGetOneResource } from './get-one-resource';
import { makeSetOneResourceContent } from './set-one-resource-content';

export const makeUpdateOneResource = (context: APIContext) => {
	const getOneResource = makeGetOneResource(context);
	const setOneResourceContent = makeSetOneResourceContent(context);

	return async (data: UpdatableResource): Promise<Resource> => {
		try {
			// TODO: We shouldn't have to query the current object before updating
			const current = await getOneResource(data.id);

			// The resources will be inserted in order and we'll return the last one inserted because that's the most updated one
			const resources: Array<Resource> = [current];
			const insertResource = (resource: Resource): Resource => {
				resources.push(resource);
				return resource;
			};

			const resourcePath = '/api/resources/{resourceID}';
			const url = buildURL(resourcePath, { ...context, protocol: 'http', pathParams: { resourceID: data.id } });

			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawUpdatableResourceMetadata(data, current)),
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const metadataP = context
				.fetch(url, { ...req, method: 'PUT' })
				.then(res => parseJSONResponse<RawResource>(res))
				.then(toResource)
				.then(insertResource);

			const contentP: Promise<void | Resource> = isUndefined(data.body)
				? Promise.resolve()
				: setOneResourceContent(data.id, data.body).then(insertResource);

			await Promise.all([metadataP, contentP]);

			const lastUpdatedResource = resources[resources.length - 1];
			return lastUpdatedResource;
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};
