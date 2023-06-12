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

import { Artist, MusicItem, convert, toArtist, toSong } from "./MusicItem";

export class MTSLibrary {

    private _request: (path: string, absolute: boolean) => Promise<any>;

    public constructor(request: (path: string, absolute: boolean) => Promise<any>) {
        this._request = request;
    }

    public async playlists(offset: number = 0, limit: number = 25) {
        const items = await this
            ._request(`playlists?limit=${limit}&offset=${offset}`, false);
        return items.map((item: any) => convert(item));
    }

    public async artists(offset: number = 0, limit: number = 100) {
        const items = await this
            ._request(`artists?limit=${limit}&offset=${offset}`, false);
        const artists = items.map((artist: any) => toArtist(artist));

        return artists;
    }

    public async readArtistAlbums(artist: Artist, offset: number = 0, limit: number = 25) {
        const uri = `${artist.href}/albums?limit=${limit}&offset=${offset}`;
        const items = await this._request(uri, true)
        const albums = items.map((album: MusicItem) => convert(album));

        return albums;
    }

    public async readTracks(collection: MusicItem) {
        // TODO: error handling & logic
        let details = await this._request(`${collection.href}/tracks`, true);

        return details.map(toSong);
    }
}