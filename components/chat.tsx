'use client'
import React from 'react';
import * as Ably from 'ably';
import { AblyProvider } from 'ably/react';
import ChatBox from './chatbox/chatbox';

type Message = {
  content: string
  sender: string
  time: string
}

const Chat = () => {
  const client = new Ably.Realtime.Promise({ authUrl: '/api' })

  return (
    <AblyProvider client={ client }>
      <ChatBox/>
    </AblyProvider>
  )
}

export default Chat