/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawSearchModule } from './raw-search-module';
import { SearchModule } from './search-module';

export const toSearchModule = (raw: RawSearchModule): SearchModule => ({
	name: raw.Name,
	description: raw.Info,
	examples: raw.Examples,

	frontendOnly: raw.FrontendOnly,
	collapsing: raw.Collapsing,
	sorting: raw.Sorting,
});
