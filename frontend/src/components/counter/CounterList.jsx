import React from "react";
import { useCounter } from "../../contexts/index.js";
import AddWordForm from "./AddWordForm.jsx";
import CounterCard from "./CounterCard";
import VoiceCounter from "./VoiceCounter.jsx";

const CounterList = () => {
  const { counters, loading, incrementCounter, resetCounter } = useCounter();

  const handleAddWord = async (word) => {
    await incrementCounter(word);
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            🕉️ Chanting Counter
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto ">
            Track your spiritual practice with voice recognition and manual
            counting
          </p>
        </div>

        <div className="mb-8">
          <VoiceCounter />
        </div>

        <div className="mb-8">
          <AddWordForm onAddWord={handleAddWord} loading={loading} />
        </div>

        {counters.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <div>🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Start Your Journey
              </h3>
              <p className="text-gray-600 mb-4">
                Add a sacred word above or use voice counter to begin tracking
                your chanting practice.
              </p>
              <div className="text-sm text-gray-500">
                Popular words: Ram, Krishna, Hari, Shiva, Om
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                📊 your Progress
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {counters.length}
                  </div>
                  <div className="text-sm text-gray-600">Words Tracked</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {counters.reduce((sum, counter) => sum + counter.count, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Chants</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.max(...counters.map((c) => c.count), 0)}
                  </div>
                  <div className="text-sm text-gray-600">Highest Count</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default CounterList;
