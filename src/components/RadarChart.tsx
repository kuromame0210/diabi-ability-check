'use client';

import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  TooltipItem,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { UserData } from '@/types';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RadarChartProps {
  abilities: UserData['abilities'];
}

export default function RadarChart({ abilities }: RadarChartProps) {
  const data = {
    labels: ['読解', '集中・注意', '記憶', '認知'],
    datasets: [
      {
        label: 'アビリティスコア',
        data: [
          abilities.reading,
          abilities.attention,
          abilities.memory,
          abilities.cognition,
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 3,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        suggestedMin: 0,
        suggestedMax: 5,
        pointLabels: {
          font: {
            size: 16,
            weight: 'bold' as const,
          },
          color: '#374151',
        },
        ticks: {
          display: true,
          stepSize: 1,
          font: {
            size: 12,
          },
          color: '#6B7280',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        callbacks: {
          label: function(tooltipItem: TooltipItem<'radar'>) {
            return `${tooltipItem.label}: ${(tooltipItem.raw as number).toFixed(1)}`;
          },
        },
      },
    },
    elements: {
      line: {
        tension: 0.2,
      },
    },
  };

  return (
    <div className="w-full h-80 md:h-96">
      <Radar data={data} options={options} />
    </div>
  );
}