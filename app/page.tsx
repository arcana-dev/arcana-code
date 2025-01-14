"use client"

import * as motion from "motion/react-client"
import Image from "next/image"

import "@/app/globals.css"

import { LoaderCircleIcon, Send } from "lucide-react"
import React from "react"

type ChatStatus = "GAMES" | "GENERAL" | "CRYPTO"

const Agent = () => {
  const [isGenerating, setIsGenerating] = React.useState<boolean>(false)
  const [chatStatus, setChatStatus] = React.useState<ChatStatus>("GAMES")
  const [error, setError] = React.useState<string | undefined>(undefined)
  const [userText, setUserText] = React.useState<string>("")
  const [messages, setMessages] = React.useState<{ sender: "user" | "bot"; text: string }[]>([])
  const scrollAreaRef = React.useRef<HTMLDivElement>(null)

  const handleGenerateScript = async (userMessage: string) => {
    setIsGenerating(true)
    try {
      const text = `${userMessage}, ${chatStatus}`
      const responseScript = await fetch("/api/chat", {
        method: "POST",

        body: JSON.stringify({ prompt: text }),
      })

      const dataScript = await responseScript.json()

      if (responseScript.ok && dataScript) {
        const formattedBotText = dataScript

        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        setMessages((prevMessages: any) => [...prevMessages, { sender: "bot", text: formattedBotText }])
        setError(undefined)
      }
    } catch (error) {
      setError("Hey >.<, I'm talking to a lot of people at the moment, just wait a little ok?! <3")
      console.error("Error:", error)
    } finally {
      setTimeout(() => {
        setIsGenerating(false)
      }, 500)
    }
  }

  const handleSend = () => {
    if (userText.trim()) {
      const formattedUserText = userText.trim()

      setMessages(prevMessages => [...prevMessages, { sender: "user", text: formattedUserText }])
      setUserText("")
      handleGenerateScript(userText.trim())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const statusChat = [
    { id: "GAMES", name: "Games" },
    { id: "GENERAL", name: "General" },
    { id: "CRYPTO", name: "Crypto" },
  ]

  return (
    <motion.main
      initial={{
        opacity: 0,
        scale: 0,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        delay: 0.3,
        duration: 0.5,
      }}
      id="agent"
      className="  h-full"
    >
      <div className="container mx-auto h-full flex flex-col items-center justify-start gap-6 pb-8 pt-8">
        <Image src="/arcana-1.png" alt="" width={0} height={0} sizes="100vw" className="w-full max-w-48 lg:max-w-64 " />

        <div className="flex flex-col items-center w-full">
          <span className="text-white text-4xl font-bold font-mono uppercase drop-shadow-md">
            AI Agent <span className="text-sky-500">Arcana</span>
          </span>
          <div className="flex items-center w-full justify-center gap-4 pt-4">
            {statusChat.map(item => (
              <button
                key={item.id}
                disabled={item.id === chatStatus}
                type="button"
                onClick={() => setChatStatus(item.id as ChatStatus)}
                className="flex w-full lg:max-w-xs items-center justify-center hover:scale-95 transition-transform p-0.5 disabled:grayscale  bg-white rounded  box-border relative"
              >
                <div className="w-full bg-sky-500 p-2 text-white">{item.name}</div>
              </button>
            ))}
          </div>
          <div className="flex flex-col items-center w-full h-full">
            <div
              // style={{
              //   WebkitOverflowScrolling: "touch",
              //   overflowY: "scroll",
              // }}
              ref={scrollAreaRef}
              className="w-full max-w-[600px] overflow-y-auto  h-80 max-h-80 py-4 bg-base-content/30 backdrop-blur rounded mt-8 mb-2 p-4 flex flex-col gap-4 "
            >
              {!messages.length && (
                <div className="chat chat-end h-96">
                  <div className="chat-bubble w-full max-w-xs whitespace-pre-wrap backdrop-blur-sm text-white bg-base-content/70 !text-sm !text-left font-mono">
                    <span>Hi, I'm Arcana, what game are we going to talk about today ?</span>
                  </div>
                </div>
              )}
              {messages.length > 0 &&
                messages.map((message, index) => (
                  <div
                    key={index.toString()}
                    className={`chat ${message.sender === "user" ? "chat-start" : "chat-end"} `}
                  >
                    <div className="chat-bubble w-full max-w-xs whitespace-pre-wrap backdrop-blur-sm text-white bg-base-content/70 !text-sm !text-left font-mono">
                      {message.text}
                    </div>
                  </div>
                ))}
              {error?.trim() && (
                <div className={"chat chat-end"}>
                  <div className="chat-bubble w-full max-w-xs whitespace-pre-wrap !text-left !text-sm font-mono">
                    {error}
                  </div>
                </div>
              )}
            </div>
            <div className="w-full max-w-[600px] bg-base-content/30 items-center justify-between  rounded backdrop-blur-sm mb-8 px-4 py-2 flex gap-2 relative">
              <textarea
                disabled={isGenerating}
                value={userText}
                onChange={e => setUserText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="textarea w-full h-20 textarea-bordered overflow-y-hidden resize-none  disabled:border-none bg-base-content placeholder:text-base-300 backdrop-blur text-[16px]
                 text-base-300"
                placeholder="Ask me anything..."
              />
              <button
                disabled={isGenerating}
                type="button"
                onClick={handleSend}
                className="w-fit py-1 font-bold text-sm/8  text-base-300 absolute right-6 px-2 bg-base-content rounded"
              >
                {isGenerating && <LoaderCircleIcon className="animate-spin" />}
                {!isGenerating && "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.main>
  )
}

export default Agent
