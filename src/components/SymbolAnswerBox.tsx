/**
 * SymbolAnswerBox Component
 *
 * 記号（★♥▲）の回答セレクトボックスを表示するコンポーネント
 * 問題1と練習1で使用
 */

interface SymbolAnswerBoxProps {
  symbol: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  showAnswer?: boolean;
  symbolClassName?: string;
  maxOptions?: number;  // 選択肢の最大値（デフォルト3）
  unit?: string;  // セレクトボックスの後に表示する単位（例：「こ」）
}

export default function SymbolAnswerBox({
  symbol,
  label,
  value,
  onChange,
  disabled = false,
  showAnswer = false,
  symbolClassName = 'text-3xl',
  maxOptions = 3,
  unit
}: SymbolAnswerBoxProps) {
  return (
    <div className="flex items-center justify-between p-4 border-2 border-gray-300 mb-4">
      <div className="flex items-center space-x-3">
        <span className={`drop-shadow-lg ${symbolClassName}`}>{symbol}</span>
        <span className="text-xl font-bold text-gray-800">{label}</span>
      </div>
      <div className="flex items-center space-x-3">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || showAnswer}
          className={`w-20 h-16 text-2xl text-center border-2 border-gray-400 rounded-2xl focus:outline-none focus:border-gray-600 focus:ring-2 focus:ring-yellow-200 transition-all font-bold shadow-inner ${showAnswer ? 'bg-green-100' : 'bg-white'}`}
        >
          <option value="">?</option>
          {Array.from({length: maxOptions}, (_, i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
        {unit && <span className="text-xl font-bold text-gray-800">{unit}</span>}
      </div>
    </div>
  );
}
