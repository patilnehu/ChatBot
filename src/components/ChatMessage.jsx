import { User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatMessage = ({ chat }) => {
  const isUser = chat.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`flex items-start space-x-2 max-w-[70%] ${
          isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'
        }`}
      >
        <div
          className={`p-2 rounded-full ${
            isUser ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          {isUser ? <User size={24} /> : <Bot size={24} />}
        </div>
        <div
          className={`p-3 rounded-lg ${
            isUser
              ? 'bg-purple-600 text-white rounded-tr-none'
              : 'bg-white text-gray-800 rounded-tl-none'
          }`}
        >
          {/* <p className="text-sm">{chat.text}</p> */}

          <ReactMarkdown
            remarkPlugins={[remarkGfm]} // Enable GitHub-flavored Markdown
            components={{
              // Customize Markdown elements (optional)
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-blue-500 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
            }}
          >
            {chat.text}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}

export default ChatMessage

