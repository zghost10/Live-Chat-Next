'use client'
import React, { useState, useEffect, useCallback, useRef, FC } from 'react';
import io from 'socket.io-client';

const socket = io(process.env.NODE_ENV === "development" ? 'http://192.168.0.117:8000' : 'http://52.91.236.183:8000');

type Message = {
  content: string
  sender: string
  time: string
}

export const Content: FC = () => {
  const [user, setUser] = useState<any>(null)
  const [name, setName] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<Message|null>(null);

  const sendMessage = () => {
    socket.emit('chat message', newMessage);
    setNewMessage(null);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  const handleUserKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setUser({name})
    }
  }

  const AlwaysScrollToBottom = () => {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => ref.current!.scrollIntoView({ behavior: 'smooth' }));
    return <div ref={ref} />;
  };

  const now = () => {
    const dateTime = new Date()
    return `${dateTime.getHours().toString().padStart(2, "0")}:${dateTime.getMinutes().toString().padStart(2, "0")}`
  }

  useEffect(() => {
    socket.on('chat message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    })

    return () => {
      socket.off("message")
    }
  }, []);

  return (
    <div className="flex flex-col p-10 bg-zinc-800 rounded-lg h-full">
      <h1>Chat em tempo real</h1>

      {
        user ?
        <div className="flex flex-col h-full">
          <div className='flex flex-col overflow-y-auto w-full h-full gap-4'>
            {messages.map((message, index) => message && (
              <div key={index} className={`flex ${message.sender === user.name ? "flex-row-reverse" : "flex-row"} items-start gap-2.5`}>
                <img className="w-8 h-8 rounded-full" src="https://media.istockphoto.com/id/1421497562/vector/anonymous-hooded-avatar-hidden-user-incognito-hacker-isolated-vector-illustration.jpg?s=612x612&w=0&k=20&c=NCj5yzP0SbTpta3DvErce-R7Q3mUVQu3Jspj5wpFfMU=" alt="profile-pic"/>
                <div className={`flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 ${message.sender === user.name ? "rounded-s-xl rounded-ee-xl" : "rounded-e-xl rounded-es-xl"} bg-gray-700`}>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-sm font-semibold text-white">{message.sender}</span>
                    <span className="text-sm font-normal text-gray-400">{message.time}</span>
                  </div>
                  <p className="text-sm font-normal py-2.5 text-white">{message.content}</p>
                  <span className="text-sm font-normal text-gray-400">Entregue</span>
                </div>
              </div>
            ))}
            <AlwaysScrollToBottom/>
          </div>

          <div className='flex flex-col my-4'>
            <label htmlFor="default-search" className="mb-2 text-sm font-medium sr-only text-white">Search</label>
            <div className="relative">
              <input 
                type="text" className="block w-full p-4 text-sm border rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Escreva algo..." required
                value={newMessage?.content ?? ""} onKeyDown={handleKeyDown}
                onChange={(e) => setNewMessage({sender: user.name, content: e.target.value, time: now()})}  
              />
              <button 
                type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                onClick={() => sendMessage()}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
         :
        <div className="flex flex-col justify-center items-center h-full gap-4">
          <input type="text"
            className="block p-4 text-sm border rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Digite seu nome"
            onChange={(e) => {
              e.preventDefault()
              setName(e.target.value)
            }}
            onKeyDown={handleUserKeyDown}
          />

          <button 
            type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
            onClick={() => setUser({name})}
          >
            Definir
          </button>
        </div>
      }
    </div>
  )
};