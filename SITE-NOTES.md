# 食堂うめぼし 天神南 — 2026-11-15 更新

## デザインと実装
- ひよりの生成りの暖簾を参考に、自然なページスクロールで暖簾が持ち上がるHEROへ更新。
- home.css / home.js はトップ専用。動きを減らす設定とLINE内ブラウザでは静止表示。スクロールを横取りしない。
- images/noren-hero.jpg は今回生成した料理イメージ（1536×1024、約292KB）。Google Mapsで確認した茶色の器・白い受け皿・白ねぎをのせた肉豆腐の盛り付けを参考にした新規画像。
- 店内などは既存のサイト画像を継続使用。
- GitHub Pagesの /umeboshi-tenjinminami-site/ 配信を維持。partialsのパスはcommon.jsの設置場所から解決。
- ブログは posts.json / files collectionを維持。本文サニタイズ、画像URL検証を維持。記事リンクとcanonicalを?slug=へ統一。旧ハッシュ記事リンクも互換対応。
- 既存ブログ記事本文・メニュー価格は今回変更していない。

## 確認した店舗情報
2026-11-15、ユーザー指定のGoogle Mapsの営業時間詳細で月〜日すべて11:30〜0:00を確認。食べログにも11:30開店の掲載あり。電話番号092-791-7815はGoogle Maps・公式トレタ両方で確認。
- Google Maps: https://maps.app.goo.gl/VyFXurxY9VhCb3566
- 食べログ: https://tabelog.com/fukuoka/A4001/A400103/40060894/
- 公式予約: https://yoyaku.toreta.in/umeboshi-tenjinminami/
- 公式予約ページの案内に合わせ、当日予約は電話と記載。

## 検証と残り
- HTML 7ファイル、ローカル参照54件、JS構文6件、sitemapの実在ページ確認が成功。
- 暖簾の前進・逆スクロール・ボタン、動きを減らす設定、LINE、ブログテキスト安全化、CMS画像のサブパス解決、遅延読込GAイベントをNodeの独立実行テストで確認。
- ローカルHTTPサーバーは環境制限のOperation not permittedにより起動不可。ブラウザはfile URL非対応のため画面・実機の最終確認は未実施。
- GA4の既存G-XXXXXXXXXXは実IDではないため削除。analytics.jsのmeasurementIdにこの店舗の実IDを設定すると有効になる。イベントはphone_click / reservation_click。
- 独自ドメインは未設定のまま。公開済みと案内する前にpushとGitHub Pagesへの反映を確認する。
