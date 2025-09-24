# アビリティチェック アプリケーション ルーティングフロー設計書

## 📋 現在のルーティング構造

```
HOME → EXAMPLE(問題1例題) → PROBLEM1 → PROBLEM2-EXPLANATION → PROBLEM2-EXAMPLE → PROBLEM2 → RESULT
 ↓        ↓                   ↓            ↓                     ↓                ↓         ↓
名前入力   練習                本問         説明                  練習             本問      結果表示
```

## 🎯 設計思想と意図的な実装

### **段階構成の違い**
- **問題1**: 2段階構成（例題→問題）
  - シンプルな線つなぎ問題のため説明不要
  - 例題で十分理解可能
  
- **問題2**: 3段階構成（説明→例題→問題）
  - 数字探し問題で複雑なため事前説明が必要
  - 制限時間や注意事項が多い

### **データ保存タイミング**
```typescript
// HOME: 初期データ保存
localStorage.setItem('userName', name);
localStorage.setItem('testStartTime', new Date().toISOString());

// PROBLEM1: 回答データ保存（オブジェクト形式）
localStorage.setItem('problem1Answers', JSON.stringify({star: '2', heart: '1', triangle: '3'}));
localStorage.setItem('problem1Time', new Date().toISOString());

// PROBLEM2: 回答データ保存（配列形式）
localStorage.setItem('problem2Answers', JSON.stringify(['5', '1', '9', '0', '2']));
localStorage.setItem('problem2Time', new Date().toISOString());
```

### **遷移ロジック**
- **例題ページ**: データ保存なし（練習のため）
- **説明ページ**: データ保存なし（情報提供のため）
- **本問ページ**: 必須データ保存 + 次ステージへ遷移
- **結果ページ**: 全データ統合して表示

## ⚠️ 要注意項目

### **1. 問題形式の違い**
```typescript
// 問題1: 記号ベース（3択）
const answers = { star: '', heart: '', triangle: '' };

// 問題2: インデックスベース（10択 × 5問）
const answers = ['', '', '', '', ''];
```

### **2. 制限時間の違い**
- 問題1: TIMER_DURATION（定数管理）
- 問題2: 30秒（5問セット）
- 例題: 制限なし

### **3. UI/UXパターンの違い**
- **問題1**: 横配置（画像 + 回答エリア）
- **問題2**: 縦配置（数字 + 回答エリア）
- この違いは問題形式に最適化した結果

## 🚀 将来の拡張方針

### **問題3〜8の実装方針**
1. **問題形式調査**: 各問題の特性を確認
2. **段階構成決定**: 
   - シンプル → 2段階（例題→問題）
   - 複雑 → 3段階（説明→例題→問題）
3. **共通パターン特定**: 3問以上同じパターンが出てから共通化

### **ルーティング拡張例**
```
// 8問完成時の想定フロー
HOME → EXAMPLE1 → PROBLEM1 → 
       EXPLANATION2 → EXAMPLE2 → PROBLEM2 → 
       EXAMPLE3 → PROBLEM3 → 
       ... → RESULT
```

### **データ構造の統一課題**
- 現在: 問題1（オブジェクト）、問題2（配列）
- 将来: 統一形式の検討が必要
- 結果計算処理への影響を考慮

## 📝 実装時の注意事項

### **必須チェックポイント**
1. **localStorage保存**: 各本問完了時に必須
2. **タイマー実装**: useEffect cleanup忘れずに
3. **遷移先確認**: 段階構成に応じた正しい遷移
4. **データ形式**: 結果ページとの整合性確認

### **コンポーネント使用ルール**
- **ProblemTitle**: 全問題ページで必須使用
- **Card + Background**: 統一レイアウトパターン
- **左寄せ統一**: 説明文は text-left
- **中央寄せ限定**: 重要要素（タイトル、画像、数字）のみ

この設計により、一貫性を保ちながら柔軟な拡張が可能です。