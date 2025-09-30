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
import { ABILITY_NAMES, ABILITY_ICONS } from '@/lib/constants';

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
  const abilityKeys = ['reading', 'memory', 'cognition', 'attention'] as const;

  const data = {
    labels: ['', '', '', ''], // ラベルを空にしてアイコンを外に配置
    datasets: [
      {
        label: 'アビリティスコア',
        data: [
          abilities.reading,
          abilities.memory,
          abilities.cognition,
          abilities.attention,
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
    layout: {
      padding: {
        top: 50,
        right: 50,
        bottom: 80,
        left: 50
      }
    },
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        suggestedMin: 0,
        suggestedMax: 5,
        pointLabels: {
          display: false, // ラベルを非表示
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
            const abilityKey = abilityKeys[tooltipItem.dataIndex];
            const abilityName = ABILITY_NAMES[abilityKey];
            return `${abilityName}: ${(tooltipItem.raw as number).toFixed(1)}`;
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
    <div className="w-full h-[450px] md:h-[500px] relative">
      {/* レーダーチャート */}
      <div className="w-full h-full">
        <Radar data={data} options={options} />
      </div>

      {/* カスタムラベル（アイコン付き） */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 上（12時方向）: 読解 */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <img src={ABILITY_ICONS.reading} alt="読解" className="w-8 h-8 mb-1" />
          <span className="text-sm font-bold text-gray-700">どっかい</span>
          <span className="text-xs text-gray-500">(読解)</span>
        </div>

        {/* 右（3時方向）: 記憶 */}
        <div className="absolute top-1/2 right-2 transform -translate-y-1/2 flex flex-col items-center">
          <img src={ABILITY_ICONS.memory} alt="記憶" className="w-8 h-8 mb-1" />
          <span className="text-sm font-bold text-gray-700">きおく</span>
          <span className="text-xs text-gray-500">(記憶)</span>
        </div>

        {/* 下（6時方向）: 認知 */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <img src={ABILITY_ICONS.cognition} alt="認知" className="w-8 h-8 mb-1" />
          <span className="text-sm font-bold text-gray-700">にんち</span>
          <span className="text-xs text-gray-500">(認知)</span>
        </div>

        {/* 左（9時方向）: 集中・注意 */}
        <div className="absolute top-1/2 left-2 transform -translate-y-1/2 flex flex-col items-center">
          <img src={ABILITY_ICONS.attention} alt="集中・注意" className="w-8 h-8 mb-1" />
          <span className="text-xs font-bold text-gray-700">しゅうちゅう</span>
          <span className="text-xs text-gray-500">(集中・注意)</span>
        </div>
      </div>
    </div>
  );
}