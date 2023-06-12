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

import { Text } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { MenuItem } from './MenuSlice';
import { RecentlyAddedView } from './DetailViews/RecentlyAddedView';
import { PlaylistsView } from './DetailViews/PlaylistsView';
import { ArtistsContainerView } from './DetailViews/Artists/ArtistsContainerView';
import { RecentlyPlayedView } from './DetailViews/RecentlyPlayedView';


export function DetailDispatcher() {
    var selectedItem = useSelector((state: any) => state['menu']['value']);

    if (selectedItem === MenuItem.RecentlyAdded) {
        return (
            <RecentlyAddedView />
        );
    } else if (selectedItem === MenuItem.Playlists) {
        return (
            <PlaylistsView />
        );
    } else if (selectedItem === MenuItem.Artists) {
        return (
            <ArtistsContainerView />
        );
    } else if (selectedItem === MenuItem.Albums) {
        return (
            <Text color='white' fontSize='3xl' as='b'>Albums</Text>
        );
    } else if (selectedItem === MenuItem.Songs) {
        return (
            <Text color='white' fontSize='3xl' as='b'>Songs</Text>
        );
    } else if (selectedItem === MenuItem.ForYou) {
        return (
            <Text color='white' fontSize='3xl' as='b'>For You</Text>
        );
    } else if (selectedItem === MenuItem.Compilations) {
        return (
            <Text color='white' fontSize='3xl' as='b'>Compilations</Text>
        );
    } else {
        return (
            <RecentlyPlayedView />
        );
    }
}
