import React, { useState } from "react";
import { TrashIcon } from "lucide-react";

const MainPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([
    { id: 1, name: "Document1.pdf", size: "1.2 MB" },
    { id: 2, name: "Image.jpg", size: "500 KB" },
    { id: 3, name: "Presentation.pptx", size: "2.3 MB" },
  ]);

  // Handler for file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Handler for file upload
  const handleUpload = () => {
    if (selectedFile) {
      const newFile = { id: Date.now(), name: selectedFile.name, size: "Unknown" };
      setFiles([...files, newFile]);
      setSelectedFile(null);
    }
  };

  // Handler for file deletion
  const handleDelete = (id) => {
    setFiles(files.filter((file) => file.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Navbar */}
      <nav className="bg-blue-600 p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-xl font-semibold">SecureStorage</h1>
          <ul className="flex space-x-4">
            <li>
              <a href="#" className="text-white hover:underline">Home</a>
            </li>
            <li>
              <a href="#" className="text-white hover:underline">Profile</a>
            </li>
            <li>
              <a href="#" className="text-white hover:underline">Settings</a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-4">Secure File Storage & Sharing</h1>

        {/* Storage Info */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <h2 className="font-bold text-lg mb-2">Storage Usage</h2>
          <div className="relative w-full bg-gray-200 rounded-full h-4">
            <div className="absolute top-0 left-0 h-4 rounded-full bg-blue-500" style={{ width: "60%" }}></div>
          </div>
          <p className="text-gray-600 text-sm mt-1">300 MB of 500 MB used</p>
        </div>

        {/* File Upload */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <h2 className="font-bold text-lg mb-2">Upload a New File</h2>
          <div className="flex items-center">
            <input type="file" onChange={handleFileChange} className="mr-4" />
            <button
              onClick={handleUpload}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Upload
            </button>
          </div>
        </div>

        {/* File List */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="font-bold text-lg mb-2">Your Files</h2>
          <ul className="space-y-2">
            {files.map((file) => (
              <li key={file.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <div className="flex items-center">
                  <p className="text-gray-700">{file.name}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="text-sm text-gray-500">{file.size}</p>
                  <button onClick={() => handleDelete(file.id)} className="text-red-500 hover:text-red-700">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
