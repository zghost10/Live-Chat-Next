'use client'
import React, { useState } from 'react';
import * as Ably from 'ably';
import { AblyProvider } from 'ably/react';
import ChatBox from './chatbox';
import Greetings from './greetings';

const Chat = () => {
  const client = new Ably.Realtime.Promise({ authUrl: '/api' })
  const [username, setUsername] = useState("")

  return (
    <AblyProvider client={ client }>
      {
        username === "" ?
        <Greetings context={{setUsername}} /> :
        <ChatBox context={{setUsername, username}}/>
      }
    </AblyProvider>
  )
}

export default Chat