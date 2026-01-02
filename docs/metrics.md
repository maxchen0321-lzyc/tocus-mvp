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

## 本地驗收
1. `npm run dev`
2. 打開 `http://localhost:3000/admin/metrics`
3. 若 Supabase keys 有設定，會顯示 DAU、滑卡數、右滑率、收藏率、閱讀完成率、立場變動幅度等彙總。
