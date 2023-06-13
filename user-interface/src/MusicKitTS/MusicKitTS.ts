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

import { MTSHistory } from 'MusicKitTS/MTSHistory';
import { MTSLibrary } from 'MusicKitTS/MTSLibrary';
import { PlayParams } from 'MusicKitTS/MusicItem';

declare global {
    interface Window { MusicKit: any; }
}

window.MusicKit = window.MusicKit || {};

export type PlaybackStateDidChangeHandler = (playing: boolean) => void;
export type NowPlayingItemDidChangeHandler = (name: string, artistName: string, duration: number, artworkUrl: string) => void;
export type PlaybackProgressDidChangeHandler = (progress: number) => void;
export type ShuffleModeDidChangeHandler = (shuffling: boolean) => void;
export type RepeatModeDidChangeHandler = (repeating: boolean) => void;

export class MusicKitTS {
    /// The MusicKitTS singleton instance
    private static _instance: MusicKitTS;
    public static get instance(): MusicKitTS {
        return this._instance;
    }

    /// Access historic items
    private _history: MTSHistory
    public get history(): MTSHistory {
        return this._history;
    }

    /// Access library items
    private _library: MTSLibrary
    public get library(): MTSLibrary {
        return this._library;
    }

    /// Volume
    public get volume(): number {
        return this._mk.volume * 100;
    }
    public set volume(vol: number) {
        this._mk.volume = vol / 100;
    }


    /// The MusicKit JS instance
    private _mk: any;

    /// Configure MusicKitTS
    public static async configure(appName: string, storefrontId: string, token: string, debug: boolean = false) {
        return window.MusicKit.configure({
            developerToken: token,
            debug: debug,
            storefrontId: storefrontId,
            app: {
                name: 'Raspberry Music',
            }
        }).then((mkInstance: any) => {
            MusicKitTS._instance = new MusicKitTS(mkInstance);
            return MusicKitTS.instance;
        })
    }

    private constructor(mk: any) {
        this._mk = mk;

        var that = this;
        this._history = new MTSHistory((path, absolute = false) => that.request(path, absolute));
        this._library = new MTSLibrary((path, absolute = false) => that.request(path, absolute));
    }

    public get isAuthorized(): boolean {
        return this._mk.isAuthorized;
    }

    public get queueIsNotEmpty(): boolean {
        return !this.queueIsEmpty;
    }

    public get queueIsEmpty(): boolean {
        return this._mk.queueIsEmpty;
    }

    public async authorize() {
        return this._mk.authorize();
    }

    /// Play, pause, stop

    public play(item: PlayParams, shuffleMode: number = window.MusicKit.PlayerShuffleMode.off) {
        var that = this;
        var queueItem: Record<string, any> = {};

        queueItem[item.kind] = item.id;

        this._mk.bitrate = window.MusicKit.PlaybackBitrate.HIGH;
        this._mk.shuffleMode = shuffleMode;

        return this
            ._mk
            .stop()
            .then(() => that
                ._mk
                .clearQueue()
                .then(() => that
                    ._mk
                    .setQueue(queueItem)
                    .then(() => that._mk.play())));
    }

    public playShuffled(item: PlayParams) {
        return this.play(item, window.MusicKit.PlayerShuffleMode.songs);
    }

    public togglePlayPause() {
        if (this.queueIsNotEmpty) {
            if (this._mk.playbackState === window.MusicKit.PlaybackStates.playing) {
                this._mk.pause();
            } else {
                this._mk.play();
            }
        }
    }

    public toggleRepeatMode() {
        if (this._mk.repeatMode === window.MusicKit.PlayerRepeatMode.all) {
            this._mk.repeatMode = window.MusicKit.PlayerRepeatMode.none;
        } else {
            this._mk.repeatMode = window.MusicKit.PlayerRepeatMode.all;
        }
    }

    public toggleShuffleMode() {
        if (this._mk.shuffleMode === window.MusicKit.PlayerShuffleMode.off) {
            this._mk.shuffleMode = window.MusicKit.PlayerShuffleMode.songs;
        } else {
            this._mk.shuffleMode = window.MusicKit.PlayerShuffleMode.off;
        }
    }

    public seekTo(positionInMillis: number) {
        if (this._mk.seekSeconds) {
            const currentPosInSeconds = this._mk.currentPlaybackTime;
            const positionInSeconds = Math.round(positionInMillis / 1000);

            if (positionInSeconds > currentPosInSeconds) {
                this._mk.seekSeconds.FORWARD = positionInSeconds;
                return this._mk.seekForward();
            } else {
                this._mk.seekSeconds.BACK = positionInSeconds;
                return this._mk.seekBackward();
            }
        }
    }

    public skipToPreviousItem() {
        return this._mk.skipToPreviousItem();
    }

    public skipToNextItem() {
        return this._mk.skipToNextItem();
    }


    /// Event handler registration

    public addPlaybackStateDidChangeHandler(handler: PlaybackStateDidChangeHandler) {
        this._mk.addEventListener('playbackStateDidChange', ({ state }: any) => {
            handler(state === window.MusicKit.PlaybackStates.playing);
        });
    }

    public addNowPlayingItemDidChangeHandler(handler: NowPlayingItemDidChangeHandler) {
        this._mk.addEventListener('nowPlayingItemDidChange', ({ item }: any) => {
            if (item) {
                var { name, artistName, durationInMillis, artwork } = item.attributes;
                var url = '/images/music-album-cover.png';

                if (artwork) {
                    url = item.artwork.url.replace('{w}', `${80}`).replace('{h}', `${80}`)
                }

                handler(name, artistName, durationInMillis, url);
            } else {
                handler("-", "-", 0, '/images/music-album-cover.png');
            }
        });
    }

    public addPlaybackProgressDidChangeHandler(handler: PlaybackProgressDidChangeHandler) {
        this._mk.addEventListener('playbackProgressDidChange', (ev: any) => {
            if (ev) {
                var { progress } = ev;

                handler(progress);
            } else {
                handler(0);
            }
        });
    }

    public addShuffleModeDidChangeHandler(handler: ShuffleModeDidChangeHandler) {
        this._mk.addEventListener('shuffleModeDidChange', (ev: any) => {
            if (ev) {
                handler(ev !== 0);
            } else {
                handler(false);
            }
        });
    }

    public addRepeatModeDidChangeHandler(handler: RepeatModeDidChangeHandler) {
        this._mk.addEventListener('repeatModeDidChange', (ev: any) => {
            if (ev) {
                handler(ev === window.MusicKit.PlayerRepeatMode.all);
            } else {
                handler(false);
            }
        });
    }


    /// Private methods

    private request(uri: string, absolute: boolean = false): Promise<string> {
        const path = absolute ? uri : `v1/me/library/${uri}`;

        return this._mk.api.music(path)
            .then((response: any) => {
                return response['data']['data']
            });
    }
}
