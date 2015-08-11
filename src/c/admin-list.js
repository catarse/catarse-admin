window.c.AdminList = (function(m, h, c){
  var admin = c.admin;
  return {
    controller: function(args) {
      admin.isLoading = args.vm.isLoading;
      if (!args.vm.collection().length && args.vm.firstPage) {
        args.vm.firstPage().then(null, function(serverError) {
          c.error(serverError.message);
        });
      }
    },
    view: function(ctrl, args) {
      return m('.w-section.section',[
        m('.w-container',[
          m('.w-row.u-marginbottom-20', [
            m('.w-col.w-col-9', [
              m('.fontsize-base', [
                m('span.fontweight-semibold', args.vm.total()),' apoios encontrados']
               )
            ])
          ]),
          m('#admin-contributions-list.w-container',[
            args.vm.collection().map(function(item) {
              return m.component(c.AdminItem, {builder: args.itemBuilder, item: item, key: item.key});
            }),
            m('.w-section.section',[
              m('.w-container',[
                m('.w-row',[
                  m('.w-col.w-col-2.w-col-push-5',[
                    !args.vm.isLoading() ?
                      m('button#load-more.btn.btn-medium.btn-terciary', {onclick: args.vm.nextPage}, 'Carregar mais') :
                      h.loader(),
                  ])
                ])
              ])
            ])
          ])
        ])
      ]);
    }
  };
}(window.m, window.c.h, window.c));
