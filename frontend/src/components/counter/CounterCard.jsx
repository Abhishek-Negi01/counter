import React from "react";
import { Card, Button } from "../ui/index.js";

const CounterCard = ({ word, count, onIncrement, onReset, loading }) => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold capitalize">{word}</h3>
        <span className="text-2xl font-bold text-blue-600">{count}</span>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => onIncrement(word)}
          disabled={loading}
          className="flex-1"
        >
          +1
        </Button>

        <Button
          onClick={() => onReset(word)}
          disabled={loading}
          variant="outline"
          size="sm"
        >
          Reset
        </Button>
      </div>
    </Card>
  );
};

export default CounterCard;
