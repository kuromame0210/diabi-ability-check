'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  scoreProblem1,
  scoreProblem2,
  scoreProblem3,
  scoreProblem4,
  scoreProblem5,
  scoreProblem6,
  scoreProblem7,
  scoreProblem8,
  calculateAbilities,
  analyzeAbilities,
  getCurrentDateTime,
  saveUserData
} from '@/lib/utils';
import { getAllProblemAbilities } from '@/lib/problem-abilities';
import { UserData } from '@/types';
import Background from '@/components/Background';
import Card from '@/components/Card';

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
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error' | 'retrying'>('idle');
  const [isDataReady, setIsDataReady] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [backgroundSaveActive, setBackgroundSaveActive] = useState<boolean>(false);
  const [showDebugInfo, setShowDebugInfo] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // ローカルストレージからデータを取得
    const name = localStorage.getItem('userName');
    const problem1Answers = JSON.parse(localStorage.getItem('problem1Answers') || '{}');
    const problem2Answers = JSON.parse(localStorage.getItem('problem2Answers') || '[]');
    const problem3Score = parseFloat(localStorage.getItem('problem3_score') || '0');
    const problem3Answers = JSON.parse(localStorage.getItem('problem3_answers') || '[]');
    const problem4Answers = JSON.parse(localStorage.getItem('problem4Answers') || '[]');
    const problem5Answer = localStorage.getItem('problem5Answer') || '';
    const problem6Answer = parseInt(localStorage.getItem('problem6Answer') || '0');
    const problem7Answers = JSON.parse(localStorage.getItem('problem7Answers') || '{}');
    const problem8Answers = JSON.parse(localStorage.getItem('problem8Answers') || '{}');
    const startTime = localStorage.getItem('testStartTime') || '';
    const problem1Time = localStorage.getItem('problem1Time') || '';
    const problem2Time = localStorage.getItem('problem2Time') || '';
    const problem3Time = localStorage.getItem('problem3_time') || '';
    const problem4Time = localStorage.getItem('problem4Time') || '';
    const problem5Time = localStorage.getItem('problem5Time') || '';
    const problem6Time = localStorage.getItem('problem6Time') || '';
    const problem7Time = localStorage.getItem('problem7Time') || '';
    const problem8Time = localStorage.getItem('problem8Time') || '';

    if (!name) {
      router.push('/');
      return;
    }

    const endTime = getCurrentDateTime();

    // 得点計算
    const problem1Score = scoreProblem1(problem1Answers);
    const problem2Score = scoreProblem2(problem2Answers);
    const problem3ScoreValue = scoreProblem3(problem3Score);
    const problem4Score = scoreProblem4(problem4Answers);
    const problem5Score = scoreProblem5(problem5Answer);
    const problem6Score = scoreProblem6(problem6Answer);
    const problem7Score = scoreProblem7(problem7Answers);
    const problem8Score = scoreProblem8(problem8Answers);
    const totalScore = problem1Score + problem2Score + problem3ScoreValue + problem4Score + problem5Score + problem6Score + problem7Score + problem8Score;

    // アビリティ計算
    const abilities = calculateAbilities(problem1Score, problem2Score, problem3ScoreValue, problem4Score, problem5Score, problem6Score, problem7Score, problem8Score);
    const analysis = analyzeAbilities(abilities);

    const userData: UserData = {
      name,
      testDate: endTime.date,
      testTime: endTime.time,
      answers: {
        problem1: problem1Answers,
        problem2: problem2Answers,
        problem3: problem3Answers,
        problem4: problem4Answers,
        problem5: problem5Answer,
        problem6: problem6Answer,
        problem7: problem7Answers,
        problem8: problem8Answers,
      },
      scores: {
        problem1: problem1Score,
        problem2: problem2Score,
        problem3: problem3ScoreValue,
        problem4: problem4Score,
        problem5: problem5Score,
        problem6: problem6Score,
        problem7: problem7Score,
        problem8: problem8Score,
        total: totalScore,
      },
      abilities,
      analysis,
      timestamps: {
        start: startTime,
        problem1: problem1Time,
        problem2: problem2Time,
        problem3: problem3Time,
        problem4: problem4Time,
        problem5: problem5Time,
        problem6: problem6Time,
        problem7: problem7Time,
        problem8: problem8Time,
        end: endTime.full,
      },
    };

    // Google Sheets に保存完了後に結果表示
    handleSaveDataAndShow(userData);
  }, [router]);

  const handleSaveDataAndShow = useCallback(async (data: UserData) => {
    setSaveStatus('saving');

    try {
      const success = await saveUserData(data);

      if (success) {
        setSaveStatus('success');
        setUserData(data);
        setIsDataReady(true);
      } else {
        // 保存失敗時は結果表示しつつ裏でリトライ
        setSaveStatus('error');
        setUserData(data);
        setIsDataReady(true);
        startBackgroundRetry(data);
      }
    } catch (error) {
      console.error('Save error:', error);
      // エラー時も結果表示しつつ裏でリトライ
      setSaveStatus('error');
      setUserData(data);
      setIsDataReady(true);
      startBackgroundRetry(data);
    }
  }, []);

  const startBackgroundRetry = async (data: UserData) => {
    setBackgroundSaveActive(true);
    const maxRetries = 3;
    const retryDelay = 5000; // 5秒間隔

    for (let i = 1; i <= maxRetries; i++) {
      setRetryCount(i);
      setSaveStatus('retrying');

      // 遅延
      await new Promise(resolve => setTimeout(resolve, retryDelay));

      try {
        const success = await saveUserData(data);

        if (success) {
          setSaveStatus('success');
          setBackgroundSaveActive(false);
          return;
        }
      } catch (error) {
        console.error(`Retry ${i} failed:`, error);
      }
    }

    // 全てのリトライが失敗
    setSaveStatus('error');
    setBackgroundSaveActive(false);
  };

  // const handleFinish = () => {
  //   // ローカルストレージをクリア
  //   localStorage.removeItem('userName');
  //   localStorage.removeItem('problem1Answers');
  //   localStorage.removeItem('problem2Answers');
  //   localStorage.removeItem('problem3_answers');
  //   localStorage.removeItem('problem3_score');
  //   localStorage.removeItem('problem3_time');
  //   localStorage.removeItem('problem4Answers');
  //   localStorage.removeItem('problem4Time');
  //   localStorage.removeItem('problem5Answer');
  //   localStorage.removeItem('problem5Time');
  //   localStorage.removeItem('problem6Answer');
  //   localStorage.removeItem('problem6Time');
  //   localStorage.removeItem('problem7Answers');
  //   localStorage.removeItem('problem7Time');
  //   localStorage.removeItem('problem8Answers');
  //   localStorage.removeItem('problem8Time');
  //   localStorage.removeItem('testStartTime');
  //   localStorage.removeItem('problem1Time');
  //   localStorage.removeItem('problem2Time');

  //   // トップページに戻る
  //   router.push('/');
  // };

  const handleReset = () => {
    // ローカルストレージをクリア（最初からやり直し）
    localStorage.removeItem('userName');
    localStorage.removeItem('problem1Answers');
    localStorage.removeItem('problem2Answers');
    localStorage.removeItem('problem3_answers');
    localStorage.removeItem('problem3_score');
    localStorage.removeItem('problem3_time');
    localStorage.removeItem('problem4Answers');
    localStorage.removeItem('problem4Time');
    localStorage.removeItem('problem5Answer');
    localStorage.removeItem('problem5Time');
    localStorage.removeItem('problem6Answer');
    localStorage.removeItem('problem6Time');
    localStorage.removeItem('problem7Answers');
    localStorage.removeItem('problem7Time');
    localStorage.removeItem('problem8Answers');
    localStorage.removeItem('problem8Time');
    localStorage.removeItem('testStartTime');
    localStorage.removeItem('problem1Time');
    localStorage.removeItem('problem2Time');

    // トップページに戻る
    router.push('/');
  };

  if (!isDataReady || !userData) {
    return (
      <Background>
        <Card>
          <div className="h-full flex flex-col items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 mb-4">
                {saveStatus === 'saving' && '📊 結果を保存中...'}
                {saveStatus === 'success' && '✅ 保存完了！結果を表示中...'}
                {saveStatus === 'error' && '⚠️ 保存エラーが発生しましたが、結果を表示します...'}
                {saveStatus === 'idle' && '📋 結果を計算中...'}
              </div>

              {/* ローディングアニメーション */}
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
              </div>

              {/* 保存状態の詳細表示 */}
              <div className="mt-4 text-sm text-gray-600">
                {saveStatus === 'saving' && 'スプレッドシートにデータを保存しています...'}
                {saveStatus === 'success' && '結果がスプレッドシートに保存されました！'}
                {saveStatus === 'error' && 'スプレッドシートへの保存に失敗しましたが、結果は表示できます。'}
                {saveStatus === 'idle' && 'テスト結果を準備しています...'}
              </div>
            </div>
          </div>
        </Card>
      </Background>
    );
  }

  return (
    <Background>
      <Card>
        <div className="h-full flex flex-col overflow-y-auto">
          {/* リトライ状態通知バー */}
          {backgroundSaveActive && (
            <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-3"></div>
                <span className="text-sm font-medium text-blue-700">
                  {saveStatus === 'retrying' && `データ保存を再試行中... (${retryCount}/3)`}
                </span>
              </div>
            </div>
          )}

          {/* 保存成功通知 */}
          {saveStatus === 'success' && !backgroundSaveActive && (
            <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 rounded">
              <div className="flex items-center">
                <span className="text-sm font-medium text-green-700">
                  ✅ データがスプレッドシートに保存されました！
                </span>
              </div>
            </div>
          )}

          {/* 最終保存失敗通知 */}
          {saveStatus === 'error' && !backgroundSaveActive && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded">
              <div className="flex items-center">
                <span className="text-sm font-medium text-red-700">
                  ⚠️ データの保存に失敗しました。結果は表示されています。
                </span>
              </div>
            </div>
          )}

          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            けっか
          </h2>

          {/* メインレイアウト: 左に基本情報・右にグラフ */}
          <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
            {/* 左側: 基本情報、問題結果、アビリティ分析 */}
            <div className="flex-1 space-y-4">
              {/* 基本情報 */}
              <div className="border-2 border-gray-300 p-4 text-center">
                <div className="text-xl font-bold text-gray-800 mb-3">
                  👤 なまえ: {userData.name}
                </div>
                <div className="text-2xl font-bold text-blue-600 py-2">
                  とくてん: {userData.scores.total}/20点
                </div>
              </div>



              {/* アビリティ分析 */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-800 text-center">あなたのとくちょう</h3>
                <div className="space-y-3">
                  <div className="border border-gray-300 p-3 text-center">
                    <h4 className="text-lg font-bold text-gray-800 mb-2">とくい分野</h4>
                    <div className="text-lg font-bold text-green-600">
                      {userData.analysis.strongest.length === 0 ? (
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-gray-500">-</span>
                        </div>
                      ) : userData.analysis.strongest.length === 4 ? (
                        <div className="flex items-center justify-center gap-2">
                          <span>すべての分野</span>
                        </div>
                      ) : (
                        userData.analysis.strongest.map((field, index) => (
                          <div key={index} className="flex items-center justify-center gap-3 mb-2">
                            <img src={field.icon} alt={field.name} className="w-12 h-12" />
                            <span className="flex flex-col">
                              <span className="text-2xl">{field.name}</span>
                              <span className="text-base text-gray-500">({field.nameHiragana})</span>
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="border border-gray-300 p-3 text-center">
                    <h4 className="text-lg font-bold text-gray-800 mb-2">のびしろ</h4>
                    <div className="text-lg font-bold text-blue-600">
                      {userData.analysis.weakestAll.length === 0 ? (
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-gray-500">-</span>
                        </div>
                      ) : userData.analysis.weakestAll.length === 4 ? (
                        <div className="flex items-center justify-center gap-2">
                          <span>すべての分野</span>
                        </div>
                      ) : (
                        userData.analysis.weakestAll.map((field, index) => (
                          <div key={index} className="flex items-center justify-center gap-3 mb-2">
                            <img src={field.icon} alt={field.name} className="w-12 h-12" />
                            <span className="flex flex-col">
                              <span className="text-2xl">{field.name}</span>
                              <span className="text-base text-gray-500">({field.nameHiragana})</span>
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ボタンエリア */}
              <div className="text-center">
                <div className="flex flex-col gap-3 justify-center items-center max-w-xs mx-auto">
                  <button
                    onClick={handleReset}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-base transition-colors shadow-md"
                  >
                    さいしょから
                  </button>
                  {/* 詳細結果切り替えボタン */}
                  <button
                    onClick={() => setShowDebugInfo(!showDebugInfo)}
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg text-base transition-colors shadow-md"
                  >
                    {showDebugInfo ? '詳細を非表示' : '詳細結果を見る'}
                  </button>
                </div>
              </div>
            </div>

            {/* 右側: アビリティグラフ */}
            <div className="flex-1 border-2 border-gray-300 p-4 min-h-[450px]">
              <h3 className="text-xl font-bold text-gray-800 pb-4 mb-4 border-b border-gray-200 text-center">
                📈 アビリティグラフ
              </h3>
              <div className="mt-2 h-[380px]">
                <RadarChart abilities={userData.abilities} />
              </div>
            </div>
          </div>

          {/* 問題別結果詳細（モーダル） */}
          {showDebugInfo && userData && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowDebugInfo(false)}>
              <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="sticky top-0 bg-white border-b-2 border-blue-200 p-6 flex items-center justify-between z-10">
                  <h3 className="text-2xl font-bold text-blue-800 flex items-center gap-2">
                    📊 問題別結果詳細
                  </h3>
                  <button
                    onClick={() => setShowDebugInfo(false)}
                    className="text-gray-500 hover:text-gray-700 text-3xl font-bold leading-none"
                  >
                    ×
                  </button>
                </div>
                <div className="p-6">

              {/* 問題別カード表示 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {Object.entries(userData.scores).filter(([key]) => key.startsWith('problem')).map(([key, score]) => {
                  const problemNum = key.replace('problem', '');
                  const abilities = getAllProblemAbilities();
                  const problemAbilities = abilities[key];
                  const answer = userData.answers[key as keyof typeof userData.answers];

                  return (
                    <div key={key} className="bg-white border-2 border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="text-center mb-3">
                        <h4 className="text-lg font-bold text-gray-800">もんだい{problemNum}</h4>
                        <div className="text-2xl font-bold text-blue-600 my-3">
                          {score}/2.5てん
                        </div>

                        {/* アビリティ表示 */}
                        {problemAbilities?.primary && (
                          <div className="flex items-center justify-center gap-2 mb-3">
                            <img src={problemAbilities.primary.icon} alt={problemAbilities.primary.name} className="w-5 h-5" />
                            <span className="text-sm font-medium text-gray-600">{problemAbilities.primary.name}</span>
                          </div>
                        )}

                        {/* 得点バー */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4 mt-3">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              score === 2.5 ? 'bg-green-500' :
                              score === 1 ? 'bg-yellow-500' : 'bg-red-400'
                            }`}
                            style={{ width: `${(score / 2.5) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* 回答データ - 非表示 */}
                      <div className="bg-gray-50 rounded p-3 hidden">
                        <div className="text-xs font-semibold text-gray-600 mb-2">こたえ:</div>
                        <div className="text-sm text-gray-800">
                          {typeof answer === 'object' ? (
                            Array.isArray(answer) ? (
                              // 配列の場合
                              <div className="space-y-1">
                                {answer.map((item, idx) => (
                                  <div key={idx} className="flex gap-2">
                                    <span className="font-semibold">{idx + 1}:</span>
                                    <span>{item}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              // オブジェクトの場合
                              <div className="space-y-1">
                                {Object.entries(answer).map(([k, v]) => {
                                  // キー名を日本語に変換
                                  const keyMap: Record<string, string> = {
                                    'star': '☆',
                                    'heart': '♡',
                                    'triangle': '△',
                                    'circle': '○',
                                    'doubleCircle': '◎',
                                    'filledCircle': '●',
                                    'yellow': 'きいろ',
                                    'green': 'みどり',
                                    'blue': 'あお',
                                    'cyan': 'みずいろ'
                                  };
                                  const displayKey = keyMap[k] || k;

                                  return (
                                    <div key={k} className="flex gap-2">
                                      <span className="font-semibold">{displayKey}:</span>
                                      <span>{String(v)}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            )
                          ) : (
                            // 文字列・数値の場合
                            <div className="font-semibold">{String(answer)}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* サマリー情報 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* アビリティスコア */}
                <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center justify-center gap-2">
                    🎯 アビリティスコア
                  </h4>
                  <div className="space-y-3">
                    {['reading', 'memory', 'cognition', 'attention'].map((ability) => {
                      const score = userData.abilities[ability as keyof typeof userData.abilities];
                      const abilityNames = {
                        reading: '読解',
                        attention: '集中',
                        memory: '記憶',
                        cognition: '認知'
                      };
                      const abilityNamesHiragana = {
                        reading: 'どっかい',
                        attention: 'しゅうちゅう',
                        memory: 'きおく',
                        cognition: 'にんち'
                      };
                      const abilityName = abilityNames[ability as keyof typeof abilityNames];
                      const abilityHiragana = abilityNamesHiragana[ability as keyof typeof abilityNamesHiragana];

                      return (
                        <div key={ability} className="flex items-center gap-4">
                          <span className="font-medium text-gray-700 flex flex-col w-32">
                            <span className="text-base">{abilityName}</span>
                            <span className="text-xs text-gray-500">({abilityHiragana})</span>
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full transition-all"
                                style={{ width: `${(score / 5) * 100}%` }}
                              ></div>
                            </div>
                            <span className="font-mono text-sm font-bold text-blue-600">
                              {score.toFixed(2)}/5.0
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 合計スコア */}
                <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center justify-center gap-2">
                    📈 スコアサマリー
                  </h4>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {userData.scores.total}/20
                    </div>
                    <div className="text-lg text-gray-600 mb-4">ごうけいとくてん</div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all"
                        style={{ width: `${(userData.scores.total / 20) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      せいとうりつ: {((userData.scores.total / 20) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </Card>
    </Background>
  );
}