# Markdown PDF Converter

技術書典で使えれば良いなと思って作ってるヤツ。  
MarkdownをHTML変換してVivliostyleでレンダリング → Chromeの印刷機能を使ってPDF化

**ISSUE / PR 募集してます！**

## 使い方

まずはパッケージをインストール

```bash
npm install
```

**バージョン指定しないとpdf化されないので、package-lock.jsonそのままで`npm`で動かす。**

`config.json`を編集。

- `template`: Markdown変換後のHTMLテンプレートファイルパス（Mustache形式）
- `article`: 本文用Markdownファイルパス
- `styles`: 適用するCSSファイルパスのリスト（highlight.jsのstyleも指定して下さい）
- `dist`: 出力ファイルパス

~~`npm run start`でPDF変換開始。~~
`make render`でVivliostyle Viewerが開きます。ブラウザの印刷機能を使ってPDF化してください。

※ Chromeの場合、印刷オプションの「背景のグラフィック」が有効になっていないと一部のレイアウトが崩れる場合があります。

## 拡張機能

### 読み込んでいるプラグイン

- [画像のサイズ指定(markdown-it-imsize)](https://github.com/tatsy/markdown-it-imsize)

### 画像の自動読み込み

画像要素は、config.jsonで指定されたimages_dirフォルダ内に配置された画像ファイルを自動的に読み込みます。

```md
![sample.png](sample.png)
```

### 画像のキャプション設定

画像にtitle属性を付与するとキャプションが表示されます。

```md
![sample.png](images/sample.png "sample.png")
```

### 改ページ

`;;;`で改ページを挿入します。（前後に改行がないと動かないかも）

## 今後対応したいところ

- 表紙（タイトルとか作者名埋め込めるようにしたい）
- ~~画像埋め込み~~
- ページ番号設定
- フォント埋め込み

## 既知のバグ

- `github.css`を適用するとコードをコピー＆ペーストしたときに改行が崩れる。
- cssのセレクタにワイルドカードを使うと正しく範囲選択ができない。
