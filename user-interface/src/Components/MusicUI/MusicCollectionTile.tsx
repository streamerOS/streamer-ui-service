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

import { Image, Text, VStack } from '@chakra-ui/react';

import { MusicItem, artworkUrl } from "MusicKitTS/MusicItem";

interface MusicCollectionTileProps {
    item: MusicItem;
    size: number;
}

export function MusicCollectionTile({ item, size }: MusicCollectionTileProps) {
    return (
        <VStack width={size + 4} justify={'left'} align='left'>
            <Image borderRadius='md' src={artworkUrl(item, size)} width={size} height={size} />
            <Text noOfLines={2} color='white' as='b'>{item.name}</Text>
            {item.kind !== 'playlist'
                ? (<Text noOfLines={2} color='gray.500'>{item.artistName}</Text>)
                : (<div />)}
        </VStack>
    );
}