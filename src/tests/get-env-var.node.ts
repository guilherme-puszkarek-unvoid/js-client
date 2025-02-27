/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import * as dotenv from 'dotenv';

dotenv.config();

export const getEnvVar = (key: string): string | undefined => {
	return process.env[key];
};
