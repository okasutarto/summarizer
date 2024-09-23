"use client"

import Textarea from "@/components/ui/textarea";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
 } from "@/components/ui/popover";
 import { Input } from "@/components/ui/input";

import { useState, useEffect } from 'react';
import axios from "axios";

export default function Home() {
  const url = process.env.NEXT_PUBLIC_BASE_URL
  const [response, setResponse] = useState('')
  const [input, setInput] = useState('')
  const [isShowLoader, setIsShowLoader] = useState(false)
  const [words, setWords] =useState(0)
  const [thread, setThread] = useState('')

  const createThread = async () => {
    const thread = await axios.post(`${url}/thread/create`)
    setThread(thread.data);
  }

  useEffect(() => {
    createThread()
  }, [])

  const createMessage = async () => {
    try {  
      await axios.post(`${url}/message/create`,{
        content: input,
        threadId: thread.id
      })
      
    } catch (error) {
      setIsShowLoader(false)
    }
  }


  const summarize = async () => {
    setIsShowLoader(true);
    setResponse('');
    setWords(0);
    
    await createMessage()
    
    const eventSource = new EventSource(`${url}/summary/create/${thread.id}`);

    eventSource.addEventListener('textDelta', (event) => {
      setIsShowLoader(false)
      const data = JSON.parse(event.data)
      setResponse(prevResponse => prevResponse + data.value);
    })
    
    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource.close();
      setIsShowLoader(false);
    };
    
    eventSource.addEventListener('end', () => {
      eventSource.close();
      setIsShowLoader(false);
      setWords(countWords(response));
    });
  };

  function countWords(text) {
    // Trim the text to remove leading and trailing whitespace
    const trimmedText = text.trim();
    
    if (trimmedText === '') {
      return 0;
    }

    const words = trimmedText.split(/\s+/);
  
    const filteredWords = words.filter(word => word !== '');
    return filteredWords.length;
  }


  return (
    <div className="grid items-center justify-items-center p-8 pb-20 gap-16 sm:p-40 font-[family-name:var(--font-geist-sans)]">
      <div className=" border-2 rounded-2xl w-full h-fit px-9 py-9 shadow-lg">
        {/* <div className="flex justify-end mb-2">
          <ModeToggle />
        </div> */}
        <div className="flex h-96">
          <div className="w-full border border-e-0 rounded-s-xl rounded-bl-none p-4">
            <Textarea
              className="p-0"
              placeholder='Start typing or paste your content here . . .'
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
              }}
            />
          </div>
          <div className="w-full border rounded-e-xl rounded-bl-none rounded-br-none p-4 overflow-auto">
            {
              (isShowLoader)
              &&
              <div className="flex items-center">
                <span className="text-zinc-400 text-sm"> Generating Result </span> 
                <div className="loader ms-2 mt-1" />
              </div>
            }
              <span className="text-sm">
                {response}
              </span>
          </div>
        </div>
        <div className="flex h-14">
          <div className="w-full border rounded-bl-xl border-e-0 border-t-0 flex justify-between items-center p-4">
            <ToggleGroup type="single">
              <ToggleGroupItem value="a" className="ps-0">
                <span className="material-icons-outlined">attach_file</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="b">
                <span className="material-icons-outlined">
                image
                </span>
              </ToggleGroupItem>
                <Popover>
                  <PopoverTrigger>
                    <ToggleGroupItem value="c">
                      <span className="material-icons-outlined">
                        link
                      </span>
                      <PopoverContent>
                        <Input placeholder="https://"/>
                      </PopoverContent>
                    </ToggleGroupItem>
                  </PopoverTrigger>
                </Popover>
            </ToggleGroup>
            <Button
              onClick={summarize}
              disabled={isShowLoader || !input}
            >
              {isShowLoader ? 'Summarizing . . .' : 'Summarize'}
            </Button>
          </div>
          <div className="w-full border rounded-e-xl rounded-tr-none border-t-0 p-4 flex items-center text-zinc-400">
            <span className="text-sm">
              {words} words
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
