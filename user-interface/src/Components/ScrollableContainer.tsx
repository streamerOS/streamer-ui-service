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

import React, { RefObject } from 'react';
import { Box, HStack, IconButton, VStack } from '@chakra-ui/react';
import { BsCaretDownFill } from '@react-icons/all-files/bs/BsCaretDownFill';
import { BsCaretUpFill } from '@react-icons/all-files/bs/BsCaretUpFill';
import { GrLinkBottom } from '@react-icons/all-files/gr/GrLinkBottom';
import { GrLinkTop } from '@react-icons/all-files/gr/GrLinkTop';
//GrLinkBottom


interface ScrollableContainerProps {
    maxHeight: number;
    children: React.ReactNode;
}

export class ScrollableContainer extends React.Component<ScrollableContainerProps, any> { // ({ maxHeight, children }: ScrollableContainerProps) {

    private scrollBoxRef: RefObject<HTMLDivElement>;
    private scrollAmount: number;

    public constructor(props: ScrollableContainerProps) {
        super(props);
        this.scrollBoxRef = React.createRef<HTMLDivElement>();
        this.scrollAmount = Math.round(props.maxHeight / 2);
    }

    private getMaxScrollPosition = () => {
        if (this.scrollBoxRef.current) {
            const { scrollHeight, clientHeight } = this.scrollBoxRef.current;
            return scrollHeight - clientHeight;
        }
        return 0;
    };

    private setScrollPosition = (position: number) => {
        if (this.scrollBoxRef.current) {
            this.scrollBoxRef.current.scrollTop = position;
        }
    };

    private scrollToTop = () => {
        this.setScrollPosition(0);
    };

    private scrollUp = () => {
        if (this.scrollBoxRef.current) {
            var pos = this.scrollBoxRef.current.scrollTop;

            pos -= this.scrollAmount;

            if (pos < 0) {
                pos = 0;
            }

            this.setScrollPosition(pos);
        }
    };

    private scrollDown = () => {
        if (this.scrollBoxRef.current) {
            var pos = this.scrollBoxRef.current.scrollTop;

            pos += this.scrollAmount;

            this.setScrollPosition(pos);
        }
    };

    private scrollToBottom = () => {
        this.setScrollPosition(this.getMaxScrollPosition());
    };

    render(): React.ReactNode {
        return (
            <HStack>
                {
                    this.getMaxScrollPosition() > this.props.maxHeight
                        ? (<VStack>
                            <IconButton
                                icon={<GrLinkTop />}
                                colorScheme='red'
                                aria-label={'Scroll up'}
                                onClick={() => this.scrollToTop()} />
                            <IconButton
                                icon={<BsCaretUpFill />}
                                colorScheme='red'
                                aria-label={'Scroll up'}
                                onClick={() => this.scrollUp()} />
                            <IconButton
                                icon={<BsCaretDownFill />}
                                colorScheme='red'
                                aria-label={'Scroll down'}
                                onClick={() => this.scrollDown()} />
                            <IconButton
                                icon={<GrLinkBottom />}
                                colorScheme='red'
                                aria-label={'Scroll up'}
                                onClick={() => this.scrollToBottom()} />
                        </VStack>)
                        : (<></>)
                }
                <Box
                    ref={this.scrollBoxRef}
                    overflowY='auto'
                    overflowX='auto'
                    maxHeight={this.props.maxHeight - 4}
                >
                    {this.props.children}
                </Box >
            </HStack>
        );
    }
}
