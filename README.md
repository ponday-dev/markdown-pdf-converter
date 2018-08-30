# Markdown PDF Converter

技術書典で使えれば良いなと思って作ってるヤツ。  
MarkdownをHTML変換してPuppeteerでPDF化する。

## 使い方

まずはパッケージをインストール

```bash
npm install
```

`config.json`を編集。

- `template`: Markdown変換後のHTMLテンプレートファイルパス（Mustache形式）
- `article`: 本文用Markdownファイルパス
- `styles`: 適用するCSSファイルパスのリスト（highlight.jsのstyleも指定して下さい）
- `dist`: 出力ファイルパス

`npm run start`でPDF変換開始。

## 既知のバグ

- `github.css`を適用するとコードをコピー＆ペーストしたときに改行が崩れる。
- cssのセレクタにワイルドカードを使うと正しく範囲選択ができない。
