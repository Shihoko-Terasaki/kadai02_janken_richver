/* APIを呼び出し。名言がランダムに生成される。URLでとってくる。 */
const RANDOM_SENTENCE_URL_API = "https://api.quotable.io/random";
const typeDisplayElement = document.getElementById("typeDisplay");
const typeInputElement = document.getElementById("typeInput");
/* タイマーを要素として宣言。 */
const timer = document.getElementById("timer");

const typeSound = new Audio("./audio/typing-sound.mp3");
const wrongSound = new Audio("./audio/wrong.mp3");
const correctSound = new Audio("./audio/correct.mp3");

/* inputテキスト入力。合っているかどうかの判定 */
/* inputされるたびにEventListenerが呼び出される */
typeInputElement.addEventListener("input", () => {
  /* タイプ音をつける。play関数 */
  typeSound.play();
  typeSound.currentTime = 0;

  /* 文字と文字を比較する */
  /* ディスプレイに表示されてるSpanタグを取得 */
  const sentence = typeDisplayElement.querySelectorAll("span");
  /* 自分で打ち込んだテキストを取得 */
  const arrayValue = typeInputElement.value.split("");
  /*  correctがtrueであれば次のテキストへいく */
  let correct = true;
  sentence.forEach((characterSpan, index) => {
    /* もしランダムなテキストの一文字一文字が、打ち込んだ文字があっていればcorrect */
    /*  characterSpan.classList.remove("correct"); */
    /* もし何も入力していなければcharacterSpanを外したい。不正解ではないので。 */
    if (arrayValue[index] == null) {
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      correct = false;
       
    } else if (characterSpan.innerText == arrayValue[index]) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
    } else {
      characterSpan.classList.add("incorrect");
      characterSpan.classList.remove("correct");
      correct = false;
      /* 間違いの音を小さくする */
      wrongSound.volume = 0.3;
      wrongSound.play();
      wrongSound.currentTime = 0;
    }
  });

  /* 次の文章へ */
  if (correct) {
    correctSound.play();
    correctSound.currentTime = 0;
    RenderNextSentence();
  }
});

/* ちゃんとthenかawaitで待たないと欲しいデータが入らない。 */
/* 非同期でランダムな文章を取得する。時間がかかるので、非同期 */
/* dataの中のコンテントを見に行く */
function GetRandomSentence() {
  return fetch(RANDOM_SENTENCE_URL_API)
    .then((response) => response.json())
    .then(
      (data) =>
        /* ここでならちゃんと文章情報を取り扱うことができる。 */
        //console.log(data.content);
        data.content
    );
}

/* 次のランダムな文章を取得する */
/* Render 表示する async非同期処理。待たなきゃいけない */
async function RenderNextSentence() {
  const sentence = await GetRandomSentence();
  console.log(sentence);

  /* ディスプレイに表示 */
    /* 文章を1文字ずつ分解して、spanタグを生成する(クラス付与のため) split("")文章を一文字ずつにしてくれる */
 /*センテンスをtypeDisplayのなかに取ってきたセンテンスを表示 */ 
  typeDisplayElement.innerText = "";   
  /*最初はsentenceが入ってた。 */
  /* forEachひとつひとつ確認する。 */
  sentence.split("").forEach((character) => {
    /* とってきたcharacterに対して、それぞれspanタグをつける */
    const characterSpan = document.createElement("span");
    /* characterSpan.classList.add("correct"); */
    characterSpan.innerText = character;
    typeDisplayElement.appendChild(characterSpan);
    /* 確認 */
    console.log(characterSpan);
  });
  /* テキストボックスの中身を消す。 */
    typeInputElement.value = null;

  /* タイマーのリセット */
  StartTimer();
}
/*カウントダウン */
let startTime;
let originTime = 30;
/* カウントを開始する。 */
function StartTimer() {
  timer.innerText = originTime;
  startTime = new Date(); /* 現在の時刻を表示 */
  console.log(startTime);
  
setInterval(() => {
    timer.innerText = originTime - getTimerTime(); 
  /* １秒ずれて呼び出される */
    if (timer.innerText <= 0) TimeUp();
      /* 文章を1文字ずつ分解して、spanタグを生成する(クラス付与のため) split("")文章を一文字ずつにしてくれる 1000は1秒。*/
}, 1000);
}

function getTimerTime() {
  return Math.floor(
    (new Date() - startTime) / 1000
  ); /* 現在の時刻 - １秒前の時刻 = 1s*/
}
  /* 文章を1文字ずつ分解して、spanタグを生成する(クラス付与のため) split("")文章を一文字ずつにしてくれる
  0秒になったら次のテキストへ */
function TimeUp() {
  console.log("next sentence");
  RenderNextSentence();
}

RenderNextSentence();
