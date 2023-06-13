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

import { List, ListItem, Text } from '@chakra-ui/react';
import React from 'react';

import { Dimensions } from 'Components/Dimensions';
import { ScrollableContainer } from 'Components/ScrollableContainer';
import { Artist } from 'MusicKitTS/MusicItem';
import { MusicKitTS } from 'MusicKitTS/MusicKitTS';

interface ArtistsListProps {
    artistSelected: (artist: Artist) => void;
}

type ArtistsListState = {
    artists: (Artist)[];
    selectedArtist: Artist | null;
}

export class ArtistsList extends React.Component<ArtistsListProps, any> {
    state: ArtistsListState = {
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

                if (this.state.selectedArtist === null) {
                    this.selectArtist(itms[0]);
                }
            } else {
                readNext = false;
            }
        }
    }

    selectArtist = (artist: Artist) => {
        this.setState({ selectedArtist: artist });
        this.props.artistSelected(artist);
    }

    render(): React.ReactNode {
        return (
            <ScrollableContainer maxHeight={Dimensions.height - Dimensions.playbackControlHeight - 5}>
                <List>
                    {
                        this.state.artists.map((artist) => (
                            <ListItem
                                cursor='pointer'
                                borderRadius='md'
                                bg={this.state.selectedArtist?.id === artist.id ? 'red.900' : 'transparent'}
                                p={2}
                                onClick={() => this.selectArtist(artist)}
                            >
                                <Text color='white'>{artist.name}</Text>
                            </ListItem>
                        ))
                    }
                </List>
            </ScrollableContainer>
        );
    }
}