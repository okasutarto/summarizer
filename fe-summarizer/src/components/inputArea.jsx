import { Badge } from "@/components/ui/badge";
import Textarea from "@/components/ui/textarea";

const InputArea = ({
  selectedImages,
  docs,
  input,
  setInput,
  handleRemoveImage,
  removeSelectedDocs,
}) => {
  return (
    <div className="w-full">
      {!selectedImages.length && !docs.length && (
        <Textarea
          className="p-4 w-full border border-e-0 rounded-s-xl rounded-bl-none"
          placeholder="Start typing or paste your content here . . ."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      )}

      {selectedImages.length > 0 && (
        <div className="p-4 w-ful h-full border border-e-0 rounded-s-xl rounded-bl-none outline-none text-sm overflow-auto text-wrap">
          <div className="container mx-auto">
            <div className="flex flex-wrap -m-2">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative p-2">
                  <div className="relative w-24 h-24 group">
                    <img
                      src={image}
                      alt={`Selected Image ${index}`}
                      className="w-full h-full object-cover rounded-md border-2 border-gray-200"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md hover:bg-red-700 transition-colors duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {docs.length > 0 && (
        <div className="p-4 w-full h-full border border-e-0 rounded-s-xl rounded-bl-none outline-none text-sm overflow-auto text-wrap">
          {docs.map((doc, index) => (
            <div key={index}>
              <Badge variant="" disabled>
                {doc.name}
                <div
                  title="Remove"
                  onClick={removeSelectedDocs}
                  className="cursor-pointer ms-4"
                >
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
  );

  // return (
  //   <div className="w-full h-full">
  //     {!selectedImages.length && !docs.length && (
  //       <Textarea
  //         className="p-4 w-full h-full border border-e-0 rounded-s-xl rounded-bl-none resize-none"
  //         placeholder="Start typing or paste your content here . . ."
  //         value={input}
  //         onChange={(e) => setInput(e.target.value)}
  //       />
  //     )}

  //     {selectedImages.length > 0 && (
  //       <div className="p-4 border border-e-0 rounded-s-xl rounded-bl-none">
  //         <div className="flex flex-wrap -m-2">
  //           {selectedImages.map((image, index) => (
  //             <div key={index} className="relative p-2 w-1/3 sm:w-1/4 md:w-1/5">
  //               <div className="relative aspect-square group">
  //                 <img
  //                   src={image}
  //                   alt={`Selected Image ${index}`}
  //                   className="w-full h-full object-cover rounded-md border-2 border-gray-200"
  //                 />
  //                 <button
  //                   onClick={() => handleRemoveImage(index)}
  //                   className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md hover:bg-red-700 transition-colors duration-200"
  //                   aria-label="Remove image"
  //                 >
  //                   <svg
  //                     xmlns="http://www.w3.org/2000/svg"
  //                     className="h-3 w-3"
  //                     viewBox="0 0 20 20"
  //                     fill="currentColor"
  //                   >
  //                     <path
  //                       fillRule="evenodd"
  //                       d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
  //                       clipRule="evenodd"
  //                     />
  //                   </svg>
  //                 </button>
  //               </div>
  //             </div>
  //           ))}
  //         </div>
  //       </div>
  //     )}

  //     {docs.length > 0 && (
  //       <div className="p-4 border border-e-0 rounded-s-xl rounded-bl-none">
  //         <div className="flex flex-wrap gap-2">
  //           {docs.map((doc, index) => (
  //             <Badge
  //               key={index}
  //               variant="secondary"
  //               className="flex items-center px-3 py-1"
  //             >
  //               <span className="truncate max-w-[150px]">{doc.name}</span>
  //               <button
  //                 onClick={removeSelectedDocs}
  //                 className="ml-2 text-sm hover:text-red-500 transition-colors duration-200"
  //                 aria-label="Remove document"
  //               >
  //                 ×
  //               </button>
  //             </Badge>
  //           ))}
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // )
};

export default InputArea;