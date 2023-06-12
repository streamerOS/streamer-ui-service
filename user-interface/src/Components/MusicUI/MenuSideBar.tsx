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

import { useSelector, useDispatch } from 'react-redux';
import { List, ListIcon, ListItem } from '@chakra-ui/react';

import { MenuItem, selectItem } from './MenuSlice';

import { BsMusicNote } from '@react-icons/all-files/bs/BsMusicNote';
import { FaRegClock } from '@react-icons/all-files/fa/FaRegClock';
import { FaUsers } from '@react-icons/all-files/fa/FaUsers';
import { GiMicrophone } from '@react-icons/all-files/gi/GiMicrophone';
import { IoIosAlbums } from '@react-icons/all-files/io/IoIosAlbums';
import { MdRecentActors } from '@react-icons/all-files/md/MdRecentActors';
import { RiPlayListFill } from '@react-icons/all-files/ri/RiPlayListFill';
import { RoundedBorder } from '../RoundedBorder';

export function MenuSideBar() {
    var dispatch = useDispatch();
    var selectedItem = useSelector((state: any) => state['menu']['value']);

    return (
        <List spacing={5}>
            <ListItem
                color='white'
                bg={selectedItem === MenuItem.RecentlyAdded ? 'red.900' : 'transparent'}
                cursor='pointer'
                borderRadius='md'
                p={2}
                onClick={() => dispatch(selectItem(MenuItem.RecentlyAdded))}
            >
                <ListIcon as={FaRegClock} color='red.500' />
                Recently Added
            </ListItem>
            <ListItem
                color='white'
                bg={selectedItem === MenuItem.Playlists ? 'red.900' : 'transparent'}
                cursor='pointer'
                borderRadius='md'
                p={2}
                onClick={() => dispatch(selectItem(MenuItem.Playlists))}
            >
                <ListIcon as={RiPlayListFill} color='red.500' />
                Playlists
            </ListItem>
            <ListItem
                color='white'
                bg={selectedItem === MenuItem.Artists ? 'red.900' : 'transparent'}
                cursor='pointer'
                borderRadius='md'
                p={2}
                onClick={() => dispatch(selectItem(MenuItem.Artists))}
            >
                <ListIcon as={GiMicrophone} color='red.500' />
                Arists
            </ListItem>
            {/*
            <ListItem color='white' onClick={() => dispatch(selectItem(MenuItem.Albums))}>
                <RoundedBorder padding={1} selected={selectedItem === MenuItem.Albums}>
                    <ListIcon as={IoIosAlbums} color='red.500' />
                    Albums
                </RoundedBorder>
            </ListItem>
            <ListItem color='white' onClick={() => dispatch(selectItem(MenuItem.Songs))}>
                <RoundedBorder padding={1} selected={selectedItem === MenuItem.Songs}>
                    <ListIcon as={BsMusicNote} color='red.500' />
                    Songs
                </RoundedBorder>
            </ListItem>
            <ListItem color='white' onClick={() => dispatch(selectItem(MenuItem.Compilations))}>
                <RoundedBorder padding={1} selected={selectedItem === MenuItem.Compilations}>
                    <ListIcon as={FaUsers} color='red.500' />
                    Compilations
                </RoundedBorder>
            </ListItem>
            */}
            <ListItem
                color='white'
                bg={selectedItem === MenuItem.RecentlyPlayed ? 'red.900' : 'transparent'}
                cursor='pointer'
                borderRadius='md'
                p={2}
                onClick={() => dispatch(selectItem(MenuItem.RecentlyPlayed))}
            >
                <ListIcon as={MdRecentActors} color='red.500' />
                Recently Played
            </ListItem>
        </List>
    );
}
