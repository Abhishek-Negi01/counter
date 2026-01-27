import React from "react";
import { useCounter } from "../../contexts/index.js";
import AddWordForm from "./AddWordForm.jsx";
import CounterCard from "./CounterCard";

const CounterList = () => {
  const { counters, loading, incrementCounter, resetCounter } = useCounter();

  const handleAddWord = async (word) => {
    await incrementCounter(word);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Word Counters</h1>

      <AddWordForm onAddWord={handleAddWord} loading={loading} />

      {counters.length === 0 ? (
        <div className="text-center text-gray-500 py-2">
          <p className="text-lg mb-2 ">No words tracked yet</p>
          <p>Add a word above to start counting.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {counters.map((counter) => (
            <CounterCard
              key={counter._id}
              word={counter.word}
              count={counter.count}
              onIncrement={incrementCounter}
              onReset={resetCounter}
              loading={loading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CounterList;
