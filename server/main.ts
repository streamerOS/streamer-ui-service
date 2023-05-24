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

import * as os from "os";
import * as fs from 'fs';
import * as path from 'path';

import { Command } from 'commander';
import * as dotenv from 'dotenv';

import express from 'express';
import expressWs from 'express-ws';
import * as https from 'https';
import * as jwt from "jsonwebtoken";

const program = new Command();
program
    .name('streamer-ui-service')
    .description('Web Service and Web UI that provides the user interface for streamerOS.')
    .version('0.0.0')
    .option('-C, --config <filepath>', 'Path configuration file', '/etc/streamerOS/ui-service.config');
program.parse();

const options = program.opts();

dotenv.config({ path: options.config });

const hostname = os.hostname();
const port = parseInt(process.env.PORT || '9443');
const certDir = mandatory(process.env.CERT_DIR, 'CERT_DIR')!;
const appleMusicStorefrontId = mandatory(process.env.APPLE_MUSIC_STOREFRONT_ID, 'APPLE_MUSIC_STOREFRONT_ID')!;
const appleMusicPrivateKey = mandatory(process.env.APPLE_MUSIC_PRIVATE_KEY, 'APPLE_MUSIC_PRIVATE_KEY')!;
const appleMusicTeamId = mandatory(process.env.APPLE_MUSIC_TEAM_ID, 'APPLE_MUSIC_TEAM_ID')!;
const appleMusicKeyId = mandatory(process.env.APPLE_MUSIC_KEY_ID, 'APPLE_MUSIC_KEY_ID')!;
const bonjourDisplayName = process.env.BONJOUR_DISPLAY_NAME || hostname;

const app = express();
const server = https.createServer(
    {
        key: fs.readFileSync(path.join(certDir, 'key.pem')),
        cert: fs.readFileSync(path.join(certDir, 'cert.pem')),
    }, app);
const webSocketServer = expressWs(app, server);

app.get('/apple-music-token', (req, res) => {
    const jwtToken = jwt.sign({}, appleMusicPrivateKey, {
        algorithm: "ES256",
        expiresIn: "180d",
        issuer: appleMusicTeamId,
        header: {
            alg: "ES256",
            kid: appleMusicKeyId
        }
    });

    res.send({
        storefrontId: appleMusicStorefrontId,
        token: jwtToken
    })
});

app.use(express.static(path.join(__dirname, '../ui')));

server.listen(port, hostname, () => {
    console.log(`server is runing on ${hostname} at port ${port}`);
});

function mandatory<Type>(value: Type, parameter: String): Type {
    if (!value) {
        console.log(`${parameter}: not configured`);
        process.exit(9);
    }

    return value;
}