/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID, UUID } from '~/value-objects';
import { Timeframe } from '../timeframe';

export interface CreatableSavedQuery {
	globalID?: UUID;

	groupIDs?: Array<NumericID>;
	isGlobal?: boolean;

	name: string;
	description?: string | null;
	labels?: Array<string>;

	query: string;
	defaultTimeframe?: Timeframe | null;
}
