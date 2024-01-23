'use client'
import React, { useEffect, useRef, useState } from 'react';
import { useChannel } from "ably/react";

export default function ChatBox() {
  const inputBox = useRef<HTMLTextAreaElement>(null);
  const messageEnd = useRef<HTMLDivElement>(null);

  const [messageText, setMessageText] = useState("");
  const [receivedMessages, setMessages] = useState<any[]>([]);     
  const messageTextIsEmpty = messageText.trim().length === 0;

  const { channel, ably } = useChannel("chat-demo", (message) => {
    const history = receivedMessages.slice(-199);
    setMessages([...history, message]);
  });

  const sendChatMessage = (messageText: string) => {
    channel.publish({ name: "chat-message", data: messageText });
    setMessageText("");
    inputBox.current?.focus();
  }

  const handleFormSubmission = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendChatMessage(messageText);
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "enter" || messageTextIsEmpty) {
      return;
    }
    sendChatMessage(messageText);
    e.preventDefault();
  }

  const messages = receivedMessages.map((message, index) => {
    const author = message.connectionId === ably.connection.id ? "me" : "other";
    return <span key={index} className="" data-author={author}>{message.data}</span>;
  });

  useEffect(() => {
    messageEnd.current?.scrollIntoView({ behavior: "smooth" });
  });

  return (
    <div className="">
      <div className="">
        {messages}
        <div ref={messageEnd}/>
      </div>
      <form onSubmit={handleFormSubmission} className="">
        <textarea
          ref={inputBox}
          value={messageText}
          placeholder="Type a message..."
          onChange={e => setMessageText(e.target.value)}
          onKeyUp={handleKeyPress}
          className=""
        ></textarea>
        <button type="submit" className="" disabled={messageTextIsEmpty}>Send</button>
      </form>
    </div>
  )
}