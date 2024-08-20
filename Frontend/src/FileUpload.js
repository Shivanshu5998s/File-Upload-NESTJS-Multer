import React, { useState } from "react";
import axios from "axios";
import "./FileUpload.css";

const apiClient = axios.create({
  baseURL: "http://localhost:3000", // Backend URL
});

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [statusClass, setStatusClass] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please choose a file first.");
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 5MB Limit
    if (file.size > maxSize) {
      alert("File size exceeds 5MB limit.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await apiClient.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // FormData automatically handles setting this header correctly when you omit it. Setting it manually to
          // 'text/html' can cause issues because the server might not interpret the request correctly.
        },
      });
      setUploadStatus("File uploaded successfully!");
      setStatusClass("upload-success");
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("Error uploading file.");
      setStatusClass("upload-error");
    } finally {
      setTimeout(() => {
        setFile(null);
        setUploadStatus("");
        setStatusClass("");
        document.querySelector('input[type="file"]').value = "";
      }, 3000);
    }
  };

  return (
    <div className="file-upload-container">
      <h2>Upload File</h2>
      <input accept=".jpeg" type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {uploadStatus && <p className={statusClass}>{uploadStatus}</p>}
    </div>
  );
};

export default FileUpload;