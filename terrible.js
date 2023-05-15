import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CSVLink } from 'react-csv';

const App = () => {
  const [wordFrequency, setWordFrequency] = useState(null);
  
  const fetchTextFile = async () => {
    const response = await fetch('https://www.terriblytinytales.com/test.txt');
    const text = await response.text();
    const words = text.match(/\b\w+\b/g);
    const frequency = {};

    words.forEach(word => {
      if (frequency[word]) {
        frequency[word]++;
      } else {
        frequency[word] = 1;
      }
    });

    const sortedFrequency = Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    setWordFrequency(sortedFrequency);
  };

  const exportData = () => {
    const csvData = Object.entries(wordFrequency).map(([word, count]) => ({ word, count }));
    return csvData;
  };

  return (
    <div>
      <button onClick={fetchTextFile}>Submit</button>
      {wordFrequency && (
        <div style={{ height: '400px', width: '100%' }}>
          <ResponsiveContainer>
            <BarChart data={Object.entries(wordFrequency).map(([word, count]) => ({ word, count }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="word" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          <CSVLink data={exportData()} filename="histogram-data.csv">
            Export
          </CSVLink>
        </div>
      )}
    </div>
  );
};

export default App;