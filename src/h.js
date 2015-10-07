window.c.h = ((m, moment) => {
  //Date Helpers
  const momentify = (date, format) => {
    format = format || 'DD/MM/YYYY';
    return date ? moment(date).format(format) : 'no date';
  },

  momentFromString = (date, format) => {
    const european = moment(date, format || 'DD/MM/YYYY');
    return european.isValid() ? european : moment(date);
  },

  //Object manipulation helpers
  generateRemaingTime = (project) =>  {
    const remainingTextObj = m.prop({}),
        translatedTime = {
          days: 'dias',
          minutes: 'minutos',
          hours: 'horas',
          seconds: 'segundos'
        };

    remainingTextObj({
      unit: translatedTime[project.remaining_time.unit || 'seconds'],
      total: project.remaining_time.total
    });

    return remainingTextObj;
  },

  //Number formatting helpers
  generateFormatNumber = (s, c) => {
    return (number, n, x) =>  {
      if (number === null || number === undefined) {
        return null;
      }

      const re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
          num = number.toFixed(Math.max(0, ~~n));
      return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
    };
  },
  formatNumber = generateFormatNumber('.', ','),

  toggleProp = (defaultState, alternateState) => {
    const p = m.prop(defaultState);
    p.toggle = () => {
      p(((p() === alternateState) ? defaultState : alternateState));
    };

    return p;
  },

  idVM = m.postgrest.filtersVM({id: 'eq'}),

  hashMatch = (str) => {
    return window.location.hash === str;
  },

  useAvatarOrDefault = (avatarPath) => {
    return avatarPath || '/assets/catarse_bootstrap/user.jpg';
  },

  //Templates
  loader = () => {
    return m('.u-text-center.u-margintop-30[style="margin-bottom:-110px;"]', [
      m('img[alt="Loader"][src="https://s3.amazonaws.com/catarse.files/loader.gif"]')
    ]);
  },

  fbParse = () => {
    const tryParse = () => {
      try {
        window.FB.XFBML.parse();
      } catch (e) {
        console.log(e);
      }
    };

    return window.setTimeout(tryParse, 500); //use timeout to wait async of facebook
  },

  pluralize = (count, s, p) => {
    return (count > 1 ? count + p : count + s);
  },

  simpleFormat = (str = '') => {
    str = str.replace(/\r\n?/, '\n');
    if (str.length > 0) {
      str = str.replace(/\n\n+/g, '</p><p>');
      str = str.replace(/\n/g, '<br />');
      str = '<p>' + str + '</p>';
    }
    return str;
  },

  rewardSouldOut = (reward) => {
    return (reward.maximum_contributions > 0 ?
        (reward.paid_count + reward.waiting_payment_count >= reward.maximum_contributions) : false);
  },

  rewardRemaning = (reward) => {
    return reward.maximum_contributions - (reward.paid_count + reward.waiting_payment_count);
  },

  parseUrl = (href) => {
    const l = document.createElement('a');
    l.href = href;
    return l;
  },

  observable = () => {
    let channels = {};
    return {
      register: function(subscriptions, controller) {
        return () => {
          let ctrl = new Controller;
          let reload = controller.bind(ctrl);
          Observable.on(subscriptions, reload);
          ctrl.onunload = function() {
            Observable.off(reload);
          };
          return ctrl;
        };
      },
      on: (subscriptions, callback) => {
        subscriptions.forEach(function(subscription) {
          if (!channels[subscription]){
            channels[subscription] = [];
          }
          channels[subscription].push(callback);
        });
      },
      off: (callback) => {
        for (let channel in channels) {
          index = channels[channel].indexOf(callback);
          if (index > -1){
            channels[channel].splice(index, 1);
          };
        }
      },
      trigger: (channel, args) => {
        _.map(channels[channel], (callback) => {
          callback(args);
        });
      }
    };
  };

  observable();

  return {
    momentify: momentify,
    momentFromString: momentFromString,
    formatNumber: formatNumber,
    idVM: idVM,
    toggleProp: toggleProp,
    loader: loader,
    fbParse: fbParse,
    pluralize: pluralize,
    simpleFormat: simpleFormat,
    generateRemaingTime: generateRemaingTime,
    rewardSouldOut: rewardSouldOut,
    rewardRemaning: rewardRemaning,
    parseUrl: parseUrl,
    hashMatch: hashMatch,
    useAvatarOrDefault: useAvatarOrDefault,
    observable: observable
  };
}(window.m, window.moment));
