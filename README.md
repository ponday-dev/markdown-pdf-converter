# Markdown PDF Converter

技術書典で使えれば良いなと思って作ってるヤツ。  
MarkdownをHTML変換してPuppeteerでPDF化。  

**ISSUE / PR 募集してます！**

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

## 拡張機能

### 画像の自動読み込み

画像要素は、config.jsonで指定されたimages_dirフォルダ内に配置された画像ファイルを自動的に読み込みます。

```md
![sample.png](sample.png)
```

### 画像のサイズ指定

画像のサイズを以下のフォーマットで指定できます。

```md
![sample.png $size=200x300](...)
![sample.png $size=width:200](...)
![sample.png $size=200](...)
```

+ `$size=(width)x(height)`でサイズ指定
+ `$size=('width' or 'height'):(value)`でどちらか一方のみサイズ指定
+ `$size=(width)`で幅指定

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
