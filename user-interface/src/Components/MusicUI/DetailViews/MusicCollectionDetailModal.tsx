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

import { useState } from 'react';
import {
    Box,
    Button,
    HStack,
    IconButton,
    Image,
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Tr,
    VStack
} from '@chakra-ui/react';
import { MusicItem, Song, artworkUrl, formatMillisecondsToMinutesAndSeconds } from '../../../MusicKitTS/MusicItem';
import { AiFillPlayCircle } from '@react-icons/all-files/ai/AiFillPlayCircle';
import { BiShuffle } from '@react-icons/all-files/bi/BiShuffle';
import { useEffect } from 'react';
import { MusicKitTS } from '../../../MusicKitTS/MusicKitTS';
import { ScrollableContainer } from '../../ScrollableContainer';

const cellStyle: React.CSSProperties = {
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
};

type OnCloseCallback = () => void;

interface MusicCollectionDetailModalProps {
    onClose: OnCloseCallback;
    isOpen: boolean;
    //item: Playlist | Album | null;
    item: MusicItem | null;
}

export function MusicCollectionDetailModal({ onClose, isOpen, item }: MusicCollectionDetailModalProps) {
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        if (item) {
            MusicKitTS.instance.library.readTracks(item!)
                .then((songs) => {
                    setSongs(songs);
                });
        }
    });

    if (item) {
        return (
            <Modal size='xl' onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalBody>
                        <VStack justify={'center'} >
                            <HStack>
                                <Image src={artworkUrl(item!, 240)} width={240} height={240} />
                                <VStack align={'left'}>
                                    <Text noOfLines={3} color='white' fontSize='lg' as='b'>
                                        {item.name}
                                    </Text>
                                    {item.kind === 'album'
                                        ? (
                                            <Text noOfLines={3} color='gray.500' fontSize='md' as='b'>
                                                {item.artistName}
                                            </Text>
                                        )
                                        : (<div />)}
                                    <HStack >
                                        <Button
                                            width={130}
                                            colorScheme='red'
                                            size='lg'
                                            aria-label={'Play'}
                                            onClick={async () => {
                                                onClose();
                                                await MusicKitTS.instance.play(item.playParams!);
                                            }}
                                        >
                                            <AiFillPlayCircle size={42} />
                                        </Button>
                                        <Button
                                            width={130}
                                            colorScheme='red'
                                            size='lg'
                                            aria-label={'Shuffle'}
                                            onClick={async () => {
                                                onClose();
                                                await MusicKitTS.instance.playShuffled(item.playParams!);
                                            }}
                                        >
                                            <BiShuffle size={42} />
                                        </Button>
                                    </HStack>
                                </VStack>
                            </HStack>

                            <ScrollableContainer maxHeight={400}>
                                <TableContainer width={500}>
                                    <Table size='sm'>
                                        <Tbody>
                                            {songs.map((song: Song) => (
                                                <Tr>
                                                    <Td style={cellStyle}>
                                                        <HStack>
                                                            <IconButton
                                                                icon={<AiFillPlayCircle size={18} />}
                                                                size='md'
                                                                variant='ghost'
                                                                aria-label='Play Song'
                                                                onClick={async () =>
                                                                    await MusicKitTS.instance.play(song.playParams!)} />
                                                            <VStack justify={'left'} align={'left'}>
                                                                <Text>{song.name}</Text>
                                                                <Text fontSize='xs' color='grey'>{song.artistName}</Text>
                                                            </VStack>
                                                        </HStack>
                                                    </Td>
                                                    <Td>
                                                        {formatMillisecondsToMinutesAndSeconds(song.durationInMillis)}
                                                    </Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                            </ScrollableContainer>

                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal >
        );
    } else {
        return (<></>);
    }
}