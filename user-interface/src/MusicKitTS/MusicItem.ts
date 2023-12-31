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

export interface Artwork {
    width: number | null | undefined;
    height: number | null | undefined;
    url: string;
}

export interface PlayParams {
    id: string;
    kind: string;
    isLibrary: boolean;
    globalId: string | null | undefined;
}

export interface BaseMusicItem {
    id: string;
    href: string;
}

export interface Playlist extends BaseMusicItem {
    kind: 'playlist';

    name: string;
    artwork: Artwork | null | undefined;
    hasCatalog: boolean,
    dateAdded: string;
    playParams: PlayParams | null | undefined;
}

export interface Album extends BaseMusicItem {
    kind: 'album';

    trackCount: number;
    genreNames: string[];
    releaseDate: string;
    name: string;
    artistName: string;
    artwork: Artwork | null | undefined;
    playParams: PlayParams | null | undefined;
    dateAdded: string;
}

export interface Song extends BaseMusicItem {
    kind: 'song',

    albumName: string;
    name: string;
    artistName: string;
    genreNames: string[];
    discNumber: number;
    trackNumber: number;
    releaseDate: string;
    durationInMillis: number;
    artwork: Artwork | null | undefined;
    playParams: PlayParams | null | undefined;
}

export interface Artist extends BaseMusicItem {
    name: string;
}

export type MusicItem = Playlist | Album | Song;

function toAlbum(item: any): MusicItem {
    return {
        kind: 'album',
        id: item['id'],
        href: item['href'],

        trackCount: item['attributes']['trackCount'],
        genreNames: item['attributes']['genreNames'],
        releaseDate: item['attributes']['releaseDate'],
        name: item['attributes']['name'],
        artistName: item['attributes']['artistName'],
        dateAdded: item['attributes']['dateAdded'],
        artwork: item['attributes']['artwork'],
        playParams: item['attributes']['playParams']
    }
}

function toPlaylist(item: any): MusicItem {
    return {
        kind: 'playlist',
        id: item['id'],
        href: item['href'],

        name: item['attributes']['name'],
        artwork: item['attributes']['artwork'],
        hasCatalog: item['attributes']['hasCatalog'],
        dateAdded: item['attributes']['dateAdded'],
        playParams: item['attributes']['playParams']
    }
}

export function toSong(item: any): MusicItem {
    return {
        kind: 'song',
        id: item['id'],
        href: item['href'],

        albumName: item['attributes']['albumName'],
        name: item['attributes']['name'],
        artistName: item['attributes']['artistName'],
        genreNames: item['attributes']['genreNames'],
        discNumber: item['attributes']['discNumber'],
        trackNumber: item['attributes']['trackNumber'],
        releaseDate: item['attributes']['releaseDate'],
        durationInMillis: item['attributes']['durationInMillis'],
        artwork: item['attributes']['artwork'],
        playParams: item['attributes']['playParams']
    };
}

export function toArtist(artist: any): Artist {
    const { id, href, attributes } = artist;
    const { name } = attributes;

    return {
        id: id,
        href: href,
        name: name
    };
}

export function convert(item: any): MusicItem | undefined {
    if (item['type'] === 'library-albums' || item['type'] === 'albums') {
        return toAlbum(item)
    } else if (item['type'] === 'library-playlists' || item['type'] === 'playlist') {
        return toPlaylist(item)
    } else if (item['type'] === 'library-songs' || item['type'] === 'songs') {
        return toSong(item);
    }

    return undefined;
}

export function artworkUrl(item: Playlist | Album | Song, size: number): string {
    if (!item.artwork) {
        return '/images/music-album-cover.png';
    }

    return item.artwork.url.replace('{w}', `${size}`).replace('{h}', `${size}`)
}

export function formatMillisecondsToMinutesAndSeconds(milliseconds: number): string {
    const date = new Date(milliseconds);
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}