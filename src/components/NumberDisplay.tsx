/**
 * NumberDisplay Component
 *
 * 数字の羅列を表示するコンポーネント
 * 問題2と練習2で使用
 */

interface NumberDisplayProps {
  numbers: string;
}

export default function NumberDisplay({ numbers }: NumberDisplayProps) {
  return (
    <div className="text-4xl font-bold font-mono text-gray-800 tracking-widest whitespace-nowrap border-2 border-black p-6 bg-white rounded-lg">
      {numbers.split('').join('  ')}
    </div>
  );
}
