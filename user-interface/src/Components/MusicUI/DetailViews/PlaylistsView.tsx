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

import * as React from 'react';
import { MusicItem, Playlist } from '../../../MusicKitTS/MusicItem';
import { MusicKitTS } from '../../../MusicKitTS/MusicKitTS';
import { Dimensions } from '../../Dimensions';
import { Resizeable } from '../../Resizeable';
import { ScrollableContainer } from '../../ScrollableContainer';
import { Grid, GridItem } from '@chakra-ui/react';
import { MusicCollectionTile } from '../MusicCollectionTile';
import { MusicCollectionDetailModal } from './MusicCollectionDetailModal';

function delay(milliseconds: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

type PlaylistsViewState = {
    items: (Playlist)[];
    selectedItem: Playlist | null;
    openModal: boolean;
}

export class PlaylistsView extends React.Component {

    state: PlaylistsViewState = {
        items: [],
        selectedItem: null,
        openModal: false
    };

    async componentDidMount() {
        var readNext = true;
        var offset = 0;

        while (readNext) {
            const readItems = await MusicKitTS.instance.library.playlists(offset, 20);
            const readItemsCount = readItems.length;

            if (readItemsCount > 0) {
                const itms = this.state.items.concat(readItems);
                offset += itms.length;
                this.setState({ items: itms });
                await delay(500);
            } else {
                readNext = false;
            }
        }
    }

    render(): React.ReactNode {
        const columns = Math.round((Dimensions.width - Dimensions.sideBarWidth) / 180 - 1);

        console.log(`Columns in RecentlyAddedView: ${columns}`);

        // TODO: the maxheight shall be calculated somehow based on the available space
        return (
            <Resizeable>
                <ScrollableContainer maxHeight={Dimensions.height - Dimensions.playbackControlHeight - 5}>
                    <Grid templateColumns={`repeat(${columns}, 1fr)`} gap={6}>
                        {
                            this.state.items.map((item) => {
                                return (
                                    <GridItem onClick={() => this.setState({ openModal: true, selectedItem: item })}>
                                        <MusicCollectionTile item={item} size={180} />
                                    </GridItem>
                                );
                            })
                        };
                    </Grid>
                </ScrollableContainer >

                {
                    this.state.selectedItem
                        ? <MusicCollectionDetailModal
                            item={this.state.selectedItem}
                            onClose={() => this.setState({ openModal: false, selectedItem: null })}
                            isOpen={this.state.openModal} />
                        : <></>
                }
            </Resizeable>
        );
    }
}
