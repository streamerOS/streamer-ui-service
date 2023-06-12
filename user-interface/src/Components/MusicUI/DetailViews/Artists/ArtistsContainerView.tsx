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
import { Box, Flex, Text } from '@chakra-ui/react';
import { ArtistsList } from './ArtistsList';
import { Dimensions } from '../../../Dimensions';
import { Artist, MusicItem } from '../../../../MusicKitTS/MusicItem';
import { MusicKitTS } from '../../../../MusicKitTS/MusicKitTS';
import { MusicItemCollectionView } from '../MusicItemCollectionView';

type ArtistsContainerViewState = {
    selectedArtist: Artist | null;
    selectedArtistItems: (MusicItem)[]
}


export class ArtistsContainerView extends React.Component {
    state: ArtistsContainerViewState = {
        selectedArtist: null,
        selectedArtistItems: []
    }

    readAlbumArtists = async (artist: Artist) => {
        // read the artist albums
        var readNext = true;
        var offset = 0;
        var items: MusicItem[] = []
        const limit: number = 20;

        while (readNext) {
            try {
                const readItems: MusicItem[] = await MusicKitTS.instance.library.readArtistAlbums(artist, offset, limit);
                const readItemsCount: number = readItems.length;

                if (readItemsCount > 0) {
                    items = items.concat(readItems);
                    offset += items.length;
                    readNext = !(readItemsCount < limit);
                } else {
                    readNext = false;
                }
            } catch (err) {
                // TODO Error handling
                console.log(err);
                return items;
            }
        }

        return items;
    };

    artistSelected = (artist: Artist) => {
        if (this.state.selectedArtist?.id !== artist.id) {
            this.readAlbumArtists(artist)
                .then((artists) => {
                    this.setState({ selectedArtist: artist, selectedArtistItems: artists });
                })
                .catch((err) => console.log(err))
        }
    }

    render(): React.ReactNode {
        return (
            <Flex>
                <Box w={`${Dimensions.artistsListWidth}px`}>
                    <ArtistsList artistSelected={this.artistSelected} />
                </Box>
                <Box flex='1'>
                    <MusicItemCollectionView
                        items={this.state.selectedArtistItems}
                        maxHeight={Dimensions.height - Dimensions.playbackControlHeight - 5}
                        width={Dimensions.width - Dimensions.sideBarWidth - Dimensions.artistsListWidth - 5} />
                </Box>
            </Flex>
        );
    }
}