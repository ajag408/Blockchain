
"use client";
import { useState } from "react";


import { ChangeEvent } from "react";

const MAX_CHARACTERS = 500;

const Home = () => {
  const [message, setMessage] = useState("");
  const [friendshipMeter, setFriendshipMeter] = useState(0);
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([]);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newFriendshipMeter = Math.min(friendshipMeter + 10, 100);
    setFriendshipMeter(newFriendshipMeter);
    const updatedChatHistory = [...chatHistory, { role: "user", content: message }];

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: updatedChatHistory,
        friendshipMeter: newFriendshipMeter,
      }),
    });
    const data = await res.json();
    setChatHistory([...updatedChatHistory, { role: "assistant", content: data.content }]);

    setMessage("");
  };


  return (
    <main className="min-h-screen bg-gray-900 py-6 flex flex-col justify-center sm:py-12">
      <h1 className="text-4xl font-bold text-center text-gray-100 mb-8">
        Chat Page
      </h1>
      <section className="max-w-3xl mx-auto w-full">
        <div className="bg-gray-800 shadow-lg rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <p className="text-white mb-2">Friendship Meter</p>
            <div className="bg-gray-700 h-4 rounded-full">
              <div 
                className="bg-blue-500 h-4 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${friendshipMeter}%` }}
              ></div>
            </div>
          </div>
          <div className="mt-4 space-y-4">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`p-3 rounded ${msg.role === "user" ? "bg-gray-700 text-white" : "bg-blue-500 text-white"}`}>
                <p>{msg.content}</p>
              </div>
            ))}
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-4 mt-4"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
              className="px-3 py-2 bg-gray-700 text-white rounded"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Send
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Home;