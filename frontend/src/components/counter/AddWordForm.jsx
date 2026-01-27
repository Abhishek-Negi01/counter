import React, { useState } from "react";
import { Input, Button } from "../ui/index.js";

const AddWordForm = ({ onAddWord, loading }) => {
  const [word, setWord] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (word.trim()) {
      onAddWord(word.trim().toLowerCase());
      setWord("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <Input
        placeholder="Enter word to track..."
        value={word}
        onChange={(e) => setWord(e.target.value)}
        className="flex-1 mb-0"
      />
      <Button type="submit" disabled={loading || !word.trim()}>
        Add Word
      </Button>
    </form>
  );
};

export default AddWordForm;
