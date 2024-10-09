"use client";

import { useChat } from "ai/react";
import { useState, useRef } from "react";

export default function Chat() {
   const { messages, input, handleInputChange, handleSubmit } = useChat();

   const [files, setFiles] = useState<FileList | undefined>(undefined);
   const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((m) => (
        <>
          <div key={m.id} className="whitespace-pre-wrap">
            {m.role === "user" ? "User: " : "AI: "}
            {m.content}

          </div>
          <div>
          {m?.experimental_attachments
            ?.filter((attachment) => attachment?.contentType?.startsWith("image/"))
            .map((attachment, index) => (
              <img
                key={`${m.id}-${index}`}
                src={attachment.url}
                width={500}
                          alt={attachment.name}
                        />
                      ))}
          </div>
        </>
      ))}

      <form
        className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl space-y-2"
        onSubmit={(event) => {
          handleSubmit(event, {
            experimental_attachments: files,
          });

          setFiles(undefined);

          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }}
      >
          <input
            type="file"
            className=""
            onChange={(event) => {
              if (event.target.files) {
                setFiles(event.target.files);
              }
            }}
            multiple
            ref={fileInputRef}
          />
          <input
            className="w-full p-2 text-black"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
          />
      </form>
    </div>
  );
}