/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Token } from './token';

/**
 * Token containing the secret (only available when the token is created), in a friendly format.
 */
export interface TokenWithSecret extends Token {
	/**
	 * The created token
	 *
	 * @example
	 * "sdlkjslasdlkfjiowej132452389sdkljsd"
	 */
	token: string;
}
