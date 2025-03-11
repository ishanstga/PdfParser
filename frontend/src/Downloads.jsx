import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

export default function Downloads() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/files");
        setFiles(response.data);
      } catch (error) {
        console.error("Error fetching files:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  const handleDownload = async (id, fileName) => {
    try {
      setDownloadLoading(true);
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = `http://localhost:5000/public/${id}`;
      document.body.appendChild(iframe);

      // Cleanup after download
      setTimeout(() => {
        document.body.removeChild(iframe);
        setDownloadLoading(false);
      }, 5000);
    } catch (err) {
      console.error("Download error:", err);
      alert("Browser Error");
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <div>
      <h2 className="m-5 font-bold">
        {loading ? "loading..." : "Uploaded CV PDFs "}{" "}
        {downloadLoading ? " Downloading..." : ""}
      </h2>
      <table>
        <thead>
          <tr className="grid grid-cols-6  gap-20 place-items-center">
            <th>Name</th>
            <th>File Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Upload Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr
              key={file._id}
              className="grid grid-cols-6 gap-20  place-items-center"
            >
              <td>{file.name}</td>
              <td>{file.fileName}</td>
              <td>{file.email}</td>
              <td>{file.phone}</td>
              <td>{new Date(file.createdAt).toLocaleDateString()}</td>
              <td>
                <Button onClick={() => handleDownload(file._id, file.fileName)}>
                  Dounload
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
