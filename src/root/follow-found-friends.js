import m from 'mithril';
import _ from 'underscore';
import h from '../h';
import userFriends from '../c/user-friends';
import userFollows from '../c/user-follows';
import userFollowers from '../c/user-followers';
import userCreators from '../c/user-creators';

const FollowFoundFriends = {
    oninit(vnode) {
        const user = h.getUser(),
            hash = console.warn("m.prop has been removed from mithril 1.0") || m.prop(window.location.hash),
            displayTabContent = () => {
                const c_opts = {
                        user
                    },
                    tabs = {
                        '#creators': m(userCreators, c_opts),
                        '#friends': m(userFriends, c_opts),
                        '#follows': m(userFollows, c_opts),
                        '#followers': m(userFollowers, c_opts)
                    };

                hash(window.location.hash);

                if (_.isEmpty(hash()) || hash() === '#_=_') {
                    return tabs['#friends'];
                }

                return tabs[hash()];
            };

        h.redrawHashChange();

        return {
            user,
            displayTabContent
        };
    },
    view(vnode) {
        return m('div', [
            m('.w-section.dashboard-header', [
                m('.w-container', [
                    m('.w-row.u-margintop-20.u-marginbottom-20', [
                        m('.w-col.w-col-1'),
                        m('.w-col.w-col-10.u-text-center', [
                            m('.fontsize-larger.fontweight-semibold.u-marginbottom-10', 'Descubra projetos com seus amigos'),
                            m('.fontsize-small', 'Siga os seus amigos e nós iremos te notificar sempre que eles lançarem ou apoiarem algum projeto')
                        ]),
                        m('.w-col.w-col-1')
                    ])
                ])
            ]),
            m('.divider.u-margintop-30'),
            m('.project-nav',
              m('.u-text-center.w-container',
                  [
                      m(`a[id="creators-link"][class="dashboard-nav-link ${h.hashMatch('#creators') ? 'selected' : ''}"] [href="#creators"]`,
                      'Encontre realizadores'
                     ),
                      m(`a[id="friends-link"][class="dashboard-nav-link ${h.hashMatch('#friends') || h.hashMatch('') ? 'selected' : ''}"] [href="#friends"]`,
                      'Encontre amigos'
                     ),
                      m(`a[id="follows-link"][class="dashboard-nav-link ${h.hashMatch('#follows') ? 'selected' : ''}"] [href="#follows"]`,
                          [
                              'Seguindo',
                              m.trust('&nbsp;'),
                              m('span.w-hidden-small.w-hidden-tiny.badge',
                            vnode.state.user.follows_count
                           )
                          ]
                     ),
                      m(`a[id="followers-link"][class="dashboard-nav-link ${h.hashMatch('#followers') ? 'selected' : ''}"] [href="#followers"]`,
                          [
                              'Seguidores',
                              m.trust('&nbsp;'),
                              m('span.w-hidden-small.w-hidden-tiny.badge',
                            vnode.state.user.followers_count
                           )
                          ]
                     )
                  ]
               )
             ),
            vnode.state.displayTabContent()
        ]);
    }
};

export default FollowFoundFriends;
