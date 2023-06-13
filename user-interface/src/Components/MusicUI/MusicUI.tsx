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

import { ChakraProvider, Grid, GridItem, HStack, IconButton, Spacer, extendTheme } from '@chakra-ui/react';
import * as React from 'react';

import { AiOutlineReload } from '@react-icons/all-files/ai/AiOutlineReload';

import { Dimensions } from 'Components/Dimensions';
import { DetailDispatcher } from 'Components/MusicUI/DetailDispatcher';
import { MenuSideBar } from 'Components/MusicUI/MenuSideBar';
import { PlaybackControl } from 'Components/MusicUI/PlaybackControl';

const theme = extendTheme({
    config: {
        initialColorMode: 'dark', // Set the initial color mode to "light"
        useSystemColorMode: false, // Disable system color mode detection
    },
});


export class MusicUI extends React.Component {

    render(): React.ReactNode {
        return (
            <ChakraProvider theme={theme}>
                <Grid
                    templateAreas={`"header header" "nav main"`}
                    gridTemplateRows={`${Dimensions.playbackControlHeight}px 1fr`}
                    gridTemplateColumns={`${Dimensions.sideBarWidth}px 1fr`}
                    h='100vh'
                    gap='1'
                    color='blackAlpha.900'
                >
                    <GridItem pl='2' area={'header'}>
                        <HStack justifyContent="center" alignItems="center">
                            <IconButton
                                icon={<AiOutlineReload />}
                                aria-label={'reload'}
                                onClick={() => window.location.reload()} />
                            <Spacer />
                            <PlaybackControl />
                            <Spacer />
                        </HStack>
                    </GridItem>
                    <GridItem pl='2' area={'nav'}>
                        <MenuSideBar />
                    </GridItem>
                    <GridItem pl='2' area={'main'}>
                        <DetailDispatcher />
                    </GridItem>
                </Grid>
            </ChakraProvider>
        );
    }
}
