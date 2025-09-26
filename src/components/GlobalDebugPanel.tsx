'use client';

import React, { useState, useEffect } from 'react';
import { useDebug } from '../contexts/DebugContext';
import { PROBLEM1_ANSWERS, PROBLEM2_PATTERNS } from '@/lib/constants';
import { MAIN_PATTERN } from '../config/problem3-patterns';

interface ProblemData {
  problemNumber: number;
  answers: unknown;
  correctAnswers: unknown;
  score: number;
  maxScore: number;
  additionalInfo: string;
}

export default function GlobalDebugPanel() {
  const { isVisible, hideDebug } = useDebug();
  const [isMinimized, setIsMinimized] = useState(false);
  const [allProblemsData, setAllProblemsData] = useState<ProblemData[]>([]);

  // localStorage からデータを読み取って更新
  useEffect(() => {
    const updateData = () => {
      const data: ProblemData[] = [];

      // 問題1のデータ
      const problem1Answers = localStorage.getItem('problem1Answers');
      if (problem1Answers) {
        const answers = JSON.parse(problem1Answers);
        const score = calculateProblem1Score(answers);
        data.push({
          problemNumber: 1,
          answers,
          correctAnswers: PROBLEM1_ANSWERS,
          score,
          maxScore: 2.5,
          additionalInfo: "線つなぎ問題"
        });
      }

      // 問題2のデータ
      const problem2Answers = localStorage.getItem('problem2Answers');
      if (problem2Answers) {
        const answers = JSON.parse(problem2Answers);
        const correctAnswers = PROBLEM2_PATTERNS.map(p => p.answer);
        const score = calculateProblem2Score(answers);
        data.push({
          problemNumber: 2,
          answers,
          correctAnswers,
          score,
          maxScore: 2.5,
          additionalInfo: "数字探し問題"
        });
      }

      // 問題3のデータ
      const problem3Score = localStorage.getItem('problem3_score');
      const problem3Answers = localStorage.getItem('problem3_answers');
      if (problem3Score && problem3Answers) {
        const answers = JSON.parse(problem3Answers);
        data.push({
          problemNumber: 3,
          answers,
          correctAnswers: MAIN_PATTERN,
          score: parseFloat(problem3Score),
          maxScore: 2.5,
          additionalInfo: "記憶テスト問題"
        });
      }

      // 問題4-8のデータ（今後追加予定）
      for (let i = 4; i <= 8; i++) {
        const answersKey = i === 4 ? 'problem4Answers' :
                          i === 5 ? 'problem5Answer' :
                          i === 6 ? 'problem6Answer' :
                          i === 7 ? 'problem7Answers' : 'problem8Answers';

        const storedAnswers = localStorage.getItem(answersKey);
        if (storedAnswers) {
          let answers;

          // 問題5と6は文字列/数値として保存されているので、JSON.parseしない
          if (i === 5) {
            answers = storedAnswers; // 文字列のまま
          } else if (i === 6) {
            answers = parseInt(storedAnswers); // 数値に変換
          } else {
            answers = JSON.parse(storedAnswers); // 問題4,7,8はオブジェクト/配列
          }

          const score = calculateProblemScore(i, answers);
          data.push({
            problemNumber: i,
            answers,
            correctAnswers: getCorrectAnswers(i),
            score,
            maxScore: 2.5,
            additionalInfo: getProblemDescription(i)
          });
        }
      }

      setAllProblemsData(data);
    };

    // 初回実行
    updateData();

    // 定期的に更新（localStorageの変化を監視）
    const interval = setInterval(updateData, 1000);

    return () => clearInterval(interval);
  }, []);

  // 採点関数
  const calculateProblem1Score = (answers: Record<string, number>) => {
    const correctCount = Object.entries(answers).reduce((count, [key, value]) => {
      const correctValue = PROBLEM1_ANSWERS[key as keyof typeof PROBLEM1_ANSWERS];
      return count + (value === correctValue ? 1 : 0);
    }, 0);

    if (correctCount === 3) return 2.5;
    if (correctCount === 2) return 1;
    return 0;
  };

  const calculateProblem2Score = (answers: number[]) => {
    const correctCount = answers.reduce((count, answer, index) => {
      return count + (answer === PROBLEM2_PATTERNS[index].answer ? 1 : 0);
    }, 0);

    if (correctCount === 5) return 2.5;
    if (correctCount >= 3) return 1;
    return 0;
  };

  const calculateProblemScore = (problemNum: number, answers: unknown) => {
    // 問題4-8の採点は簡易版（実際の採点ロジックは後で追加）
    if (problemNum === 4 && Array.isArray(answers)) {
      const correctAnswers = [3, 5, 4, 6, 7];
      const correctCount = answers.reduce((count: number, answer: number, index: number) => {
        return count + (answer === correctAnswers[index] ? 1 : 0);
      }, 0);
      return correctCount === 5 ? 2.5 : correctCount === 3 ? 1 : 0;
    }
    if (problemNum === 5 && typeof answers === 'string') {
      return ["ココロ", "ｺｺﾛ"].includes(answers.trim()) ? 2.5 : 0;
    }
    if (problemNum === 6 && typeof answers === 'number') {
      return answers === 7 ? 2.5 : 0;
    }
    if (problemNum === 7 && typeof answers === 'object' && answers !== null) {
      const answerObj = answers as Record<string, number>;
      const correct = {circle: 8, doubleCircle: 7, filledCircle: 8};
      let correctCount = 0;
      if (answerObj.circle === correct.circle) correctCount++;
      if (answerObj.doubleCircle === correct.doubleCircle) correctCount++;
      if (answerObj.filledCircle === correct.filledCircle) correctCount++;
      return correctCount === 3 ? 2.5 : correctCount === 2 ? 1 : 0;
    }
    if (problemNum === 8 && typeof answers === 'object' && answers !== null) {
      const answerObj = answers as Record<string, number>;
      const correct = {yellow: 2, green: 0, blue: 1, cyan: 1};
      let correctCount = 0;
      if (answerObj.yellow === correct.yellow) correctCount++;
      if (answerObj.green === correct.green) correctCount++;
      if (answerObj.blue === correct.blue) correctCount++;
      if (answerObj.cyan === correct.cyan) correctCount++;
      return correctCount === 4 ? 2.5 : correctCount === 3 ? 1 : 0;
    }
    return 0;
  };

  const getCorrectAnswers = (problemNum: number) => {
    if (problemNum === 4) return [3, 5, 4, 6, 7];
    if (problemNum === 5) return ["ココロ", "ｺｺﾛ"];
    if (problemNum === 6) return 7;
    if (problemNum === 7) return {circle: 8, doubleCircle: 7, filledCircle: 8};
    if (problemNum === 8) return {yellow: 2, green: 0, blue: 1, cyan: 1};
    return null;
  };

  const getProblemDescription = (problemNum: number) => {
    const descriptions = {
      4: "視覚認知問題",
      5: "読解問題",
      6: "図形数え問題",
      7: "マーク数え問題",
      8: "色分け数え問題"
    };
    return descriptions[problemNum as keyof typeof descriptions] || "";
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-red-100 border-2 border-red-300 rounded-lg shadow-lg max-w-sm">
      <div className="bg-red-200 px-3 py-2 rounded-t-lg flex justify-between items-center">
        <h3 className="text-sm font-bold text-red-800">
          🔍 全問題デバッグ ({allProblemsData.length}問完了)
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-red-800 hover:text-red-900 text-xs px-2 py-1 rounded"
          >
            {isMinimized ? '□' : '_'}
          </button>
          <button
            onClick={hideDebug}
            className="text-red-800 hover:text-red-900 text-xs px-2 py-1 rounded"
          >
            ✕
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="p-3 text-xs max-h-96 overflow-y-auto">
          <div className="space-y-3">
            {allProblemsData.map((problemData) => (
              <div key={problemData.problemNumber} className="border-b border-red-200 pb-2 last:border-b-0">
                <div className="font-bold text-red-800 mb-1">
                  問題{problemData.problemNumber} - {problemData.additionalInfo}
                </div>

                <div className="mb-1">
                  <span className="font-bold text-red-700">得点: </span>
                  <span className="font-mono bg-white px-1 rounded">
                    {problemData.score}/{problemData.maxScore}点
                  </span>
                </div>

                <div className="mb-1">
                  <span className="font-bold text-red-700">回答: </span>
                  <div className="font-mono bg-white p-1 rounded text-xs mt-1 max-h-16 overflow-y-auto">
                    {typeof problemData.answers === 'object' ? JSON.stringify(problemData.answers, null, 2) : String(problemData.answers)}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-red-700">正解: </span>
                  <div className="font-mono bg-green-50 p-1 rounded text-xs mt-1 max-h-16 overflow-y-auto">
                    {typeof problemData.correctAnswers === 'object' ? JSON.stringify(problemData.correctAnswers, null, 2) : String(problemData.correctAnswers)}
                  </div>
                </div>
              </div>
            ))}

            {allProblemsData.length === 0 && (
              <div className="text-gray-600 text-center">
                まだ完了した問題がありません
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}