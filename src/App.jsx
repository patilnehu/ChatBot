import { useEffect, useRef, useState } from "react"
import ChatForm from "./components/ChatForm"
import ChatMessage from "./components/ChatMessage"
import { Bot } from 'lucide-react'

function App() {
  const [chatHistory, setChatHistory] = useState([])
  const chatBodyRef = useRef(null)

  const generateBotResponse = async (history) => {
    setChatHistory((prev) => [...prev, { role: "model", text: "Typing..." }]);
    const updateHistory = (text) => {
      setChatHistory((prev) => [...prev.filter((msg) => msg.text !== "Typing..."), { role: "model", text }])
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
          <h1 className="text-lg sm:text-2xl font-bold">ChatBot</h1>
        </div>
      </header>

      {/* Chat Body */}
      <div
        ref={chatBodyRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
      >
        {/* Welcome Message */}
        <ChatMessage
          chat={{ role: "model", text: "Hey!! How can I help you today?" }}
        />

        {/* Chat History */}
        {chatHistory.map((chat, index) => (
          <ChatMessage key={index} chat={chat} />
        ))}
      </div>

      {/* Chat Footer */}
      <footer className="bg-white border-t border-gray-200 p-3 sm:p-4">
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