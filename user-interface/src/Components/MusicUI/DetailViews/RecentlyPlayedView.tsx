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

import React from 'react';
import { Album, Playlist } from '../../../MusicKitTS/MusicItem';
import { MusicKitTS } from '../../../MusicKitTS/MusicKitTS';
import { MusicItemCollectionView } from './MusicItemCollectionView';
import { Dimensions } from '../../Dimensions';

type RecentlyPlayedViewState = {
    items: (Playlist | Album)[];
    selectedItem: Playlist | Album | null;
    openModal: boolean;
}

export class RecentlyPlayedView extends React.Component {

    state: RecentlyPlayedViewState = {
        items: [],
        selectedItem: null,
        openModal: false
    };

    async componentDidMount() {
        var readNext = true;
        var offset = 0;
        const limit = 5;

        while (readNext) {
            const readItems = await MusicKitTS.instance.history.recentlyPlayed(offset, limit);
            const readItemsCount = readItems.length;


            if (readItemsCount > 0) {
                const itms = this.state.items.concat(readItems);
                offset = itms.length;
                this.setState({ items: itms });

                readNext = (readItemsCount >= limit);
            } else {
                readNext = false;
            }
        }
    }

    render(): React.ReactNode {
        return (
            <MusicItemCollectionView
                items={this.state.items}
                maxHeight={Dimensions.height - Dimensions.playbackControlHeight - 5}
                width={Dimensions.width - Dimensions.sideBarWidth} />
        );
    }
}