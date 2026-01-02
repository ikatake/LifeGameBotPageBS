# デバッグ手順（修正版）

## 重要：まずファイルの読み込み確認

### 1. Networkタブでリソースの読み込み確認
1. サーバー上のindex.htmlにアクセス（F5で再読み込み）
2. F12キーで開発者ツールを開く
3. **Network**タブを選択
4. **以下のファイルが正しく読み込まれているか確認**：
   - `index.html` - ステータス200（OK）
   - `lgbplayer.js` - ステータス200（OK）
   - `lgbplayer.css` - ステータス200（OK）
   - `lgbplayer.cgi?call=reload` - ステータス200（OK）
   
   **赤字（404や500エラー）があれば、そのファイルのパスが間違っています**

### 2. Consoleタブでエラー確認
1. **Console**タブを選択
2. **赤いエラーメッセージがないか確認**
   - `Uncaught ReferenceError` - 関数や変数が定義されていない
   - `Failed to load resource` - ファイルが見つからない
   - `SyntaxError` - 構文エラー
3. `console.log(newest)`と入力してEnter
   - `undefined`と表示される = `proc_onload()`が実行されていない
   - オブジェクトが表示される = CGIからのデータ取得は成功している

### 3. CGIのレスポンス確認
1. **Network**タブで`lgbplayer.cgi?call=reload`をクリック
2. **Headers**タブ：
   - Status Code: 200 OK であることを確認
3. **Response**タブ：
   - JSON形式で`{"run":6,"gene":49,"state":"..."}`のようなデータが返っているか確認
   - エラーメッセージやHTML（CGIエラー）が返っていないか確認

## 2. CGIにデバッグ出力を追加（一時的）

lgbplayer.cgiの`load_current()`関数を以下のように修正：

```perl
sub load_current {
	my $state_str = "";
	my $fname = "/home/ikatake/local/bslg/state.txt";
	my $str = "";
	my $gene = 0;
	my $run = 0;
	my $data;
	
	# デバッグ用ログファイル
	open(my $debug_fh, ">", "/home/ikatake/local/bslg/debug.log");
	
	open( my $fh, "<", $fname )
        	or die "Cannot open $fname: $!";
	while( my $line = readline($fh)) {
		print $debug_fh "Line: [$line]\n";
		my @column = split(/\t/, $line);
		print $debug_fh "Column count: " . ($#column + 1) . ", Index: $#column\n";
		print $debug_fh "Column[0]: [$column[0]]\n" if defined $column[0];
		print $debug_fh "Column[1]: [$column[1]]\n" if defined $column[1];
		
		if( $#column != 1 ) {#状態の読込み
			$state_str .= $line;
			print $debug_fh "-> State line\n";
		}	
		elsif( $column[0] eq 'gene' ) {
			$gene = int($column[1]);
			print $debug_fh "-> Gene: $gene\n";
		}
		elsif( $column[0] eq 'run' ) {
			$run = int($column[1]);
			print $debug_fh "-> Run: $run\n";
		}			
	}
	close $fh;
	close $debug_fh;

	$data = {
		run => $run,
		gene => $gene,
		state => $state_str,
	};
	return $data;
}
```

修正後、サーバーにアップロードしてアクセスし、`/home/ikatake/local/bslg/debug.log`の内容を確認してください。

## 3. 簡易確認

開発者ツールのConsoleタブで以下を実行：
```javascript
console.log(newest);
```

newestオブジェクトにrunとgeneの値が正しく入っているか確認してください。
