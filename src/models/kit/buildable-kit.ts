/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { ID } from '~/value-objects';
import { Version } from '../version';
import { ConfigMacro } from './config-macro';

export interface BuildableKit {
	customID: ID;
	name: string;
	description: string;
	version: number;
	minVersion: Version | null;
	maxVersion: Version | null;
	readme: string;
	actionableIDs: Array<ID>;
	autoExtractorIDs: Array<ID>;
	dashboardIDs: Array<ID>;
	fileIDs: Array<ID>;
	macroIDs: Array<ID>;
	playbookIDs: Array<ID>;
	resourceIDs: Array<ID>;
	savedQueryIDs: Array<ID>;
	scheduledQueryIDs: Array<ID>;
	scheduledScriptIDs: Array<ID>;
	templateIDs: Array<ID>;
	banner?: string;
	cover?: string;
	icon?: string;
	licenses: Array<{ name: string; content: string }>;
	configMacros: Array<ConfigMacro>;
}
