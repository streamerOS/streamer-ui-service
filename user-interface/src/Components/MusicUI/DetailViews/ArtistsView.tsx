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
import { Dimensions } from '../../Dimensions';
import { Resizeable } from '../../Resizeable';
import { ScrollableContainer } from '../../ScrollableContainer';
import { MusicKitTS } from '../../../MusicKitTS/MusicKitTS';
import { Grid, GridItem, Text } from '@chakra-ui/react';
import { Artist } from '../../../MusicKitTS/MusicItem';
import { RoundedBorder } from '../../RoundedBorder';

type ArtistsViewState = {
    artists: (Artist)[];
    selectedArtist: Artist | null;
}

export class ArtistsView extends React.Component {
    state: ArtistsViewState = {
        artists: [],
        selectedArtist: null
    };

    async componentDidMount() {
        var readNext = true;
        var offset = 0;

        while (readNext) {
            const readItems = await MusicKitTS.instance.library.artists(offset);
            const readItemsCount = readItems.length;

            if (readItemsCount > 0) {
                const itms = this.state.artists.concat(readItems);
                offset = itms.length;
                this.setState({ artists: itms });
            } else {
                readNext = false;
            }
        }

        MusicKitTS.instance.readArtistArtwork(this.state.artists[0]);
    }

    render(): React.ReactNode {
        const columns = Math.round((Dimensions.width - Dimensions.sideBarWidth) / 180 - 3);

        return (
            <Resizeable>
                <ScrollableContainer maxHeight={Dimensions.height - Dimensions.playbackControlHeight - 5}>
                    <Grid templateColumns={`repeat(${columns}, 1fr)`} gap={6}>
                        {
                            this.state.artists.map((artist: Artist) => {
                                return (
                                    <GridItem>
                                        <RoundedBorder padding={4} selected={true}>
                                            <Text color='white' fontSize={'xl'} as='b'>{artist.name}</Text>
                                        </RoundedBorder>
                                    </GridItem>
                                );
                            })
                        }
                    </Grid>
                </ScrollableContainer>
            </Resizeable>
        );
    }
}