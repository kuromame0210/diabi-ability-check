/**
 * AnswerButton Component
 *
 * 回答ボタンの共通コンポーネント
 * - テキストボタン（緑/オレンジ）
 * - 画像ボタン（next.png）
 * の両方に対応
 */

interface AnswerButtonProps {
  onClick: () => void;
  disabled?: boolean;
  type?: 'text' | 'image';
  text?: string;
  className?: string;
}

export default function AnswerButton({
  onClick,
  disabled = false,
  type = 'text',
  text = 'こたえる',
  className = ''
}: AnswerButtonProps) {
  // 画像ボタンの場合
  if (type === 'image') {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${className}`}
      >
        <img
          src="/image/next.png"
          alt={text}
          className="h-16 w-auto"
        />
      </button>
    );
  }

  // テキストボタンの場合
  const baseClasses = 'rounded-lg font-bold transition-colors shadow-md';

  // オレンジ色で統一
  const buttonClasses = disabled
    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
    : 'bg-orange-500 hover:bg-orange-600 text-white border-2 border-orange-600';

  // サイズのデフォルト（カスタムクラスで上書き可能）
  const defaultSizeClasses = 'px-8 py-3 text-xl';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${buttonClasses} ${defaultSizeClasses} ${className}`}
    >
      {text}
    </button>
  );
}
