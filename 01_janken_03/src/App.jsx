import { useState } from 'react'
import logo from './logo.svg'
import './App.css'

function App() {
  // 初期状態の作成
  const [initial, setInitial] = useState(0)

  // あなたの手
  const [your, setYour] = useState(0);
  const [yourImage, setYourImage] = useState(0);
  // 相手の手
  const [opponent, setOpponent] = useState(0);
  const [opponentImage, setOpponentImage] = useState(0);
  // 結果
  const [result, setResult] = useState(0);

  // 判定値
  const [criteria, setCriteria] = useState(0);

  // 勝敗カウント用変数
  const [count_win, setCountWin] = useState(0);
  const [count_draw, setCountDraw] = useState(0);
  const [count_loose, setCountLoose] = useState(0);
  const [count_total, setCountTotal] = useState(0);

  // 点数表示用
  const [score, setScore] = useState(0);

  // 関数
  function start(x) {
    // データのクリア
    setCountWin(0);
    setCountDraw(0);
    setCountLoose(0);
    setCountTotal(0);
    setResult(0);

    setInitial(x);
    setCriteria(10);
  }

  function junken(x) {
    // 自分の手を表示する
    setYourImage("images/hand_" + x + "_" + (Math.floor(Math.random() * 4) + 1) + ".jfif" );
    setYour(x);

    // 相手の手を決める
    const answer = Math.floor(Math.random() * 3) + 1;
    setOpponentImage("images/hand_" + answer + "_" + (Math.floor(Math.random() * 4) + 1) + ".jfif" );
    setOpponent(answer);

    // 勝負を判定する
    var result;
    if (x == 1 && answer == 2 || x == 2 && answer == 3 || x == 3 && answer == 1) {
      result = 1;
    } else if (x === answer) {
      result = 2;
    } else {
      result = 3;
    }

    // 結果を表示
    setResult(result);

    //　スコアを計算して表示
    calcPoint(result);
  }

  //　スコアを計算して表示
  function calcPoint(x) {
    var get_score = 0;
    if(x === 1){
      setCountWin(count_win + 1);
      get_score = 3; // 買ったら勝ち点３
    }else if(x === 2){
      setCountDraw(count_draw + 1);
      get_score = 1; // 引き分けは勝ち点１
    }else if(x === 3){
      setCountLoose(count_loose + 1);
      get_score = -1;
       // 負けは勝ち点-1
    }
    // 合計点を更新
    setCountTotal(count_total + get_score);

    // 獲得スコアを表示
    setScore(get_score);
  }

  return (
    <div className="App">
      <section id="mainbg" class="wrapper">
        <div class="main-image">
          <div class="main-image__text">
            <p class="main-image__text_first">じゃんけんで世界を変えよう！</p>
            <p class="main-image__text_second">
              じゃんけん達人学校<br/>
              「Futute PERSPECTIVE」
            </p>
          </div>
        </div>
      </section>

      {/* about */}
      <section id="about" class="wrapper">
        <div class="about-wrapper">
          <h2 class="text-center title text-yellow">About</h2>
          <h3 class="text-center about__name">
            Future PERSPECTIVE<br/>
            不確実な未来を乗り越えろ！
          </h3>
          <div class="about__text">
            <p class="about__sentence">
              Future PERSPECTIVEは、じゃんけん達人養成学校である！</p>
            <p class="about__sentence">
              子供の頃から、我々は「じゃんけんという不確実な未来」と共に生きてきた。<br/>
              じゃんけんが強くなれば、不確実な未来を乗り越えることが出来るのだ！<br/>
              我々は一人でも多くのじゃんけんの達人、すなわち不確実な未来を乗り越える人材を世に輩出することで世界を変えるのだ！<br/>
              純粋だったあの頃を思い出せ！今こそ直観を解放するんだ！<br/>
              世界を変えよう！
              </p>
          </div>
        </div>
      </section>

      {/* initial */}
      <section id="initial">
        <div class="initial-wrapper">
          {initial == 0 && (
            <button class="btn" onClick={() => start(1)}>START!</button>
          )}
          {initial == 1 && count_total < criteria && (criteria * -1) < count_total && (
            <>
            <div class="initial__text">
              <p>さあ、乗り越えられる未来を見通せ！</p>
            </div>
            <div class="initail__buttons">
              <button class="btn-hand" onClick={() => junken(1)}>グー</button>
              <button class="btn-hand" onClick={() => junken(2)}>チョキ</button>
              <button class="btn-hand" onClick={() => junken(3)}>パー</button>
            </div>
            </>
          )}
        </div>
      </section>

      {/* field */}
      <section id="field" class="wrapper">
        {initial == 0 && (
          <>
          </>
        )}
        {initial == 1 && result != 0 && (
          <div class="field-wrapper">
            <div class="field__contents">
              <div class="field__box">
                <div class="field__paragraph">
                  <p class="field__title">あなたの手</p>
                  <p class="field__sentences">
                  </p>
                  {your === 0 && (
                    <h1>・・・</h1>
                  )}
                  {your !== 0 && (
                    <img src={yourImage}/>
                  )}
                </div>
              </div>
              <div class="field__box">
                <div class="field__paragraph">
                  <p class="field__title">相手の手</p>
                  <p class="field__sentences">
                  </p>
                  {opponent === 0 && (
                    <h1>・・・</h1>
                  )}
                  {opponent !== 0 && (
                    <img src={opponentImage}/>
                    )}
                </div>
              </div>
              <div class="field__box">
                <div class="field__paragraph">
                  <p class="field__title">結果</p>
                  <p class="field__sentences">
                  {result === 0 && (
                      <h1>・・・</h1>
                  )}
                  {result === 1 && (
                    <h1>あなたの勝ちです！</h1>
                  )}
                  {result === 2 && (
                    <h1>引き分け！</h1>
                  )}
                  {result === 3 && (
                    <h1>負けですね・・・</h1>
                    )}
                </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
      {/* result */}
      <section id="result" class="wrapper">
        {result == 0 && (
            <>
            </>
          )}
        {result != 0 && (
          <div class="result-wrapper">
            <div class="result__counts">
              <div>
                <p>合計{criteria}点を超えると勝ちだ！</p>
              </div>
              <div>
                {score != 0 && count_total < criteria && (
                  <p class="falling-score">{score}</p>
                )}
              </div>
              <dl class="result-inner">
                <dt class="result-title result-top">勝ち（3点）</dt>
                <dd class="result-item result-top">{count_win}</dd>
                <dt class="result-title">引分（1点）</dt>
                <dd class="result-item">{count_draw}</dd>
                <dt class="result-title">負け（-1点）</dt>
                <dd class="result-item">{count_loose}</dd>
                <dt class="result-title">合計</dt>
                <dd class="result-item">{count_total}</dd>
              </dl>
            </div>
          </div>
        )}
        {initial == 1 && criteria <= count_total  && (
          <>
          <div class="result-winner">
            <p>よくやった！</p>
          </div>
          <button class="btn" onClick={() => Retry(1)}>START!</button>
          </>
        )}
        {initial == 1 && count_total <= (criteria * -1) && (
          <>
          <div class="result-winner">
            <p>負けっぷりも素晴らしい！</p>
          </div>
          </>
        )}
      </section>

      <footer class="footer text-center">
        <div class="wrapper">
          <small class="copyrights">
            copyrights 2022 Future PERSPECTIV All RIghts Reserved.
          </small>
        </div>
      </footer>

    </div>
  )
}

export default App
