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
    images.forEach((file) => {
      formData.append('images', file); // Append each file to FormData
    });
    formData.append('docs', docs[0])
    // selectedImagesUrl.forEach((url) => {
      formData.append('urls', selectedImagesUrl)
    // })
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

  const imageInputRef = useRef(null);

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
      // divRef.current.innerHTML = null
      filesArray = Array.from(e.target.files); // Convert FileList to Array

      // Update the images state with the file objects
      setImages(prevImages => [...prevImages, ...filesArray])
      const imageUrls = filesArray.map((file) => URL.createObjectURL(file)); // Create URLs for each image
      setSelectedImages((prevImages) => [...prevImages, ...imageUrls]); // Add new images to the state
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setSelectedImages(selectedImages.filter((_, index) => index !== indexToRemove));
    setImages(images.filter((_, index) => index !== indexToRemove));
    setSelectedImagesUrl(selectedImagesUrl.filter((_, index) => index !== indexToRemove))
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
      setSelectedImagesUrl([])
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

  const [selectedImagesUrl, setSelectedImagesUrl] = useState([])
  const onInsertImageUrl = () => {
    setInput('')
    setSelectedImages((prevImages) => [...prevImages, imageUrl]);
    setSelectedImagesUrl((prevImages) => [...prevImages, imageUrl]);
    setImageUrl('')
  }

  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onOpenDialog = () => {
    setIsPopoverOpen(false)
    setIsDialogOpen(true)
    console.log(isDialogOpen, 'dialog', isPopoverOpen, 'popover');
  }

  const onOpenPopover = () => {
    setIsPopoverOpen(true)
    console.log('popover');
    
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
                
                <Popover
                  // open={isPopoverOpen}
                  // onOpenChange={setIsPopoverOpen}
                >
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
                        <Dialog
                          // open={isDialogOpen}
                          // onOpenChange={setIsPopoverOpen}
                        >
                            {/* <PopoverClose className="hover:bg-accent"> */}
                          <DialogTrigger>
                              <div
                                className="flex items-center justify-center text-sm gap-2 cursor-pointer hover:bg-accent p-2"
                                // onClick={onOpenDialog}
                              >
                                <span className="material-icons-outlined">
                                  link 
                                </span>
                                <p>Link to image</p>
                              </div>
                          </DialogTrigger>
                            {/* </PopoverClose> */}
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Insert image from url</DialogTitle>
                            </DialogHeader>
                            <div className="flex items-center space-x-2">
                              <div className="grid flex-1 gap-2">
                                <Input
                                  id="link"
                                  value={imageUrl}
                                  placeholder="Image url"
                                  onChange={(e) => onInputImageUrl(e.target.value)}
                                />
                                <div className="flex justify-center">
                                    {
                                      (isUrlLoading && !isValidImageUrl && imageUrl) &&
                                      <div className="flex">
                                        <div className="spinner w-28 me-2" />
                                        <span className="text-sm w-32"> 
                                          Checking URL
                                        </span> 
                                      </ div>
                                    }
                                    { 
                                      (!isUrlLoading && isValidImageUrl && imageUrl) && 
                                      <div className="w-24 h-24 group">
                                        <img
                                          src={imageUrl}
                                          className="w-full h-full object-cover rounded-md border-2 border-gray-200"
                                        />
                                      </div>
                                    }
                                    { 
                                      (!isUrlLoading && !isValidImageUrl && imageUrl) &&
                                      <span className="text-sm">
                                        <span type="button" className="text-base text-red-500 me-1 font-bold">
                                          x
                                        </span>
                                        Invalid image URL
                                      </span>
                                    }
                                </div>
                              </div>
                            </div>
                            <DialogFooter className="sm:justify-end">
                              <DialogClose asChild>
                                <Button type="button" variant="secondary" onClick={onCloseDialog}>
                                  Cancel
                                </Button>
                              </DialogClose>
                                <DialogClose asChild>
                                  <Button
                                    type="button"
                                    disabled={!imageUrl || !isValidImageUrl}
                                    onClick={onInsertImageUrl}
                                  >
                                    Insert
                                  </Button>
                                </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                          {/* <UrlDialog
                            imageUrl={imageUrl}
                            onCloseDialog={onCloseDialog}
                            isValidImageUrl={isValidImageUrl}
                            onInputImageUrl={onInputImageUrl}
                            onInsertImageUrl={onInsertImageUrl}
                          /> */}
                        </Dialog>
                      
                    </div>
                  </PopoverContent>
                </Popover>
              </ToggleGroup>

              <Button
                onClick={summarize}
                disabled={isShowLoader || !selectedImages.length && !input && !docs.length}
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

  //   <main className="container flex items-center justify-center max-h-screen mx-auto px-4 py-8 sm:px-6 lg:px-8">
  //   <input
  //     multiple
  //     type="file"
  //     accept="image/*"
  //     onChange={handleImageChange}
  //     ref={imageInputRef}
  //     className="hidden"
  //   />
  //   <input
  //     type="file"
  //     accept="application/pdf"
  //     onChange={handleDocsChange}
  //     ref={docsInputRef}
  //     className="hidden"
  //   />
  //   <div className="w-full border-2 rounded-2xl shadow-lg overflow-hidden p-9">
  //     <div className="flex flex-col lg:flex-row h-96">
  //       <div className="lg:w-1/2 border-b lg:border-b-0 lg:border-r h-full">
  //         <InputArea
  //           selectedImages={selectedImages}
  //           docs={docs}
  //           input={input}
  //           setInput={setInput}
  //           handleRemoveImage={handleRemoveImage}
  //           removeSelectedDocs={removeSelectedDocs}
  //         />
  //       </div>
  //       <div className="lg:w-1/2 h-full">
  //         <div className="h-full p-4 overflow-auto">
  //           {isShowLoader && (
  //             <div className="flex items-center">
  //               <span className="text-zinc-400 text-sm">Generating Result</span>
  //               <div className="loader ms-2 mt-1" />
  //             </div>
  //           )}
  //           <span className="summary-container">
  //             <ReactMarkdown>{response}</ReactMarkdown>
  //           </span>
  //         </div>
  //       </div>
  //     </div>
  //     <div className="flex flex-col sm:flex-row border-t">
  //       <div className="sm:w-1/2 border-b sm:border-b-0 sm:border-r">
  //         <div className="p-4 flex justify-between items-center">
  //           <ToggleGroup type="single" className="flex-wrap">
  //             <ToggleGroupItem className="ps-0" onClick={handleDocsUpload}>
  //               <span className="material-icons-outlined">attach_file</span>
  //             </ToggleGroupItem>
  //             <ToggleGroupItem onClick={handleImageUpload}>
  //               <span className="material-icons-outlined">image</span>
  //             </ToggleGroupItem>
  //           </ToggleGroup>
  //           <Button
  //             onClick={summarize}
  //             disabled={isShowLoader || (!selectedImages.length && !input && !docs.length)}
  //           >
  //             {isShowLoader ? 'Summarizing...' : 'Summarize'}
  //           </Button>
  //         </div>
  //       </div>
  //       <div className="sm:w-1/2">
  //         <div className="p-4 flex items-center text-zinc-400">
  //           <span className="text-sm">{words} words</span>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // </main>
  );
}
