"use client"

import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose
} from "@/components/ui/popover";

import { useState, useEffect } from 'react';
import axios from "axios";
import { useRef } from 'react'
import ReactMarkdown from 'react-markdown';
import InputArea from "@/components/inputArea";
import { Input } from "@/components/ui/input"
import { UrlDialog } from "@/components/urlDialog";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

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
    const formData = new FormData();
    formData.append('text', input);
    formData.append('threadId', thread.id);
    formData.append('docs', docs[0])

    console.log(allImages);
    
    // Append all images in order, with type information
    allImages.forEach((image, index) => {
      if (image.type === 'file') {
        formData.append(`images`, image.content);
        formData.append(`imageTypes`, 'file');
      } else if (image.type === 'url') {
        formData.append(`urls`, image.content);
        formData.append(`imageTypes`, 'url');
      }
    });
    try {
      const response = await axios.post(`${url}/message/create`,formData)
    } catch (error) {
      setIsShowLoader(false)
    }
  }

  const [isGeneratingResult, setIsGeneratingResult] = useState(false)
  const summarize = async () => {
    setIsShowLoader(true);
    setResponse('');
    setWords(0);
    
    await createMessage()
    
    const eventSource = new EventSource(`${url}/summary/create/${thread.id}`);

    eventSource.addEventListener('textDelta', (event) => {
      setIsGeneratingResult(true)
      setIsShowLoader(false)
      const data = JSON.parse(event.data)
      setResponse(prevResponse => prevResponse + data.value);
    })
    
    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource.close();
      setIsShowLoader(false);
      setIsGeneratingResult(false)
    };
    
    eventSource.addEventListener('end', () => {
      eventSource.close();
      setIsShowLoader(false);
      setIsGeneratingResult(false)
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

  const imageInputRef = useRef(null);
   // New state to keep track of all images (both uploaded and URLs) in order
  const [allImages, setAllImages] = useState([]);

  const handleImageUpload = () => {
    imageInputRef.current.click(); // programmatically click the hidden input
  };

  const [images, setImages] = useState([])
  const [selectedImages, setSelectedImages] = useState([]);
  let filesArray = []
  
  const handleImageChange = (e) => {
    if (e.target.files) {
      setInput('')
      setDocs([])
      filesArray = Array.from(e.target.files); // Convert FileList to Array

      // Update the images state with the file objects
      setAllImages((prevImages) => [
        ...prevImages,
        ...filesArray.map(file => ({ type: 'file', content: file }))
      ]);
      const imageUrls = filesArray.map((file) => URL.createObjectURL(file)); // Create URLs for each image
      setSelectedImages((prevImages) => [...prevImages, ...imageUrls]); // Add new images to the state
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setSelectedImages(selectedImages.filter((_, index) => index !== indexToRemove));
    setAllImages(allImages.filter((_, index) => index !== indexToRemove));
  };

  const docsInputRef = useRef(null);

  const handleDocsUpload = () => {
    docsInputRef.current.click(); // programmatically click the hidden input
  };

  const [docs, setDocs] = useState([])
  
  const handleDocsChange = (e) => {
    if (e.target.files) {
      setInput('')
      setSelectedImages([])
      setAllImages([])
      setImages([])
      setDocs(Array.from(e.target.files))
    }
  };

  const removeSelectedDocs = () => {
    setDocs([]);
  };

  const [imageUrl, setImageUrl] = useState('')

  const onCloseDialog = () => {
    setTimeout(() => {
      setImageUrl('')
    }, 500);
  }

  const [isValidImageUrl, setIsValidImageUrl] = useState(true)

  const [isUrlLoading, setIsUrlLoading] = useState(false);

  async function isImgUrl(url) {
    setIsUrlLoading(true);
    try {
      const regex = /(https?:\/\/.*\.(?:png|jpg|webp|gif|jpeg))/i
      const img = new Image();
      img.src = url;
      
      let result = await new Promise((resolve) => {
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
      });

      if (url.match(regex)){
        result = {
          match: url.match(regex)
        }
      } else {
        result = false;
      }
      return result;
    } finally {
      setIsUrlLoading(false);
    }
  }

  const onInputImageUrl = async (e) => {
    setImageUrl(e)
    const isValid = await isImgUrl(e)
    setIsValidImageUrl(isValid)
  }


  const onInsertImageUrl = () => {
    setInput('')
    setSelectedImages((prevImages) => [...prevImages, imageUrl]);
    setAllImages((prevImages) => [...prevImages, { type: 'url', content: imageUrl }]);
    setImageUrl('')
  }

  const onOpenImageUrlDialog = () => {
    setImageUrl('')
  }

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
        <div className="flex h-96">
          <InputArea
            selectedImages={selectedImages}
            docs={docs}
            input={input}
            setInput={setInput}
            handleRemoveImage={handleRemoveImage}
            removeSelectedDocs={removeSelectedDocs}
          />

          <div className="w-full">
            <div className="w-full h-full border rounded-e-xl rounded-bl-none rounded-br-none p-4 overflow-auto">
              {
                (isShowLoader)
                &&
                <div className="flex items-center">
                  <div className="me-1">
                    <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="12" height="12">
                      <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"/>
                    </svg>
                  </div>
                  <span className="text-sm"> 
                    Generating Result
                  </span> 
                  <div className="loader ms-1 mt-1" />
                </div>
              }
                <span className="summary-container">
                  <ReactMarkdown>{response}</ReactMarkdown>
                </span>
            </div>
          </div>
        </div>

        <div className="flex h-14">
          <div className="w-full">
            <div className="w-full h-full border rounded-bl-xl border-e-0 border-t-0 flex justify-between items-center p-4">
              <ToggleGroup type="single">
                <ToggleGroupItem onClick={handleDocsUpload}>
                  <span className="material-icons-outlined">attach_file</span>
                </ToggleGroupItem>
                
                <Popover>
                  <PopoverTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-transparent h-9 px-3">
                    <span className="material-icons-outlined">
                      image
                    </span>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="grid">
                      <div
                        className="flex items-center justify-center text-sm gap-2 cursor-pointer hover:bg-accent p-2"
                        onClick={handleImageUpload}
                      >
                        <span className="material-icons-outlined">file_upload</span>
                          Upload image
                      </div>
                      <UrlDialog
                        imageUrl={imageUrl}
                        onCloseDialog={onCloseDialog}
                        isValidImageUrl={isValidImageUrl}
                        onInputImageUrl={onInputImageUrl}
                        onInsertImageUrl={onInsertImageUrl}
                        onOpenImageUrlDialog={onOpenImageUrlDialog}
                        isUrlLoading={isUrlLoading}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </ToggleGroup>

              <Button
                onClick={summarize}
                disabled={isShowLoader || isGeneratingResult ||(!selectedImages.length && !input && !docs.length)}
              >
                {isShowLoader ? 'Summarizing . . .' : 'Summarize'}
              </Button>
            </div>
          </div>
          <div className="w-full">
            <div className="w-full h-full border rounded-e-xl rounded-tr-none border-t-0 p-4 flex items-center text-zinc-400">
              <span className="text-sm">
                {words} words
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
