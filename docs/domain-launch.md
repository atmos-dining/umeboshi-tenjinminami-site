# 独自ドメイン公開（2026-11-16）

正規URL: https://umeboshi-tenjinminami.com/
GitHub Pages: atmos-dining/umeboshi-tenjinminami-site、main/root。

## 完了
- Xserver: apex A を185.199.108.153 / 109.153 / 110.153 / 111.153に設定。www CNAMEはatmos-dining.github.io。NSは維持、元々メール用レコードなし。
- GitHub Pages: custom domain登録、証明書承認、HTTPS強制有効。
- トップ・料理・ドリンク・ブログ一覧・記事・サイトマップのHTTPS 200を確認。
- www / HTTP / 旧GitHub Pagesから正規HTTPS URLへのリダイレクトを確認。
- canonical・OGP・Restaurant URL・robots・sitemap・内部リンクを更新。404ページ追加。
- Google Search Console: https://umeboshi-tenjinminami.com/ のURLプレフィックスをHTMLメタタグで所有確認し、サイトマップ送信成功。メタタグは削除しない。
- DNS TXTも登録済み。ドメインプロパティはGoogle側のTXT反映待ちで未確認。URLプレフィックスで検索管理は開始済み。
- GA4: アトモスダイニング株式会社アカウント378307648、プロパティ564400821、ストリーム16348520175、測定ID G-JRWWVXMLTW。日本時間・日本円。phone_click / reservation_clickをキーイベントとして登録（仮の金額なし）。タグの本番反映済み、受信集計はGoogle側の処理待ち。
- CMS: Cloudflare Dashboardで既存ALLOWED_DOMAINSの末尾にumeboshi-tenjinminami.comだけを追加しDeploy。既存ホスト・秘密鍵を保持。新ホストの/auth開始が302を返すことを確認。

## 次回のCMS Worker CLIデプロイ前の必須注意
本番の許可リストは更新済みだが、別フォルダ /Volumes/JIS/AI_AREA/Site/sveltia-cms-auth/wrangler.toml はこの作業の書き込み範囲外。古い設定で再デプロイすると天神南のログインが拒否されるため、同梱cms-domain-sync.patchをその作業フォルダで適用してからデプロイすること。

## 検証
ローカル43リンク/アセット・インラインJS構文・JSON-LD・サイトマップXMLを確認。本番HERO表示もChromeで確認。検索順位やインデックス登録完了、GA4データ受信完了は保証・確認していない。
