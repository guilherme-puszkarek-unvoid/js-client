/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isArray, isUndefined } from 'lodash';
import { isDictOfNumber } from '~/functions/utils/type-guards';
import { isRawDataExplorerEntry } from '../../raw-data-explorer-entry';
import { isRawSearchEntry, RawSearchEntry } from '../../raw-search-entry';
import { RawSearchMessageReceivedRequestEntriesWithinRangeBaseData } from './base';

export interface RawSearchMessageReceivedRequestEntriesWithinRangeRawRenderer
	extends RawSearchMessageReceivedRequestEntriesWithinRangeBaseData {
	/** Maps tag names to numeric IDs*/
	Tags: { [tagname: string]: number };
	Entries?: Array<RawSearchEntry>;
}

export const isRawSearchMessageReceivedRequestEntriesWithinRangeRawRenderer = (
	v: RawSearchMessageReceivedRequestEntriesWithinRangeBaseData,
): v is RawSearchMessageReceivedRequestEntriesWithinRangeRawRenderer => {
	try {
		const t = v as RawSearchMessageReceivedRequestEntriesWithinRangeRawRenderer;
		const entriesOK = isUndefined(t.Entries) || (isArray(t.Entries) && t.Entries.every(isRawSearchEntry));
		const exploreOK = isUndefined(t.Explore) || (isArray(t.Explore) && t.Explore.every(isRawDataExplorerEntry));
		return entriesOK && exploreOK && isDictOfNumber(t.Tags);
	} catch {
		return false;
	}
};
