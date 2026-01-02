var pathCgi = './lgbplayer.cgi';
var handleContent;
var req;
var divNode;
var obj, newest;
var ancImg;
var arlen;
var pauseState, repeatState, shuffleState;
var intvID;
var elTwtGene, elTwtRun, elPlayButton, elRepeatButton, elShuffleButton;
var elPlayButtonImage, elShuffleButtonImage, elRepeatButtonImage;
var shirtColor;
//ページ読み込み時の処理を行う。
function proc_onload() {
	//通信用オブジェクト
	req = new XMLHttpRequest();
	//contentに紐付け。
	/*
	handleContent = document.getElementById('lgbplayer');
	var div = document.createElement('div');
	divNode = handleContent.appendChild(div);
	*/
	elTwtGene = document.getElementById('tweet_gene_pb');
	elTwtRun = document.getElementById('tweet_run_pb');
	ancImg = document.getElementById('stateimg');
	elPlayButton = document.getElementById('play');
	elRepeatButton = document.getElementById('repeat');
	elShuffleButton = document.getElementById('shuffle');
	elPlayButtonImage = elPlayButton.firstChild;
	elShuffleButtonImage = elShuffleButton.firstChild
	elRepeatButtonImage = elRepeatButton.firstChild;
	//サーバ側が準備出来たら、readData関数を呼ぶ。
	req.onreadystatechange = readData;
	obj = new State();
	//要求を送る
	req.open("get", pathCgi+"?call=reload", true);
	req.send("");
	setPauseState(true);
	setShuffleState(false);
	setRepeatState("one");
}
function proc_onload_measure() {
	req = new XMLHttpRequest();
	req.onreadystatechange = readDataMeasure;
	req.open("get", pathCgi+"?call=measure", true);
	req.send("");
}
function t_shirt_pb(color) {
	shirtColor = color;
	var run = parseInt(getValue('run'));
	var gene = parseInt(getValue('gene'));
	var add = "product.rb?material=t_shirt&run=" + run;
	add = add + "&gene=" + gene + "&color=" + color;
	window.open(add, "t_shirt.rb");
/*
	req = new XMLHttpRequest();
	req.onreadystatechange = readDataWear;
	req.open("get", pathCgi+"?call=jump&run="+run+"&gene="+gene, true);
	req.send("");
*/
}
function sticker_pb(color) {
	var run = parseInt(getValue('run'));
	var gene = parseInt(getValue('gene'));
	var add = "product.rb?material=sticker&run=" + run;
	add = add + "&gene=" + gene + "&color=" + color;
	window.open(add, "sticker.rb");
}
function can_badge_pb(color) {
	var run = parseInt(getValue('run'));
	var gene = parseInt(getValue('gene'));
	var add = "product.rb?material=can_badge&run=" + run;
	add = add + "&gene=" + gene + "&color=" + color;
	window.open(add, "can_badge.rb");
}
function handkerchief_pb(color) {
	var run = parseInt(getValue('run'));
	var gene = parseInt(getValue('gene'));
	var add = "product.rb?material=handkerchief&run=" + run;
	add = add + "&gene=" + gene + "&color=" + color;
	window.open(add, "handkerchief.rb");
}
function hoodie_pb(color) {
	var run = parseInt(getValue('run'));
	var gene = parseInt(getValue('gene'));
	var add = "product.rb?material=hoodie&run=" + run;
	add = add + "&gene=" + gene + "&color=" + color;
	window.open(add, "hoodie.rb");
}
function jump() {
	var run = parseInt(getValue('run'));
	var gene = parseInt(getValue('gene'));
	if( jump2(run, gene) == -1){
//		alert("shit!");
	}
}
function jump2(run, gene) {
	if( isExist(run, gene) != true ) {
		return -1;	
	}
	obj.run = run;
	obj.gene = gene;
	setImg(run, gene);
	setTweetButton(run, gene);
	setValue('run', obj.run);
	setValue('gene', obj.gene);
	return 0;
}
function play() {
	if(pauseState == true) {
		setPauseState(false);
	} else {
		setPauseState(true);
	}
}
function increase() {
	if(obj.gene < (arlen[obj.run] - 1) ) {//今のgeneはケツではない
		jump2(obj.run, obj.gene+1);
	} else {//ケツです。
		if(repeatState == "one") {//repeatoneで繰り返し。
			jump2(obj.run, 0);
		}
		else if(repeatState == "all") {//repeatallでnextする。
			next();
		}
	}
}
function prev() {
	setPauseState(true);
	if(obj.gene == 0) {
		var run = obj.run;
		while(1) {
			run--;
			if(-1 != jump2(run, 0)) {
				break;
			}
		}
	} else {
		jump2(obj.run, 0);
	}
}
function next() {
	//
	var run = undefined;
	var rtn;
	if(shuffleState == true) {
		while(1) {
			run = Math.floor(Math.random()*newest.run) + 1;
			if(-1 != jump2(run, 0)) {
				break;
			}
		}
	} else if(obj.run == newest.run) {
		if(repeatState == "all") {
			jump2(1, 0);
		}
	} else {
		run = obj.run;
		while(1) {
			run++;
			if(-1 != jump2(run, 0)) {
				break;
			}
		}
	}
}
function shuffle() {
	if(shuffleState == true) {
		setShuffleState(false);
	} else {
		setShuffleState(true);
	}
}
function repeat() {
	if(repeatState == "all") {
		setRepeatState("off");
	} else if(repeatState == "one") {
		setRepeatState("all");
	} else {
		setRepeatState("one");
	}
}
function setPauseState(_pauseState) {
	if(pauseState == _pauseState) {
		return;
	}
	pauseState = _pauseState;
	if(pauseState == true) {
		clearInterval(intvID);
		elPlayButton.style.backgroundColor = "#FFFFFF";
		elPlayButtonImage.setAttribute("title", "停止中");
	} else {
		intvID = setInterval(function() { increase(); }, 500);
		elPlayButton.style.backgroundColor = "#2E8B57";
		elPlayButtonImage.setAttribute("title", "再生中");
	}
}
function setShuffleState(_shuffleState) {
	if(shuffleState == _shuffleState) {
		return;
	}
	shuffleState = _shuffleState;
	if(shuffleState == true) {
		elShuffleButton.style.backgroundColor = "#2E8B57";
		elShuffleButtonImage.setAttribute("title", "シャッフル　オン");
	} else {
		elShuffleButton.style.backgroundColor = "#FFFFFF";
		elShuffleButtonImage.setAttribute("title", "シャッフル　オフ");
	}
}
function setRepeatState(_repeatState) {
	if(repeatState == _repeatState) {
		return;
	}
	repeatState = _repeatState;
	if(repeatState == "all") {
		elRepeatButton.style.backgroundColor = "#2E8B57";
		elRepeatButtonImage.setAttribute("src", "./lgbpimg/repeatALL.png");
		elRepeatButtonImage.setAttribute("title", "リピート(全て)");
	} else if(repeatState == "one") {
		elRepeatButton.style.backgroundColor = "#2E8B57";
		elRepeatButtonImage.setAttribute("src", "./lgbpimg/repeat1.png");
		elRepeatButtonImage.setAttribute("title", "リピート(世代)");
	} else {
		elRepeatButton.style.backgroundColor = "#FFFFFF";
		elRepeatButtonImage.setAttribute("src", "./lgbpimg/repeat.png");
		elRepeatButtonImage.setAttribute("title", "リピート　オフ");
	}
}
//受信用関数
function readData() {
	if(req.readyState == 4) {
		newest = JSON.parse(req.responseText);
		console.log(newest);
		newest.run = parseInt(newest.run);
		newest.gene = parseInt(newest.gene);
		//表示用文字列を生成
		/*
		var str = "run:" + newest.run + "  ";
		str += "gene:" + newest.gene;
		var div = document.createElement('div');
		handleContent.removeChild(divNode);
		divNode = handleContent.appendChild(div);
		div.innerHTML = str;
		*/
		setValue('run', newest.run);
		setValue('gene', newest.gene);
		arlen = new Array();
		arlen[newest.run] = newest.gene;
		setGifs();
		proc_onload_measure();
	}
}
function readDataMeasure() {
	if(req.readyState == 4) {
		var tmp_obj = JSON.parse(req.responseText);
		console.log(tmp_obj);
		for(var ii = 0; ii < tmp_obj.length; ii++) {
			var run = parseInt(tmp_obj[ii].run);
			var len = parseInt(tmp_obj[ii].length);
			arlen[run] = len;
		}
		jump2(parseInt(newest.run), parseInt(newest.gene));
	}
}
function setImg(run, gene) {
	var fname = "http://www.wetsteam.org/LifeGameBotBS/stateLogs/";
	fname += ("00000000" + run).slice(-8) + "/"; 
	fname += ("00000000" + gene).slice(-8) + ".svg";
	ancImg.setAttribute("src", fname);
	ancImg.setAttribute("alt", "r:" + run + ", g:" + gene);
}
function setGifs()
{
	var anc = document.getElementById('newgifs');
	var gifimgs = anc.children;
	for(var ii = 1; ii <= 5 && newest.run - ii > 0; ii++)
	{
		//var img = document.createElement('img');
		var fname = "http://www.wetsteam.org/LifeGameBotBS/gifs/";
		var run = newest.run - ii;
		fname += ("00000000" + run).slice(-8) + ".gif";
		//img.setAttribute("src", fname);
		//img.setAttribute("alt", run);
		gifimgs[ii-1].setAttribute("src", fname);
		gifimgs[ii-1].setAttribute("alt", run);
		gifimgs[ii-1].setAttribute("title", run);
		//anc.appendChild(img);
	}
}
/*
	getValue : 指定したDOM要素の値を取得する
	element : 取得するDOM要素のid
	戻り値 : 指定したDOM要素の値。
*/
function getValue(element) {
	var elem = document.getElementById(element);
	if(null == elem) {
		console.log("funtion getValue\t"+element+"is null\n");
		return null;
	}
	return elem.value;
}
/*
	setvalue : DOM要素に指定の値を書き込む。
	element : 値を書き込むDOM要素のid
	value : 値
	戻り値 : DOM要素が無ければnull、それ以外は1。
*/
function setValue(element, value) {
	var elem = document.getElementById(element);
	if(null == elem) {
		console.log("funtion setValue\t"+element+"is null\n");
		return null;
	}
	elem.value = value;
	return 0;
}
/*
	inExist : 指定のrun, geneがstateLogにあるか確認する。
	run, gene : 実行回数と世代数の数値
	戻り値 : 存在していればtrue。無ければfalse
*/
function isExist(run, gene) {
	if(run > newest.run) {
		return false;
	}
	if(gene < arlen[run]) {
		return true;
	} else {
		return false;
	}
	return undefined;
}
function setTweetButton(run, gene) {
	var txHref = "https://twitter.com/intent/tweet?source=webclient&amp;";
	var txGene = txHref + "text=LifeGameBot(@_lifegamebot)%0d%0a";
	var txRun = txGene;
	var strAdd  = "http://www.wetsteam.org/LifeGameBotBS/";
	var strGene = ("00000000" + gene).slice(-8);
	var strRun = ("00000000" + run).slice(-8);
	txGene += "run:" + run + " gene:" + gene + "%0d%0a";
	txRun += "run:" + run + "%0d%0a";
	txGene += strAdd + "stateLogs/" + strRun + "/" + strGene + ".svg%0d%0a";
	txRun += strAdd + "gifs/" + strRun + ".gif";
	txGene = "window\.open\(\'" + txGene + "\'\)";
	txRun = "window\.open\(\'" + txRun + "\'\)";
	if(elTwtGene != undefined) {
		elTwtGene.setAttribute('onclick', txGene);
	}
	if(elTwtRun != undefined) {
		elTwtRun.setAttribute('onclick', txRun);
		if(run >= newest.run) {
			elTwtRun.setAttribute('disabled', "disabled");
		} else {
			elTwtRun.removeAttribute('disabled');

		}
	}
}
function State() {
	this.run = undefined;
	this.gene = undefined;
}
//ページ読み込み時にproc_onloadを起動。
window.onload=proc_onload;
function setArrayState(ar, str) {
	var ii = 0;
	var idx = 0;
	while(str.charAt(ii) != '') {
		if(str.charAt(ii) == '1') {
			ar[idx] = true;
			idx++;
		}
		else if(str.charAt(ii) == '0') {
			ar[idx] = false;
			idx++
		}
		ii++;
	}
}
