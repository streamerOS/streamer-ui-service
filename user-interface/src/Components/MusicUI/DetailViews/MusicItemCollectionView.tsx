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

import { Grid, GridItem } from '@chakra-ui/react';
import React from 'react';

import { MusicCollectionDetailModal } from 'Components/MusicUI/DetailViews/MusicCollectionDetailModal';
import { MusicCollectionTile } from 'Components/MusicUI/MusicCollectionTile';
import { Resizeable } from 'Components/Resizeable';
import { ScrollableContainer } from 'Components/ScrollableContainer';
import { MusicItem } from 'MusicKitTS/MusicItem';

interface MusicItemCollectionViewProps {
    items: (MusicItem)[];
    maxHeight: number;
    width: number;
}

type MusicItemCollectionViewState = {
    selectedItem: MusicItem | null;
    openModal: boolean;
}

export class MusicItemCollectionView extends React.Component<MusicItemCollectionViewProps, any> {

    state: MusicItemCollectionViewState = {
        selectedItem: null,
        openModal: false,
    };

    render(): React.ReactNode {
        const columns = Math.round(this.props.width / 180 - 1);

        // TODO: the maxheight shall be calculated somehow based on the available space
        return (
            <Resizeable>
                <ScrollableContainer maxHeight={this.props.maxHeight}>
                    <Grid templateColumns={`repeat(${columns}, 1fr)`} gap={6}>
                        {
                            this.props.items.map((item) => {
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