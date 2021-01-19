/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isArray, isUndefined } from 'lodash';
import { isExploreResult } from '../../entries/explore';
import { isRawSearchEntry, RawSearchEntry } from '../../entries/search-entry';
import { RawSearchMessageReceivedRequestEntriesWithinRangeBaseData } from './base';

export interface RawSearchMessageReceivedRequestEntriesWithinRangeTextRenderer
	extends RawSearchMessageReceivedRequestEntriesWithinRangeBaseData {
	Entries?: Array<RawSearchEntry>;
}

export const isRawSearchMessageReceivedRequestEntriesWithinRangeTextRenderer = (
	v: RawSearchMessageReceivedRequestEntriesWithinRangeBaseData,
): v is RawSearchMessageReceivedRequestEntriesWithinRangeTextRenderer => {
	try {
		const t = v as RawSearchMessageReceivedRequestEntriesWithinRangeTextRenderer;
		const entriesOK = isUndefined(t.Entries) || (isArray(t.Entries) && t.Entries.every(isRawSearchEntry));
		const exploreOK = isUndefined(t.Entries) || (isArray(t.Explore) && t.Explore.every(isExploreResult));
		return entriesOK && exploreOK;
	} catch {
		return false;
	}
};
