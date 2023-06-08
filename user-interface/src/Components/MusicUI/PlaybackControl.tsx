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
import { Box, HStack, IconButton, Image, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text, VStack } from '@chakra-ui/react';

import { AiFillBackward } from '@react-icons/all-files/ai/AiFillBackward';
import { AiFillPauseCircle } from '@react-icons/all-files/ai/AiFillPauseCircle';
import { AiFillPlayCircle } from '@react-icons/all-files/ai/AiFillPlayCircle';
import { AiFillForward } from '@react-icons/all-files/ai/AiFillForward';
import { BiShuffle } from '@react-icons/all-files/bi/BiShuffle';
import { BsVolumeDown } from '@react-icons/all-files/bs/BsVolumeDown';
import { BsVolumeUp } from '@react-icons/all-files/bs/BsVolumeUp';
import { IoMdRepeat } from '@react-icons/all-files/io/IoMdRepeat';
import { MusicKitTS } from '../../MusicKitTS/MusicKitTS';

type PlaybackControlState = {
    artist: string;
    title: string;
    duration: number;
    currentPosition: number;
    artworkUrl: string;
    volume: number;
    playing: boolean;
    shuffling: boolean;
    repeating: boolean;
}


export class PlaybackControl extends React.Component {

    state: PlaybackControlState = {
        artist: '-',
        title: '-',
        duration: 0,
        currentPosition: 0,
        artworkUrl: '/images/music-album-cover.png',
        volume: MusicKitTS.instance.volume,
        playing: false,
        shuffling: false,
        repeating: false
    };

    /// constructor
    public constructor(props: Readonly<{}> | {}) {
        super(props);

        this.setState(this.state);
    }

    /// Handlers

    nowPlayingItemDidChange = (name: string, artistName: string, duration: number, artworkUrl: string) => {
        this.setState({
            artist: artistName,
            title: name,
            duration: duration,
            artworkUrl: artworkUrl
        });
    };

    playbackProgressDidChange = (progress: number) => {
        this.setState({
            currentPosition: Math.round(this.state.duration * progress)
        });
    };

    shuffleModeDidChange = (shuffling: boolean) => {
        this.setState({
            shuffling: shuffling
        });
    };

    repeatModeDidChange = (repeating: boolean) => {
        this.setState({
            repeating: repeating
        });
    };

    playbackStateDidChange = (playing: boolean) => {
        this.setState({
            playing: playing
        });
    };

    componentDidMount(): void {
        // Register event handlers
        MusicKitTS.instance.addNowPlayingItemDidChangeHandler(this.nowPlayingItemDidChange);
        MusicKitTS.instance.addPlaybackProgressDidChangeHandler(this.playbackProgressDidChange);
        MusicKitTS.instance.addShuffleModeDidChangeHandler(this.shuffleModeDidChange);
        MusicKitTS.instance.addRepeatModeDidChangeHandler(this.repeatModeDidChange);
        MusicKitTS.instance.addPlaybackStateDidChangeHandler(this.playbackStateDidChange);
    }

    setVolume = (vol: number) => {
        this.setState({ volume: vol });
        MusicKitTS.instance.volume = vol;
    }

    setPlayPosition = async (position: number) => {
        await MusicKitTS.instance.seekTo(position)
    }

    render(): React.ReactNode {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="80px"
            >
                <HStack justify={'center'} align={'center'} shouldWrapChildren={false}>

                    {/****** Playback Control Buttons */}
                    <IconButton
                        icon={<BiShuffle size={28} />}
                        size='md'
                        variant='ghost'
                        aria-label='Toggle Shuffle'
                        color={this.state.shuffling ? 'white' : 'grey'}
                        onClick={() => MusicKitTS.instance.toggleShuffleMode()} />
                    <IconButton
                        icon={<AiFillBackward size={28} />}
                        size='md'
                        variant='ghost'
                        aria-label='Skip Backward'
                        disabled={MusicKitTS.instance.queueIsEmpty}
                        onClick={() => MusicKitTS.instance.skipToPreviousItem()} />
                    <IconButton
                        icon={
                            this.state.playing
                                ? (<AiFillPauseCircle size={42} />)
                                : (<AiFillPlayCircle size={42} />)
                        }
                        size='md'
                        variant='ghost'
                        aria-label='Toggle Play/Pause'
                        disabled={MusicKitTS.instance.queueIsEmpty}
                        onClick={() => MusicKitTS.instance.togglePlayPause()} />
                    <IconButton
                        icon={<AiFillForward size={28} />}
                        size='md'
                        variant='ghost'
                        disabled={MusicKitTS.instance.queueIsEmpty}
                        aria-label='Skip Forward'
                        onClick={() => MusicKitTS.instance.skipToNextItem()} />
                    <IconButton
                        icon={<IoMdRepeat size={28} />}
                        size='md'
                        variant='ghost'
                        aria-label='Toggle Repeat'
                        color={this.state.repeating ? 'white' : 'grey'}
                        onClick={() => MusicKitTS.instance.toggleRepeatMode()} />

                    {/****** Image, Artist, Title and Playback Position */}

                    <Box bg='lightgrey' borderRadius="md">
                        <HStack justify={'center'} align={'center'} shouldWrapChildren={false}>
                            <Image src={this.state.artworkUrl} width='80px' height='80px' />

                            <VStack justify={'center'} align={'center'} shouldWrapChildren={false}>
                                <Text>{this.state.artist}</Text>
                                <Text>{this.state.title}</Text>
                                <Slider
                                    colorScheme='red'
                                    size='md'
                                    width='300px'
                                    min={0}
                                    max={this.state.duration}
                                    value={this.state.currentPosition}
                                    step={1}
                                    onChangeEnd={this.setPlayPosition}
                                >
                                    <SliderTrack>
                                        <SliderFilledTrack />
                                    </SliderTrack>
                                    <SliderThumb boxSize={4} />
                                </Slider>
                            </VStack>
                        </HStack>
                    </Box>

                    {/****** Volume */}

                    <IconButton
                        icon={<BsVolumeDown size={18} />}
                        size='md'
                        variant='ghost'
                        aria-label='Mute'
                        onClick={(e) => this.setVolume(0)} />
                    <Slider
                        colorScheme='red'
                        size='sm'
                        width='100px'
                        min={0}
                        max={100}
                        value={this.state.volume}
                        step={1}
                        onChange={this.setVolume}
                    >
                        <SliderTrack>
                            <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                    </Slider>
                    <IconButton
                        icon={<BsVolumeUp size={18} />}
                        size='md'
                        variant='ghost'
                        aria-label='Maximum Volume'
                        onClick={(e) => this.setVolume(100)} />
                </HStack >
            </Box >
        );
    }
}
