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

import { useState } from 'react';
import axios from "axios";

export default function Home() {
  const url = process.env.NEXT_PUBLIC_BASE_URL
  const [response, setResponse] = useState('')
  const [input, setInput] = useState('')
  const [isShowLoader, setIsShowLoader] = useState(false)
  const [words, setWords] =useState(0)

  function countWords(text) {
    // Trim the text to remove leading and trailing whitespace
    const trimmedText = text.trim();
    
    // If the text is empty after trimming, return 0
    if (trimmedText === '') {
      return 0;
    }
    
    // Split the text into words
    // This regex splits on one or more whitespace characters
    // It also handles punctuation by treating it as word boundaries
    const words = trimmedText.split(/\s+/);
    
    // Filter out any empty strings that may have been created by multiple spaces
    const filteredWords = words.filter(word => word !== '');
    
    console.log(filteredWords.length);
    
    // Return the count of words
    return filteredWords.length;
  }

  const summarize = () => {
    setIsShowLoader(true)
    setResponse('')
    axios.post(`${url}/summarize`, {
      content: input
    })
      .then(result => {
      setIsShowLoader(false)
      setResponse(result.data.data)
      setWords(countWords(response))
      console.log(words);
      
    })
    .catch(error => {
      console.log(error);
    });
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
              {response}
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
            {words} words
          </div>
        </div>
      </div>
    </div>
  );
}
