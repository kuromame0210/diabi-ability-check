'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  scoreProblem1,
  scoreProblem2,
  calculateAbilities,
  analyzeAbilities,
  getCurrentDateTime,
  saveUserData
} from '@/lib/utils';
import { UserData } from '@/types';

// Chart.js を動的インポート（SSR対応）
const RadarChart = dynamic(() => import('@/components/RadarChart'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 flex items-center justify-center">
      <div className="text-lg text-gray-500">チャートを読み込み中...</div>
    </div>
  ),
});

export default function Result() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const router = useRouter();

  useEffect(() => {
    // ローカルストレージからデータを取得
    const name = localStorage.getItem('userName');
    const problem1Answers = JSON.parse(localStorage.getItem('problem1Answers') || '{}');
    const problem2Answers = JSON.parse(localStorage.getItem('problem2Answers') || '[]');
    const startTime = localStorage.getItem('testStartTime') || '';
    const problem1Time = localStorage.getItem('problem1Time') || '';
    const problem2Time = localStorage.getItem('problem2Time') || '';

    if (!name) {
      router.push('/');
      return;
    }

    const endTime = getCurrentDateTime();

    // 得点計算
    const problem1Score = scoreProblem1(problem1Answers);
    const problem2Score = scoreProblem2(problem2Answers);
    const totalScore = problem1Score + problem2Score;

    // アビリティ計算
    const abilities = calculateAbilities(problem1Score, problem2Score);
    const analysis = analyzeAbilities(abilities);

    const userData: UserData = {
      name,
      testDate: endTime.date,
      testTime: endTime.time,
      answers: {
        problem1: problem1Answers,
        problem2: problem2Answers,
      },
      scores: {
        problem1: problem1Score,
        problem2: problem2Score,
        total: totalScore,
      },
      abilities,
      analysis,
      timestamps: {
        start: startTime,
        problem1: problem1Time,
        problem2: problem2Time,
        end: endTime.full,
      },
    };

    setUserData(userData);

    // Google Sheets に保存
    handleSaveData(userData);
  }, [router]);

  const handleSaveData = async (data: UserData) => {
    setSaveStatus('saving');

    const success = await saveUserData(data);

    if (success) {
      setSaveStatus('success');
    } else {
      setSaveStatus('error');
    }
  };

  const handleFinish = () => {
    // ローカルストレージをクリア
    localStorage.removeItem('userName');
    localStorage.removeItem('problem1Answers');
    localStorage.removeItem('problem2Answers');
    localStorage.removeItem('testStartTime');
    localStorage.removeItem('problem1Time');
    localStorage.removeItem('problem2Time');

    // トップページに戻る
    router.push('/');
  };

  const handleReset = () => {
    // ローカルストレージをクリア（最初からやり直し）
    localStorage.removeItem('userName');
    localStorage.removeItem('problem1Answers');
    localStorage.removeItem('problem2Answers');
    localStorage.removeItem('testStartTime');
    localStorage.removeItem('problem1Time');
    localStorage.removeItem('problem2Time');

    // トップページに戻る
    router.push('/');
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-800 text-xl">結果を計算中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            🎉 けっか 🎉
          </h2>

          {/* メインレイアウト: 左にコメント・右にグラフ */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* 左側: 基本情報、問題結果、アビリティ分析 */}
            <div className="space-y-4">
              {/* 基本情報 */}
              <div className="border-2 border-gray-300 p-4 text-center">
                <div className="text-xl font-bold text-gray-800 mb-3">
                  👤 なまえ: {userData.name}
                </div>
                <div className="text-2xl font-bold text-blue-600 py-2">
                  ⭐ とくてん: {userData.scores.total}/5点
                </div>
              </div>

              {/* 問題別結果 */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-800 text-center">📊 もんだいべつけっか</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-gray-300 p-3 text-center">
                    <h4 className="text-lg font-bold text-gray-800 mb-2">🔍 もんだい１</h4>
                    <div className={`text-3xl font-bold ${
                      userData.scores.problem1 > 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {userData.scores.problem1 > 0 ? '😊' : '😢'}
                    </div>
                    <div className="text-base font-bold text-gray-700 mt-1">
                      {userData.scores.problem1}/2.5点
                    </div>
                  </div>
                  <div className="border border-gray-300 p-3 text-center">
                    <h4 className="text-lg font-bold text-gray-800 mb-2">🔢 もんだい２</h4>
                    <div className={`text-3xl font-bold ${
                      userData.scores.problem2 > 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {userData.scores.problem2 > 0 ? '😊' : '😢'}
                    </div>
                    <div className="text-base font-bold text-gray-700 mt-1">
                      {userData.scores.problem2}/2.5点
                    </div>
                  </div>
                </div>
              </div>

              {/* アビリティ分析 */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-800 text-center">✨ きみのとくちょう</h3>
                <div className="space-y-3">
                  <div className="border border-gray-300 p-3 text-center">
                    <h4 className="text-lg font-bold text-gray-800 mb-2">🌟 とくい分野</h4>
                    <p className="text-lg font-bold text-green-600">
                      {userData.analysis.strongest}
                    </p>
                  </div>
                  <div className="border border-gray-300 p-3 text-center">
                    <h4 className="text-lg font-bold text-gray-800 mb-2">🚀 のびしろ</h4>
                    <p className="text-lg font-bold text-blue-600">
                      {userData.analysis.weakest}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 右側: アビリティグラフ */}
            <div className="border-2 border-gray-300 p-4">
              <h3 className="text-xl font-bold text-gray-800 pb-4 mb-4 border-b border-gray-200 text-center">
                📈 アビリティグラフ
              </h3>
              <div className="h-80 mt-2">
                <RadarChart abilities={userData.abilities} />
              </div>
            </div>
          </div>


          {/* 保存状態表示 */}
          <div className="text-center mb-4 mt-4">
            {saveStatus === 'saving' && (
              <div className="text-blue-700 font-bold py-2 px-4 text-sm">
                💾 データを保存しています...
              </div>
            )}
            {saveStatus === 'success' && (
              <div className="text-green-700 font-bold py-2 px-4 text-sm">
                ✅ データが保存されました！
              </div>
            )}
            {saveStatus === 'error' && (
              <div className="text-red-700 font-bold py-2 px-4 text-sm">
                ⚠️ データの保存に失敗しました
              </div>
            )}
          </div>

          {/* ボタンエリア */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleReset}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors shadow-md"
              >
                🔄 さいしょから
              </button>
              <button
                onClick={handleFinish}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-10 rounded-lg text-xl transition-colors shadow-md"
              >
                🏁 おわり
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}