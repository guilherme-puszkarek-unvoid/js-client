/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isArray, isDate, isNull, isString } from 'lodash';
import { isID, isUUID } from '~/value-objects';
import { isTokenCapability } from './is-token-capability';
import { Token } from './token';

export const isToken = (value: unknown): value is Token => {
	try {
		const t = <Token>value;
		return (
			isUUID(t.id) &&
			isID(t.userID) &&
			isString(t.name) &&
			(isString(t.description) || isNull(t.description)) &&
			isDate(t.createdAt) &&
			isArray(t.capabilities) &&
			t.capabilities.every(isTokenCapability) &&
			(isDate(t.expiresAt) || isNull(t.expiresAt))
		);
	} catch {
		return false;
	}
};
