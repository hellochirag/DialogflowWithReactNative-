/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, View, Text, StatusBar} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {Dialogflow_V2} from 'react-native-dialogflow';
import {dialogflowConfig} from './env';
import {GiftedChat, InputToolbar, Bubble} from 'react-native-gifted-chat';

const BOT_USER = {
  _id: 2,
  name: 'FAQ Bot',
  avatar: 'https://i.imgur.com/7k12EPD.png',
};

class App extends Component {
  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: `Hi! I am the FAQ bot 🤖 from The Black Swan.\n\nHow may I help you with today?`,
          createdAt: new Date(),
          user: BOT_USER,
        },
      ],
    });
  }

  handleGoogleResponse(result) {
    let text = result.queryResult.fulfillmentMessages[0].text.text[0];
    this.sendBotResponse(text);
  }

  sendBotResponse(text) {
    let msg = {
      _id: this.state.messages.length + 1,
      text,
      createdAt: new Date(),
      user: BOT_USER,
    };

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, [msg]),
    }));
  }

  onSend(messages = []) {
    //TODO : Add Validation Message Feature here..
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));

    let message = messages[0].text;
    Dialogflow_V2.requestQuery(
      message,
      result => this.handleGoogleResponse(result),
      error => console.log(error),
    );
  }

  componentDidMount() {
    Dialogflow_V2.setConfiguration(
      dialogflowConfig.client_email,
      dialogflowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogflowConfig.project_id,
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <GiftedChat
          user={{
            _id: 1,
          }}
          onSend={messages => this.onSend(messages)}
          keyboardShouldPersistTaps={'handled'}
          messages={this.state.messages}
          bottomOffset={50}
          showUserAvatar={true}
          showAvatarForEveryMessage={true}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
});

export default App;
