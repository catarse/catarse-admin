import m from 'mithril';
import _ from 'underscore';
import h from '../h';
import filterMain from './filter-main';

const adminFilter = {
    oninit() {
        return {
            toggler: h.toggleProp(false, true)
        };
    },
    view(vnode) {
        const filterBuilder = vnode.attrs.filterBuilder,
            data = vnode.attrs.data,
            label = vnode.attrs.label || '',
            main = _.findWhere(filterBuilder, {
                component: filterMain
            });

        return m('#admin-contributions-filter.w-section.page-header', [
            m('.w-container', [
                m('.fontsize-larger.u-text-center.u-marginbottom-30', label),
                m('.w-form', [
                    m('form', {
                        onsubmit: vnode.attrs.submit
                    }, [
                        main ? m(main.component, main.data) : '',
                        m('.u-marginbottom-20.w-row',
                            m('button.w-col.w-col-12.fontsize-smallest.link-hidden-light[style="background: none; border: none; outline: none; text-align: left;"][type="button"]', {
                                onclick: vnode.state.toggler.toggle
                            }, 'Filtros avançados  >')), (vnode.state.toggler() ?
                            m('#advanced-search.w-row.admin-filters', [
                                _.map(filterBuilder, f => (f.component !== filterMain) ? m(f.component, f.data) : '')
                            ]) : ''
                        )
                    ])
                ])
            ])
        ]);
    }
};

export default adminFilter;
