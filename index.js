// -----------------------------------------------------------------------------
// モジュールのインポート
const server = require('express')();
const line = require('@line/bot-sdk'); // Messaging APIのSDKをインポート

// -----------------------------------------------------------------------------
// パラメータ設定
const lineConfig = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN, // 環境変数からアクセストークンをセットしています
  channelSecret: process.env.LINE_CHANNEL_SECRET, // 環境変数からChannel Secretをセットしています
};
const bot = new line.Client(lineConfig);

// -----------------------------------------------------------------------------
// Webサーバー設定
server.listen(process.env.PORT || 3000);

// -----------------------------------------------------------------------------
// ルーター設定
server.post('/bot/webhook', line.middleware(lineConfig), (req, res, next) => {
  res.sendStatus(200);
  // eslint-disable-next-line no-console
  console.log(req.body);
  // すべてのイベント処理のプロミスを格納する配列。
  const eventsProcessed = [];

  // イベントオブジェクトを順次処理。
  req.body.events.forEach((event) => {
    // この処理の対象をイベントタイプがメッセージで、かつ、テキストタイプだった場合に限定。
    if (event.type === 'message' && event.message.type === 'text') {
      // ユーザーからのテキストメッセージが「こんにちは」だった場合のみ反応。
      if (event.message.text === 'こんにちは') {
        // replyMessage()で返信し、そのプロミスをeventsProcessedに追加。
        eventsProcessed.push(bot.replyMessage(event.replyToken, {
          type: 'text',
          text: 'これはこれは',
        }));
      }
    }
  });

  // すべてのイベント処理が終了したら何個のイベントが処理されたか出力。
  Promise.all(eventsProcessed).then(
    (response) => {
      // eslint-disable-next-line no-console
      console.log(`${response.length} event(s) processed.`);
    }
  );
});
