/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID } from '~/value-objects';

export interface Search {
	userID: NumericID;
	groupID?: NumericID;
	userQuery: string;
	effectiveQuery: string;
	launchDate: Date;
}
