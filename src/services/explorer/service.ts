/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { DataExplorerEntry, ExplorerSearchSubscription, SearchFilter } from '~/models/search';
import { RawJSON } from '~/value-objects';

export interface ExplorerService {
	readonly explore: {
		readonly one: (tag: string) => Promise<Array<DataExplorerEntry>>;
	};

	readonly searchAndExplore: {
		readonly one: (
			query: string,
			options?: {
				filter?: SearchFilter | undefined;
				metadata?: RawJSON | undefined;
				noHistory?: boolean;
			},
		) => Promise<ExplorerSearchSubscription>;
	};
}
