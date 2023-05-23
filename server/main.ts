/*
    Copyright 2023 Thomas Bonk <thomas@meandmymac.de>

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

import { Command } from 'commander';
import dotenv from 'dotenv';

const program = new Command();
program
    .name('streamer-ui-service')
    .description('Web Service and Web UI that provides the user interface for streamerOS.')
    .version('0.0.0')
    .option('-C, --config <filepath>', 'Path configuration file', '/etc/streamerOS/ui-service.config');
program.parse();

const options = program.opts();

dotenv.config({ path: options.config });

