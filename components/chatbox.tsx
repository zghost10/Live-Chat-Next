'use client'
import React, { FC, useEffect, useRef, useState } from 'react';
import { useChannel } from "ably/react";
import { Button } from './button';

type Props = {
  context: {
    username: string
    setUsername: (name: string) => void
  }
}

const ChatBox: FC<Props> = ({ context }) => {
  const { setUsername, username } = context
  const inputBox = useRef<HTMLTextAreaElement>(null);
  const messageEnd = useRef<HTMLDivElement>(null);

  const [messageText, setMessageText] = useState("");
  const [receivedMessages, setMessages] = useState<any[]>([]);     
  const messageTextIsEmpty = messageText.trim().length === 0;

  const now = () => {
    const dateTime = new Date()
    return `${dateTime.getHours().toString().padStart(2, "0")}:${dateTime.getMinutes().toString().padStart(2, "0")}`
  }

  const { channel, ably } = useChannel("chat-demo", (message) => {
    const history = receivedMessages.slice(-199);
    setMessages([...history, message]);
  });

  const sendChatMessage = (messageText: string) => {
    channel.publish({ name: "chat-message", data: {
      content: messageText,
      sender: username,
      time: now()
    } });
    setMessageText("");
    inputBox.current?.focus();
  }

  const handleFormSubmission = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendChatMessage(messageText);
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter" || messageTextIsEmpty) {
      return;
    }
    sendChatMessage(messageText);
    e.preventDefault();
  }

  const messages = receivedMessages.map((message, index) => {
    const author = message.connectionId === ably.connection.id ? "me" : "other";

    if(message) return <div key={index} className={`flex ${message.data.sender === username ? "flex-row-reverse" : "flex-row"} items-start gap-2.5`}>
      <img className="w-8 h-8 rounded-full" src="https://media.istockphoto.com/id/1421497562/vector/anonymous-hooded-avatar-hidden-user-incognito-hacker-isolated-vector-illustration.jpg?s=612x612&w=0&k=20&c=NCj5yzP0SbTpta3DvErce-R7Q3mUVQu3Jspj5wpFfMU=" alt="profile-pic"/>
      <div className={`flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 ${message.data.sender === username ? "rounded-s-xl rounded-ee-xl" : "rounded-e-xl rounded-es-xl"} bg-gray-700`}>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-sm font-semibold text-white">{message.data.sender}</span>
          <span className="text-sm font-normal text-gray-400">{message.data.time}</span>
        </div>
        <p className="text-sm font-normal py-2.5 text-white">{message.data.content}</p>
        <span className="text-sm font-normal text-gray-400">Entregue</span>
      </div>
    </div>
  })

  useEffect(() => {
    messageEnd.current?.scrollIntoView({ behavior: "smooth" });
  },[receivedMessages]);

  return (
    <div className="container mx-auto max-w-screen-sm h-full flex items-center">
      <div className="flex flex-col justify-center p-10 rounded-lg bg-zinc-800 gap-4 w-full h-full">
        <div className='flex justify-between'>
          <h2 className='font-bold text-xl'>Chat ao vivo</h2>

          <Button action={() => setUsername("")}>Sair</Button>
        </div>

        <div className="flex flex-col pr-4 overflow-y-auto w-full h-full gap-4">
          {messages}
          <div ref={messageEnd}/>
        </div>

        <form onSubmit={handleFormSubmission} className="flex gap-3">
          <textarea
            ref={inputBox}
            value={messageText}
            placeholder="Digite algo..."
            onChange={e => setMessageText(e.target.value)}
            onKeyUp={handleKeyPress}
            className="block w-full p-4 text-sm border rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
          />

          <div className="flex justify-end">
            <Button disabled={messageTextIsEmpty} submit>
              Enviar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChatBox