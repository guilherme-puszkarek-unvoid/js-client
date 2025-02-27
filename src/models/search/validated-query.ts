/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

export type ValidatedQuery =
	| { query: string; isValid: true; error: null }
	| { query: string; isValid: false; error: QueryError };

export interface QueryError {
	message: string;
	module: number;
}
