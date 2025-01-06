import { useState } from 'react'
import { Send } from 'lucide-react'

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim()) {
      const newMessage = { role: 'user', text: message }
      setChatHistory((prev) => [...prev, newMessage])
      setMessage('')
      generateBotResponse([...chatHistory, newMessage])
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
      />
      <button
        type="submit"
        className="p-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
      >
        <Send size={20} />
      </button>
    </form>
  )
}

export default ChatForm

