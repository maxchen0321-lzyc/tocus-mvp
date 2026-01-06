# Metrics 管理頁

## 進入方式
- 入口連結：首頁左上角的 **Metrics**。
- URL：`/admin/metrics`

## 環境變數
需在 `.env.local` 設定以下變數，才能從 Supabase 讀取資料：

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Email confirmation 說明
若 Supabase 專案啟用 Email confirmation，註冊成功後通常**不會**立即建立登入 session，
而是寄出驗證信。前端會提示「已寄送確認郵件，請至信箱完成驗證後再登入」，
使用者需先完成信箱驗證再回到登入流程。

## 本地驗收
1. `npm run dev`
2. 打開 `http://localhost:3000/admin/metrics`
3. 若 Supabase keys 有設定，會顯示 DAU、滑卡數、右滑率、收藏率、閱讀完成率、立場變動幅度等彙總。
