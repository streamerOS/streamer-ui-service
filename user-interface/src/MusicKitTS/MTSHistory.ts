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

import { convert } from "./MusicItem";

export class MTSHistory {

    private _request: (path: string, absolute: boolean) => Promise<any>;

    public constructor(request: (path: string, absolute: boolean) => Promise<string>) {
        this._request = request;
    }

    public async recentlyAdded(offset: number = 0, limit: number = 25) {
        const items = await this
            ._request(`recently-added?limit=${limit}&offset=${offset}&extend=tracks`, false);
        return items.map((item: any) => convert(item));
    }
}
