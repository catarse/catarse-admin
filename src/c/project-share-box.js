import m from 'mithril';
import h from '../h';
import facebookButton from './facebook-button';

const projectShareBox = {
    controller() {
        return {
            displayEmbed: h.toggleProp(false, true)
        };
    },
    view(ctrl, args) {
        return m('.pop-share', {
            style: 'display: block;'
        }, [
            m('.w-hidden-main.w-hidden-medium.w-clearfix', [
                m('a.btn.btn-small.btn-terciary.btn-inline.u-right', {
                    onclick: args.displayShareBox.toggle
                }, 'Close'),
                m('.fontsize-small.fontweight-semibold.u-marginbottom-30', 'Share this project')
            ]),
            m('.w-widget.w-widget-twitter.w-hidden-small.w-hidden-tiny.share-block', [
                m(`iframe[allowtransparency="true"][width="120px"][height="22px"][frameborder="0"][scrolling="no"][src="//platform.twitter.com/widgets/tweet_button.8d007ddfc184e6776be76fe9e5e52d69.en.html#_=1442425984936&count=horizontal&dnt=false&id=twitter-widget-1&lang=en&original_referer=https%3A%2F%2Fwww.grasruts.com%2Fen%2F${args.project().permalink}&size=m&text=Check%20out%20the%20campaign%20${args.project().name}%20at%20%40myjvnepal&type=share&url=http%3A%2F%2Fwww.grasruts.com%2Fen%2F${args.project().permalink}%3Fref%3Dtwitter%26utm_source%3Dtwitter.com%26utm_medium%3Dsocial%26utm_campaign%3Dproject_share&via=myjvnepal"]`)
            ]),
            m('a.w-hidden-small.widget-embed.w-hidden-tiny.fontsize-small.link-hidden.fontcolor-secondary[href="js:void(0);"]', {
                onclick: ctrl.displayEmbed.toggle
            }, '< embed >'), (ctrl.displayEmbed() ? m('.embed-expanded.u-margintop-30', [
                m('.fontsize-small.fontweight-semibold.u-marginbottom-20', 'Insert a widget on your site'),
                m('.w-form', [
                    m(`input.w-input[type="text"][value="<iframe frameborder="0" height="340px" src="http://www.grasruts.com/en/projects/${args.project().project_id}/embed" width="300px" scrolling="no"></iframe>"]`)
                ]),
                m('.card-embed', [
                    m(`iframe[frameborder="0"][height="350px"][src="/projects/${args.project().project_id}/embed"][width="300px"][scrolling="no"]`)
                ])
            ]) : ''),
            args.project().permalink ? m.component(facebookButton, {
                mobile: true,
                url: `http://www.grasruts.com/${args.project().permalink}?ref=facebook&utm_source=facebook.com&utm_medium=social&utm_campaign=project_share`
            }) : '',
            m(`a.w-hidden-main.w-hidden-medium.btn.btn-medium.btn-tweet.u-marginbottom-20[href="https://twitter.com/intent/tweet?text=I%20just%20supported%20the%20campaign%20${args.project().name}%20https://www.grasruts.com/${args.project().permalink}%3Fref%3Dtwitter%26utm_source%3Dtwitter.com%26utm_medium%3Dsocial%26utm_campaign%3Dproject_share"][target="_blank"]`, [
                m('span.fa.fa-twitter'), ' Tweet'
            ])
            // m('a.w-hidden-main.w-hidden-medium.btn.btn-medium[data-action="share/whatsapp/share"]', {
            //     href: `whatsapp://send?text=${encodeURIComponent(`https://www.grasruts.com/${args.project().permalink}/?ref=whatsapp&utm_source=whatsapp&utm_medium=social&utm_campaign=project_share`)}`
            // }, [m('span.fa.fa-whatsapp'), ' Whatsapp'])
        ]);
    }
};

export default projectShareBox;
