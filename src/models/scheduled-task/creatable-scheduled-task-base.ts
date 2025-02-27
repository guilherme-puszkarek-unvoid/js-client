/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID } from '~/value-objects';

export interface CreatableScheduledTaskBase {
	groupIDs?: Array<NumericID>;

	name: string;
	description: string;
	labels?: Array<string>;

	oneShot?: boolean;
	isDisabled?: boolean;

	schedule: string;
	timezone?: string | null;
}
