import * as React from "react";
import { useState, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function CardWithForm() {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !formData.name || !formData.email || !formData.phone) {
      setError("All fields are required");
      alert(error);
      return;
    }

    const data = new FormData();
    data.append("pdf", file);
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    console.log(formData);

    try {
      setLoading(true);
      setError("");
      const response = await axios.post("http://localhost:5000/upload", data);
      console.log(response);
      alert(response.data.message);
      //onUpload(response.data);
      setFile(null);
      setFormData({ name: "", email: "", phone: "" });
      if (fileRef.current) {
        fileRef.current.value = ""; // Clear the file input value
      }
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full md:w-[425px] mx-4 md:mx-0">
      <CardHeader>
        <CardTitle>Upload your CV</CardTitle>
        <CardDescription>Intern Software Engineering - Metana.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <form>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="ex: Ishan Sanjaya"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="ex: example@gmail.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="ex: 07x xxx xxxx"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="cv">Resume/CV</Label>
              <Input
                id="cv"
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
                ref={fileRef}
              />
            </div>
          </form>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col md:flex-row gap-2 md:gap-0 md:justify-end">
        <Button variant="outline" className="w-full md:w-auto md:mr-4">
          Cancel
        </Button>
        <Button
          className="w-full md:w-auto"
          type="button"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? "Uploading..." : "Submit"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default CardWithForm;
