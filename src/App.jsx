import { useEffect, useRef, useState } from "react"
import ChatForm from "./components/ChatForm"
import ChatMessage from "./components/ChatMessage"
import { Bot } from 'lucide-react'

function App() {
  const [chatHistory, setChatHistory] = useState([])
  const chatBodyRef = useRef(null)

  const generateBotResponse = async (history) => {
    const updateHistory = (text) => {
      setChatHistory(prev => [...prev.filter(msg => msg.text !== "Typing..."), { role: "model", text }])
    }

    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }))

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history })
    }

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error.message || "Something went wrong")

      const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim()

      updateHistory(apiResponseText)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" })
    }
  }, [chatHistory])

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Chat Header */}
      <header className="bg-purple-600 text-white py-4 px-6 shadow-md">
        <div className="flex items-center">
          <Bot className="w-8 h-8 mr-3" />
          <h1 className="text-2xl font-bold">ChatBot</h1>
        </div>
      </header>

      {/* Chat Body */}
      <div
        ref={chatBodyRef}
        className="flex-1 overflow-y-auto p-6 space-y-4"
      >
        {/* Welcome Message */}
        <ChatMessage
          chat={{ role: "model", text: "Hey! How can I help you today?" }}
        />

        {/* Chat History */}
        {chatHistory.map((chat, index) => (
          <ChatMessage key={index} chat={chat} />
        ))}
      </div>

      {/* Chat Footer */}
      <footer className="bg-white border-t border-gray-200 p-4">
        <ChatForm
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
          generateBotResponse={generateBotResponse}
        />
      </footer>
    </div>
  )
}

export default App






// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// function Chatbot() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!input.trim()) return;

//     const newMessage = {
//       role: 'user',
//       content: input,
//     };

//     setMessages([...messages, newMessage]);
//     setInput('');

//     try {
//       const response = await axios.post('https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?', {
//         messages: [newMessage],
//       });

//       const assistantMessage = {
//         role: 'assistant',
//         content: response.data.content,
//       };

//       setMessages([...messages, assistantMessage]);
//     } catch (error) {
//       console.error('Error:', error);
//       setMessages([...messages, { role: 'assistant', content: 'Error: Failed to get response' }]);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Gemini Chatbot</h1>
//       <div className="flex flex-col space-y-2">
//         {messages.map((message, index) => (
//           <div key={index} className={`p-4 rounded-lg ${message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
//             <p className="text-sm">{message.content}</p>
//           </div>
//         ))}
//       </div>
//       <form onSubmit={handleSubmit} className="mt-4">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type your message..."
//           className="border border-gray-300 rounded-lg p-2 w-full"
//         />
//         <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg ml-2">
//           Send
//         </button>
//       </form>
//     </div>
//   );
// }

// export default Chatbot;