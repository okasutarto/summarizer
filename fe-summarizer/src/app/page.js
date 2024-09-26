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

import { Badge } from "@/components/ui/badge";

import { useState, useEffect } from 'react';
import axios from "axios";
import { useRef } from 'react'

export default function Home() {
  const url = process.env.NEXT_PUBLIC_BASE_URL
  const [response, setResponse] = useState('')
  const [input, setInput] = useState(null)
  const [isShowLoader, setIsShowLoader] = useState(false)
  const [words, setWords] =useState(0)
  const [thread, setThread] = useState('')
  const [images, setImages] = useState([])

  const createThread = async () => {
    const thread = await axios.post(`${url}/thread/create`)
    setThread(thread.data);
  }

  useEffect(() => {
    createThread()
  }, [])

  const createMessage = async () => {
    const formData = new FormData();
    formData.append('text', input);
    formData.append('threadId', thread.id);
    images.forEach((file, index) => {
      formData.append('images', file); // Append each file to FormData
    });
    formData.append('docs', docs[0])
    try {  
      const response = await axios.post(`${url}/message/create`,formData)
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

  const divRef = useRef(null);

  const handleInput = () => {
    let content = divRef.current.innerHTML;
    setInput(content); // You can use setInput here to store the content
  };

  const removeSelectedImage = () => {
    setSelectedImages(null);
  };

  const imageInputRef = useRef(null);

  const handleImageUpload = () => {
    imageInputRef.current.click(); // programmatically click the hidden input
  };

  const [selectedImages, setSelectedImages] = useState([]);
  let filesArray = []
  
  const handleImageChange = (e) => {
    if (e.target.files) {
      setDocs([])
      // setInput(null)
      // divRef.current.innerHTML = null
      filesArray = Array.from(e.target.files); // Convert FileList to Array

      // Update the images state with the file objects
      setImages(prevImages => [...prevImages, ...filesArray])
      const imageUrls = filesArray.map((file) => URL.createObjectURL(file)); // Create URLs for each image
      setSelectedImages((prevImages) => [...prevImages, ...imageUrls]); // Add new images to the state
    }
  };

  const docsInputRef = useRef(null);

  const handleDocsUpload = () => {
    // setDocs([])
    docsInputRef.current.click(); // programmatically click the hidden input
  };

  const [docs, setDocs] = useState([])
  
  const handleDocsChange = (e) => {
    if (e.target.files) {
      setSelectedImages([])
      setImages([])

      setDocs(Array.from(e.target.files))
    }
  };

  const removeSelectedDocs = () => {
    setDocs([]);
  };

  return (
    <main className="grid items-center justify-items-center p-8 pb-20 gap-16 sm:p-40 font-[family-name:var(--font-geist-sans)]">
      <input
        multiple
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={imageInputRef} // reference the input
        style={{ display: 'none' }} // hide the input
      />
      <input
        type="file"
        accept="application/pdf"
        onChange={handleDocsChange}
        ref={docsInputRef} // reference the input
        style={{ display: 'none' }} // hide the input
      />
      <div className=" border-2 rounded-2xl w-full h-fit px-9 py-9 shadow-lg">
        {/* <div className="flex justify-end mb-2">
          <ModeToggle />
        </div> */}
        <div className="flex h-96">
          <div
            contentEditable={selectedImages.length ? false : true}
            ref={divRef}
            className="p-4 w-full border border-e-0 rounded-s-xl rounded-bl-none outline-none text-sm"
            placeholder='Start typing or paste your content here . . .'
            onInput={handleInput}
          >
            {selectedImages.length > 0 && (
              <div>
                <h2>Image Previews:</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {selectedImages.map((image, index) => (
                    <div key={index} style={{ margin: '10px' }}>
                      <img src={image} alt={`Selected Image ${index}`} style={{ width: '100px' }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {docs.length > 0 && (
              <div>
                {docs.map((docs, index) => (
                  <div key={index} style={{ margin: '10px' }}>
                    <Badge variant="">
                      {docs.name}
                      <div title="Remove" onClick={removeSelectedDocs} className="cursor-pointer ms-4">
                        <span type="button" className="text-base">
                          x
                        </span>
                      </div>
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* <Textarea
            className="p-4 w-full border border-e-0 rounded-s-xl rounded-bl-none"
            placeholder='Start typing or paste your content here . . .'
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
            }}
          /> */}
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
              <ToggleGroupItem className="ps-0" onClick={handleDocsUpload}>
                <span className="material-icons-outlined">attach_file</span>
              </ToggleGroupItem>
              <ToggleGroupItem onClick={handleImageUpload}>
                <span className="material-icons-outlined">
                image
                </span>
              </ToggleGroupItem>
            </ToggleGroup>
            <Button
              onClick={summarize}
              disabled={isShowLoader || !selectedImages.length && !input && !docs}
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
    </main>
  );
}
