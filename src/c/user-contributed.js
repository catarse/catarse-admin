import m from 'mithril';
import models from '../models';
import postgrest from 'mithril-postgrest';
import _ from 'underscore';
import h from '../h';
import userVM from '../vms/user-vm';
import projectCard from './project-card';
import inlineError from './inline-error';
import loadMoreBtn from './load-more-btn';

const userContributed = {
    oninit(vnode) {
        const contributedProjects = console.warn("m.prop has been removed from mithril 1.0") || m.prop(),
            user_id = vnode.attrs.userId,
            pages = postgrest.paginationVM(models.project),
            error = console.warn("m.prop has been removed from mithril 1.0") || m.prop(false),
            loader = console.warn("m.prop has been removed from mithril 1.0") || m.prop(true),
            contextVM = postgrest.filtersVM({
                project_id: 'in'
            });

        userVM.getPublicUserContributedProjects(user_id, null).then((data) => {
            contributedProjects(data);
            if (!_.isEmpty(contributedProjects())) {
                contextVM.project_id(_.pluck(contributedProjects(), 'project_id')).order({
                    online_date: 'desc'
                });

                models.project.pageSize(9);
                pages.firstPage(contextVM.parameters()).then(() => {
                    loader(false);
                });
            } else {
                loader(false);
            }
        }).catch((err) => {
            error(true);
            loader(false);
            m.redraw();
        });

        return {
            projects: pages,
            error,
            loader
        };
    },
    view(vnode) {
        const projects_collection = vnode.state.projects.collection();
        return vnode.state.error() ? m(inlineError, { message: 'Erro ao carregar os projetos.' }) : vnode.state.loader() ? h.loader() : m('.content[id=\'contributed-tab\']',
            [
                  (!_.isEmpty(projects_collection) ? _.map(projects_collection, project => m(projectCard, {
                      project,
                      ref: 'user_contributed',
                      showFriends: false
                  })) :
                    m('.w-container',
                        m('.u-margintop-30.u-text-center.w-row',
                            [
                                m('.w-col.w-col-3'),
                                m('.w-col.w-col-6',
                                    [
                                        m('.fontsize-large.u-marginbottom-30',
                                                'Ora, ora... você ainda não apoiou nenhum projeto no Catarse!'),
                                        m('.w-row',
                                            [
                                                m('.w-col.w-col-3'),
                                                m('.w-col.w-col-6',
                                                    m('a.btn.btn-large[href=\'/explore\']',
                                                        'Que tal apoiar agora?'
                                                    )
                                                ),
                                                m('.w-col.w-col-3')
                                            ]
                                        )
                                    ]
                                ),
                                m('.w-col.w-col-3')
                            ]
                        )
                    )
                  ),

                  (!_.isEmpty(projects_collection) ?
                  m('.w-row.u-marginbottom-40.u-margintop-30', [
                      m(loadMoreBtn, { collection: vnode.state.projects, cssClass: '.w-col-push-5' })
                  ]) : '')
            ]
              );
    }
};

export default userContributed;
