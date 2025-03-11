import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function GetPDFs() {
  const navigate = useNavigate(); // Navigation hook

  const handleClick = async () => {
    navigate("/Downloads");
  };
  return <Button onClick={handleClick}>Get PDFs</Button>;
}
