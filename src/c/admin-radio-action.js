window.c.AdminRadioAction = (function(m, h, c, _){
  return {
    controller: function(args){
      var builder = args.data,
          contribution = args.contribution,
          complete = m.prop(false),
          data = {},
          error = m.prop(false),
          fail = m.prop(false),
          item = args.item,
          description = m.prop(item.description || ''),
          key = builder.getKey,
          newValue = m.prop(''),
          getFilter = {},
          setFilter = {},
          radios = m.prop(),
          getKey = builder.getKey,
          getAttr = builder.radios,
          updateKey = builder.updateKey,
          selectedItem = builder.selectedItem || m.prop();

      setFilter[updateKey] = 'eq';
      var setVM = m.postgrest.filtersVM(setFilter);
      setVM[updateKey](contribution[updateKey]);

      getFilter[getKey] = 'eq';
      var getVM = m.postgrest.filtersVM(getFilter);
      getVM[getKey](item[getKey]); 

      var getLoader = m.postgrest.loaderWithToken(builder.getModel.getPageOptions(getVM.parameters()));

      var setLoader = m.postgrest.loaderWithToken(builder.updateModel.patchOptions(setVM.parameters(), data));

      var updateItem = function(data){
        if (data.length > 0){
          const newItem = _.findWhere(radios(), {id: data[0][builder.selectKey]});
          selectedItem(newItem);
        } else {
          error('Nenhum item atualizado');
        }
        complete(true);
      };

      var fetch = function(){
        getLoader.load().then(radios, error);
      };

      var submit = function(){
        if (newValue()) {
          data[builder.selectKey] = newValue();
          setLoader.load().then(updateItem, error);
        }
        return false;
      };

      var unload = function(el, isinit, context){
        context.onunload = function(){
          complete(false);
          error(false);
          newValue('');
        };
      };

      var setDescription = function(text){
        description(text);
        m.redraw();
      };

      fetch();

      return {
        complete: complete,
        description: description,
        setDescription: setDescription,
        error: error,
        setLoader: setLoader,
        getLoader: getLoader,
        newValue: newValue,
        submit: submit,
        toggler: h.toggleProp(false, true),
        unload: unload,
        radios: radios
      };
    },
    view: function(ctrl, args){
      var data = args.data,
          btnValue = (ctrl.setLoader() || ctrl.getLoader()) ? 'por favor, aguarde...' : data.callToAction;

      return m('.w-col.w-col-2',[
        m('button.btn.btn-small.btn-terciary', {
          onclick: ctrl.toggler.toggle
        }, data.outerLabel),
        (ctrl.toggler()) ?
          m('.dropdown-list.card.u-radius.dropdown-list-medium.zindex-10', {config: ctrl.unload},[
            m('form.w-form', {
              onsubmit: ctrl.submit
            }, (!ctrl.complete()) ? [
                  (ctrl.radios()) ?
                    _.map(ctrl.radios(), function(radio, index){
                      var set = function(){
                        ctrl.newValue(radio.id);
                        ctrl.setDescription(radio.description);
                      };
                      var selected = (radio.id === (args.item[data.selectKey] || args.item.id)) ? true : false;

                      return m('.w-radio', [
                        m('input#r-' + index + '.w-radio-input[type=radio][name="admin-radio"][value="' + radio.id + '"]' + ((selected) ? '[checked]' : ''),{
                          onclick: set
                        }),
                        m('label.w-form-label[for="r-' + index + '"]', 'R$' + radio.minimum_value)
                      ]);
                    }) : h.loader(),
                  m('strong', 'Descrição'),
                  m('p', ctrl.description()),
                  m('input.w-button.btn.btn-small[type="submit"][value="' + btnValue + '"]')
                ] : (!ctrl.error()) ? [
                    m('.w-form-done[style="display:block;"]', [
                      m('p', 'Recompensa alterada com sucesso!')
                    ])
                  ] : [
                    m('.w-form-error[style="display:block;"]', [
                      m('p', 'Houve um problema na requisição. O apoio não foi transferido!')
                    ])
                  ]
            )
          ])
        : ''
      ]);
    }
  };
}(window.m, window.c.h, window.c, window._));
