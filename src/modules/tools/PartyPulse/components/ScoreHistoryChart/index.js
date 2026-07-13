import React from 'react';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  YAxis,
  ReferenceLine,
  Tooltip,
} from 'recharts';
import { L } from 'components';


const ScoreHistoryChart = ({ data, colors }) => {
  const chartData = (data || []).map(score => ({ score }));

  return (
    <L.div sx={{ width: '100%', maxWidth: 455, height: 60, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 1 }}>
      <ResponsiveContainer>
        <LineChart data={ chartData } margin={{ top: 3, right: 3, left: -25, bottom: 3 }}>
          <text x="50%" y={ 57 } textAnchor="middle" fontSize={ 11 } fill={ colors?.references || 'black' }>Score History</text>
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: 'none',
              borderRadius: '5px',
            }}
            labelStyle={{ color: colors?.references || 'black' }}
            itemStyle={{ color: colors?.line || '#404fbd' }}
            formatter={ value => [ value.toFixed(), 'Score' ] }
            labelFormatter={ () => '' }
          />
          <YAxis
            domain={ [ -42, 42 ] }
            stroke={ colors?.references || 'black' }
            width={ 50 }
            tick={{ fontSize: 10, fill: colors?.references || 'black' }}
            ticks={ [ 0 ] }
          />
          <ReferenceLine y={ 0 } stroke={ colors?.references || 'black' } />
          <Line
            type="monotone"
            dataKey="score"
            stroke={ colors?.line || '#404fbd' }
            strokeWidth={ 2 }
            dot={ false }
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </L.div>
  );
};

export default ScoreHistoryChart;
