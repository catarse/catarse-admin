adminApp.AdminContributionsFilter = {
  controller: function(args){
    var vm = this.vm = adminApp.AdminContributionsFilter.VM;
    this.filter = function(){
      args.onFilter(vm.parameters());
      return false;
    };

    this.toggleSearch = function(){
      var advancedSearch = document.getElementById('advanced-search');
      if(advancedSearch.style.height == '70px'){
        advancedSearch.style.height = '0px'
      }
      else{
        advancedSearch.style.height = '70px'
      }
    };
    if(args) this.filter();
  },

  view: function(ctrl, args) {
    var formatDate = function(date){
      var european = moment(date, 'DD/MM/YYYY');
      return european.isValid() ? european.format() : moment(date).format();
    };
    var withStartDate = function(setter){
      return function(date){
        setter(formatDate(date));
      };
    };
    var withEndDate = function(setter){
      return function(date){
        setter(moment(formatDate(date)).endOf('day').format());
      };
    };
    return m("#admin-contributions-filter.w-section.page-header",[
      m(".w-container",[
        m(".fontsize-larger.u-text-center.u-marginbottom-30", "Apoios"),
        m(".w-form",[
          m("form[data-name='Email Form'][id='email-form'][name='email-form']", {onsubmit: ctrl.filter}, [
            m(".w-row.u-marginbottom-20", [
              m(".w-col.w-col-10", [
                m("input.w-input.text-field.positive.medium[id='field'][name='field'][placeholder='Busque por projeto, email, Ids do usuário e do apoio...'][type='text']", {onchange: m.withAttr("value", ctrl.vm.full_text_index), value: ctrl.vm.full_text_index()}),
                m("a.fontsize-smallest.link-hidden-light[data-ix='admin-filter'][href='#']", {onclick: ctrl.toggleSearch}, "Filtros avançados  >")]),
                m(".w-col.w-col-2", [
                  m("input#filter-btn.btn.btn-large.u-marginbottom-10[type='submit'][href='#'][value='Buscar']")
                ])
            ]),
            m("#advanced-search.w-row.admin-filters", {style: {"transition": "height .1s ease-out", "overflow": "hidden", "height": " 0px"}}, [
              m(".w-col.w-col-3.w-col-small-6", [
                m("label.fontsize-smaller[for='field-3']", "Com o estado"),
                m("select.w-select.text-field.positive[id='field-3']", {onchange: m.withAttr("value", ctrl.vm.state), value: ctrl.vm.state()}, [
                  m("option[value='']", "Qualquer um"),
                  m("option[value='pending']", "pending"),
                  m("option[value='refused']", "refused"),
                  m("option[value='paid']", "paid"),
                  m("option[value='pending_refund']", "pending_refund"),
                  m("option[value='refunded']", "refunded"),
                  m("option[value='chargeback']", "chargeback"),
                  m("option[value='deleted']", "deleted")
                ])
              ]),
              m(".w-col.w-col-3.w-col-small-6", [
                m("label.fontsize-smaller[for='field-8']", "Gateway"),
                m("select.w-select.text-field.positive[id='field-8']", {onchange: m.withAttr("value", ctrl.vm.gateway), value: ctrl.vm.gateway()}, [
                  m("option[value='']", "Qualquer um"),
                  m("option[value='Pagarme']", "Pagarme"),
                  m("option[value='MoIP']", "MoIP"),
                  m("option[value='PayPal']", "PayPal"),
                  m("option[value='Credits']", "Créditos")
                ])
              ]),
              m(".w-col.w-col-3.w-col-small-6", [
                m("label.fontsize-smaller[for='field-6']", "Valores entre"),
                m(".w-row", [
                  m(".w-col.w-col-5.w-col-small-5.w-col-tiny-5", [
                    m("input.w-input.text-field.positive[id='field-6'][type='text']", {onchange: m.withAttr("value", ctrl.vm.value['gte']), value: ctrl.vm.value['gte']()})
                  ]),
                  m(".w-col.w-col-2.w-col-small-2.w-col-tiny-2", [
                    m(".fontsize-smaller.u-text-center.lineheight-looser", "e")
                  ]),
                  m(".w-col.w-col-5.w-col-small-5.w-col-tiny-5", [
                    m("input.w-input.text-field.positive[id='field-5'][type='text']", {onchange: m.withAttr("value", ctrl.vm.value['lte']), value: ctrl.vm.value['lte']()})
                  ])
                ])
              ]),
              m(".w-col.w-col-3.w-col-small-6", [
                m("label.fontsize-smaller[for='field-9']", "Período do apoio"),
                m(".w-row", [
                  m(".w-col.w-col-5.w-col-small-5.w-col-tiny-5", [
                    m("input.w-input.text-field.positive[id='field-9'][type='text']", {onchange: m.withAttr("value", withStartDate(ctrl.vm.created_at['gte'])), value: ctrl.vm.created_at['gte']()})
                  ]),
                  m(".w-col.w-col-2.w-col-small-2.w-col-tiny-2", [
                    m(".fontsize-smaller.u-text-center.lineheight-looser", "e")
                  ]),
                  m(".w-col.w-col-5.w-col-small-5.w-col-tiny-5", [
                    m("input.w-input.text-field.positive[id='field-10'][type='text']", {onchange: m.withAttr("value", withEndDate(ctrl.vm.created_at['lte'])), value: ctrl.vm.created_at['lte']()})
                  ])
                ])
              ])
            ])
          ])
        ])
      ])
    ]);
  }
};
