# 独自ドメイン公開準備（2026-11-16）

正規URL: https://umeboshi-tenjinminami.com/
ホスティング: GitHub Pages、main/root。DNS: Xserver。

## 切替前の準備済み
- CNAME、canonical、OGP、Restaurant URL、robots、sitemap を新ホストに統一。
- 内部ナビゲーションをルート絶対パスに変更。記事の slug 別 canonical を維持。
- 404ページ、各ページのSNSメタ情報を追加。管理画面は noindex 維持。
- ブログの駅名・営業時間の誤記を本文と整合。

## 公開時に必ず完了する項目（未実施）
1. Xserverログイン後に既存DNSを確認。メール用レコードは保持。
2. GitHub Pages custom domain 設定とDNSの切替を連続して実施する。
3. apex A: 185.199.108.153 / 185.199.109.153 / 185.199.110.153 / 185.199.111.153
4. www CNAME: atmos-dining.github.io
5. 移行ブランチをmainに反映し、pull --rebase後push。HTTPS証明書と強制HTTPSを確認。
6. CMS認証Worker ALLOWED_DOMAINSへ umeboshi-tenjinminami.com を追加してデプロイ。実体は /Volumes/JIS/AI_AREA/Site/sveltia-cms-auth/ （サイトの2階層上）。
7. Search ConsoleドメインプロパティのTXT検証と https://umeboshi-tenjinminami.com/sitemap.xml 送信。
8. GA4の当店用測定IDを取得してanalytics.jsに設定、電話・予約イベントを確認。現在IDは空欄で未計測。
9. apex/www/http/旧Pagesの遷移、全ページ、画像、ブログ、CMSログインを本番確認。

Xserverは現時点で未ログイン。DNS解決も未成立のため、既存サイトを壊さないよう切替変更はmainへ未反映。
