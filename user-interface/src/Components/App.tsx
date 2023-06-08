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
import {
  ChakraProvider,
  Box,
  Grid,
  Text,
  extendTheme
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { MusicKitTS } from '../MusicKitTS/MusicKitTS';
import { MusicUI } from './MusicUI/MusicUI';

enum ApplicationState {
  None = 1,
  MusicKitInitialized,
  MusicKitLogin,
  MusicKitAuthorized
}

type AppState = {
  appState: ApplicationState;
}

const theme = extendTheme({
  config: {
    initialColorMode: 'dark', // Set the initial color mode to "light"
    useSystemColorMode: false, // Disable system color mode detection
  },
});

export class App extends React.Component {

  state: AppState = {
    appState: ApplicationState.None,
  };

  /// constructor
  public constructor(props: Readonly<{}> | {}) {
    super(props);

    this.setState(this.state);
  }

  componentDidMount(): void {
    if (this.state.appState === ApplicationState.None) {
      fetch('/apple-music-token')
        .then((response) => response.json())
        .then((data) => {
          MusicKitTS.configure("streamerOS", data.storefrontId, data.token, true)
            .then((instance) => {
              if (instance !== null) {
                this.setState({ appState: ApplicationState.MusicKitInitialized });
              }
            });
        });
    }
  }

  componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<{}>, snapshot?: any): void {
    if (this.state.appState.valueOf() >= ApplicationState.MusicKitInitialized.valueOf()) {
      if (MusicKitTS.instance.isAuthorized && this.state.appState !== ApplicationState.MusicKitAuthorized) {
        this.setState({ appState: ApplicationState.MusicKitAuthorized });
      } else if (!MusicKitTS.instance.isAuthorized) {
        this.setState({ appState: ApplicationState.MusicKitLogin });
      }
    }
  }

  initializingView = () => {
    return (
      <ChakraProvider theme={theme}>
        <Box textAlign="center" fontSize="xl">
          <Grid minH="100vh" p={3}>
            <ColorModeSwitcher justifySelf="flex-end" />
            <Text>Initializing...</Text>
          </Grid>
        </Box>
      </ChakraProvider>
    );
  }

  loginView = () => {
    return (
      <ChakraProvider theme={theme}>
        <Box textAlign="center" fontSize="xl">
          <Grid minH="100vh" p={3}>
            <ColorModeSwitcher justifySelf="flex-end" />
            <Text>Login to Apple Music</Text>
          </Grid>
        </Box>
      </ChakraProvider>
    );
  }

  appleMusicUI = () => {
    return (
      <MusicUI />
    );
  }

  render(): React.ReactNode {
    if (this.state.appState === ApplicationState.None) {
      return this.initializingView();
    } else if (this.state.appState === ApplicationState.MusicKitInitialized) {
      return (<Text>Initialized!</Text>);
    } else if (this.state.appState === ApplicationState.MusicKitLogin) {
      return this.loginView();
    } else {
      return this.appleMusicUI();
    }
  }
}
