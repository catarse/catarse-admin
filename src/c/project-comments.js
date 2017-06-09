import m from 'mithril';
import h from '../h';
import projectReport from './project-report';

const projectComments = {
    oninit() {
        const loadComments = (el, isInitialized) => (el, isInitialized) => {
            if (isInitialized) { return; }
            h.fbParse();
        };

        return { loadComments };
    },
    view(vnode) {
        const project = vnode.attrs.project();
        return m('.w-row',
            [
                m('.w-col.w-col-7',
                m(`.fb-comments[data-href="http://www.catarse.me/${project.permalink}"][data-num-posts=50][data-width="610"]`, { config: vnode.state.loadComments() })
              ),
                m('.w-col.w-col-5', m(projectReport))
            ]
          );
    }
};

export default projectComments;
