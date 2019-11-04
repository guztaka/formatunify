module.exports = class SkillHandleWeatherCheck {
  constructor() {
    this.required_parameter = {
      weather: {
        message_to_confirm: {
          type: 'template',
          altText:
            'いつの天気を取得しましょうか？',
          template: {
            type: 'buttons',
            text: 'いつの？',
            actions: [
              { type: 'message', label: '今日', text: '今日' },
              { type: 'message', label: '明日', text: '明日' },
              { type: 'message', label: '明後日', text: '明後日' },
            ],
          },
        },
        // eslint-disable-next-line no-unused-vars
        parser: async (value, bot, event, context) => {
          if (['今日', '明日', '明後日'].includes(value)) {
            return value;
          }
          throw new Error();
        },
        // eslint-disable-next-line no-unused-vars
        reaction: async (error, value, bot, event, context) => {
          if (error) return;

          bot.queue({
            type: 'text',
            text: `了解！${value}ね。`,
          });
        },
      },
      address: {
        message_to_confirm: {
          type: 'text',
          text: 'どちらにおしらせしましょう？',
        },
        // eslint-disable-next-line no-unused-vars
        parser: async (value, bot, event, context) => {
          if (typeof value === 'string') {
            return value;
          } else if (typeof value === 'object' && value.type === 'location') {
            return value.address;
          }
          throw new Error();
        },
      },
    };
  }

  // eslint-disable-next-line class-methods-use-this
  async finish(bot, event, context) {
    await bot.reply({
      type: 'text',
      text: `了解！${context.confirmed.weather}を30分後くらいに${context.confirmed.address}にお届けしますわ。おおきに。`,
    });
  }
};
