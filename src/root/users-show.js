import m from 'mithril';
import _ from 'underscore';
import h from '../h';
import userVM from '../vms/user-vm';
import userHeader from '../c/user-header';
import userCreated from '../c/user-created';
import userContributed from '../c/user-contributed';
import userAbout from '../c/user-about';

const usersShow = {
    oninit(vnode) {
        const userDetails = console.warn("m.prop has been removed from mithril 1.0") || m.prop({}),
            user_id = vnode.attrs.user_id.split('-')[0],
            hash = console.warn("m.prop has been removed from mithril 1.0") || m.prop(window.location.hash),
            displayTabContent = (user) => {
                const tabs = {
                    '#created': m(userCreated, { userId: user.id }),
                    '#contributed': m(userContributed, { userId: user.id }),
                    '#about': m(userAbout, { userId: user.id })
                };

                hash(window.location.hash);

                if (_.isEmpty(hash()) || hash() === '#_=_') {
                    if (user.total_published_projects > 0) {
                        hash('#created');
                        return tabs['#created'];
                    } else if (user.total_contributed_projects > 0) {
                        hash('#contributed');
                        return tabs['#contributed'];
                    }

                    hash('#about');
                    return tabs['#about'];
                }

                return tabs[hash()];
            };

        h.redrawHashChange();

        userVM.fetchUser(user_id, true, userDetails);

        return {
            displayTabContent,
            hash,
            userDetails
        };
    },
    view(vnode) {
        const user = vnode.state.userDetails();

        return m('div', [
            m(userHeader, { user }),

            m('nav.project-nav.u-text-center.u-marginbottom-30.profile', { style: { 'z-index': '10', position: 'relative' } },
              m('.w-container[data-anchor=\'created\']',
                  [
                    (!_.isEmpty(user) ?
                     (user.is_owner_or_admin ?
                      m(`a.dashboard-nav-link.dashboard[href=\'/pt/users/${user.id}/edit\']`, { oncreate: m.route.link,
                          onclick: () => {
                              m.route(`/users/edit/${user.id}`, { user_id: user.id });
                          } },
                          [
                              m('span.fa.fa-cog'),
                              m.trust('&nbsp;'),
                              ' Editar perfil'
                          ]
                      ) : '') : h.loader()),
                      m(`a[data-target=\'#contributed-tab\'][href=\'#contributed\'][id=\'contributed_link\'][class=\'dashboard-nav-link ${(vnode.state.hash() === '#contributed' ? 'selected' : '')}\']`,
                          [
                              'Apoiados ',
                              m.trust('&nbsp;'),
                              m('span.badge',
                                  user.total_contributed_projects
                              )
                          ]
                      ),
                      m(`a[data-target=\'#created-tab\'][href=\'#created\'][id=\'created_link\'][class=\'dashboard-nav-link ${(vnode.state.hash() === '#created' ? 'selected' : '')}\']`,
                          [
                              'Criados ',
                              m.trust('&nbsp;'),
                              m('span.badge',
                                  user.total_published_projects
                              )
                          ]
                      ),
                      m(`a[data-target=\'#about-tab\'][href=\'#about\'][id=\'about_link\'][class=\'dashboard-nav-link ${(vnode.state.hash() === '#about' ? 'selected' : '')}\']`,
                          'Sobre'
                      )
                  ]
              )
          ),

            m('section.section',
              m('.w-container',
                  m('.w-row', user.id ? vnode.state.displayTabContent(user) : h.loader())
              )
          )
        ]);
    }
};

export default usersShow;
