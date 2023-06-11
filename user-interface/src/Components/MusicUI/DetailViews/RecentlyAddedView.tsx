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
import { Playlist, Album } from '../../../MusicKitTS/MusicItem';
import { MusicKitTS } from '../../../MusicKitTS/MusicKitTS';
import { Dimensions } from '../../Dimensions';
import { MusicItemCollectionView } from './MusicItemCollectionView';

type RecentlyAddedViewState = {
  items: (Playlist | Album)[];
  selectedItem: Playlist | Album | null;
  openModal: boolean;
}

export class RecentlyAddedView extends React.Component {

  state: RecentlyAddedViewState = {
    items: [],
    selectedItem: null,
    openModal: false
  };

  async componentDidMount() {
    var readNext = true;
    var offset = 0;

    while (readNext) {
      const readItems = await MusicKitTS.instance.history.recentlyAdded(offset, 20);
      const readItemsCount = readItems.length;


      if (readItemsCount > 0) {
        const itms = this.state.items.concat(readItems/*.filter((i: MusicItem) => i.kind !== 'playlist')*/);
        offset = itms.length;
        this.setState({ items: itms });

        //readNext = (offset <= 75);
      } else {
        readNext = false;
      }
    }
  }

  render(): React.ReactNode {
    return (
      <MusicItemCollectionView
        items={this.state.items}
        maxHeight={Dimensions.height - Dimensions.playbackControlHeight - 5} />
    );
  }
}