/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { SearchFilter, SearchSubscription } from '~/models/search';
import { ID, RawJSON } from '~/value-objects';

export interface SearchesService {
	readonly background: {
		/**
		 * Sends a specific search to the background.
		 */
		readonly one: (searchID: string) => Promise<void>;
	};

	readonly save: {
		/**
		 * Saves a specific search.
		 */
		readonly one: (searchID: string) => Promise<void>;
	};

	readonly delete: {
		/**
		 * Deletes a specific search.
		 */
		readonly one: (searchID: string) => Promise<void>;
	};

	readonly download: {
		readonly one: (searchID: string, downloadFormat: string) => Promise<string>;
	};

	readonly get: {
		readonly one: (
			searchID: ID,
			options: { filter?: Omit<SearchFilter, 'elementFilters'> },
		) => Promise<SearchSubscription>;
	};

	readonly create: {
		readonly one: (
			query: string,
			options?: {
				filter?: SearchFilter | undefined;
				metadata?: RawJSON | undefined;
				noHistory?: boolean;
			},
		) => Promise<SearchSubscription>;
	};

	readonly stop: {
		readonly one: (searchID: string) => Promise<void>;
	};
}
