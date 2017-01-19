import m from 'mithril';
import h from '../h';
import I18n from 'i18n-js';

const I18nScope = _.partial(h.i18nScope, 'layouts.footer');

const footer = {
    view() {
        return m('footer.main-footer.main-footer-neg',
            [
                m('section.w-container',
                    m('.w-row',
                        [
                            m('.w-col.w-col-9',
                                m('.w-row',
                                    [
                                        m('.w-col.w-col-4.w-col-small-4.w-col-tiny-4.w-hidden-tiny',
                                            [
                                                m('.footer-full-signature-text.fontsize-small',
                                                    I18n.t('links.contact', I18nScope())
                                                ),
                                                m('a.link-footer[href=\'http://crowdfunding.catarse.me/paratodos?ref=ctrse_footer\']',
                                                    [
                                                        I18n.t('links.how_it_works', I18nScope()),
                                                        m.trust('&nbsp;'),
                                                        m('span.badge.badge-success',
                                                            I18n.t('links.novelty', I18nScope())
                                                        )
                                                    ]
                                                ),
                                                m('a.link-footer[href=\'https://www.catarse.me/pt/flex?ref=ctrse_footer\']',
                                                    ' Catarse flex'
                                                ),
                                                m('a.link-footer[href=\'https://www.catarse.me/pt/team?ref=ctrse_footer\']',
                                                    [
                                                        I18n.t('links.team', I18nScope()),
                                                        m.trust('&lt;'),
                                                        '3'
                                                    ]
                                                ),
                                                m('a.link-footer[href=\'http://facebook.com/catarse.me\']',
                                                    ' Facebook'
                                                ),
                                                m('a.link-footer[href=\'http://twitter.com/catarse\']',
                                                    ' Twitter'
                                                ),
                                                m('a.link-footer[href=\'http://instagram.com/catarse\']',
                                                    ' Instagram'
                                                ),
                                                m('a.link-footer[href=\'http://github.com/catarse/catarse\']',
                                                    ' Github'
                                                ),
                                                m('a.link-footer[href=\'http://blog.catarse.me\']',
                                                    ' Blog'
                                                ),
                                                m('a.link-footer[href=\'https://www.catarse.me/pt/jobs\']',
                                                    I18n.t('links.jobs', I18nScope())
                                                )
                                            ]
                                        ),
                                        m('.w-col.w-col-4.w-col-small-4.w-col-tiny-4.footer-full-firstcolumn',
                                            [
                                                m('.footer-full-signature-text.fontsize-small',
                                                    I18n.t('titles.about', I18nScope())
                                                ),
                                                m('a.link-footer[href=\'http://suporte.catarse.me/hc/pt-br/requests/new\'][target="_BLANK"]',
                                                    I18n.t('links.contact', I18nScope())
                                                ),
                                                m('a.link-footer[href=\'http://crowdfunding.catarse.me/nossa-taxa?ref=ctrse_footer\']',
                                                    [
                                                        I18n.t('links.rate', I18nScope()),
                                                        m.trust('&nbsp;'),
                                                        m('span.badge.badge-success',
                                                            I18n.t('links.novelty', I18nScope())
                                                        )
                                                    ]
                                                ),
                                                m('a.link-footer[href=\'https://www.catarse.me/pt/press?ref=ctrse_footer\']',
                                                    I18n.t('links.press', I18nScope())
                                                ),
                                                m('a.link-footer[href=\'http://suporte.catarse.me?ref=ctrse_footer/\']',
                                                    I18n.t('links.help_support', I18nScope())
                                                ),
                                                m('a.link-footer[href=\'https://www.catarse.me/pt/guides?ref=ctrse_footer\']',
                                                    I18n.t('links.guides', I18nScope())
                                                ),
                                                m('a.link-footer[href=\'http://pesquisa.catarse.me/\']',
                                                    I18n.t('links.crowdfunding_stats', I18nScope())
                                                ),
                                                m('a.link-footer[href=\'/pt/terms-of-use\']',
                                                    I18n.t('links.terms', I18nScope())
                                                ),
                                                m('a.link-footer[href=\'/pt/privacy-policy\']',
                                                    I18n.t('links.privacy', I18nScope())
                                                )
                                            ]
                                        ),
                                        m('.w-col.w-col-4.w-col-small-4.w-col-tiny-4.footer-full-lastcolumn',
                                            [
                                                m('.footer-full-signature-text.fontsize-small',
                                                    I18n.t('titles.sitemap', I18nScope())
                                                ),
                                                m('a.w-hidden-small.w-hidden-tiny.link-footer[href=\'/pt/start?ref=ctrse_footer\']',
                                                    I18n.t('links.submit', I18nScope())
                                                ),
                                                m('a.link-footer[href=\'/pt/explore?ref=ctrse_footer\']',
                                                    I18n.t('links.discover', I18nScope())
                                                ),
                                                m('a.w-hidden-main.w-hidden-medium.w-hidden-small.link-footer[href=\'http://blog.catarse.me?ref=ctrse_footer\']',
                                                    ' Blog'
                                                ),
                                                m('a.w-hidden-main.w-hidden-medium.w-hidden-small.link-footer[href=\'https://equipecatarse.zendesk.com/account/dropboxes/20298537\']',
                                                    I18n.t('links.contact', I18nScope())
                                                ),
                                                m('a.w-hidden-tiny.link-footer[href=\'/pt/explore?filter=score&ref=ctrse_footer\']',
                                                    I18n.t('links.score', I18nScope())
                                                ),
                                                m('a.w-hidden-tiny.link-footer[href=\'/pt/explore?filter=online&ref=ctrse_footer\']',
                                                    I18n.t('links.online', I18nScope())
                                                ),
                                                m('a.w-hidden-tiny.link-footer[href=\'/pt/explore?filter=finished&ref=ctrse_footer\']',
                                                    I18n.t('links.finished', I18nScope())
                                                )
                                            ]
                                        )
                                    ]
                                )
                            ),
                            m('.w-col.w-col-3.column-social-media-footer',
                                [
                                    m('.footer-full-signature-text.fontsize-small',
                                        I18n.t('titles.newsletter', I18nScope())
                                    ),
                                    m('.w-form',
                                        m(`form[accept-charset='UTF-8'][action='${h.getMailchimpUrl()}'][id='mailee-form'][method='post']`,
                                            [
                                                m('.w-form.footer-newsletter',
                                                    m('input.w-input.text-field.prefix[id=\'EMAIL\'][label=\'email\'][name=\'EMAIL\'][placeholder=\''+I18n.t('texts.email', I18nScope())+'\'][type=\'email\']')
                                                ),
                                                m('button.w-inline-block.btn.btn-edit.postfix.btn-attached[style="padding:0;"]',
                                                    m('img.footer-news-icon[alt=\'Icon newsletter\'][src=\'/assets/catarse_bootstrap/icon-newsletter.png\']')
                                                )
                                            ]
                                        )
                                    ),
                                    m('.footer-full-signature-text.fontsize-small',
                                        I18n.t('titles.social', I18nScope())
                                    ),
                                    m('.w-widget.w-widget-facebook.u-marginbottom-20',
                                        m('.facebook',
                                            m('.fb-like[data-colorscheme=\'dark\'][data-href=\'http://facebook.com/catarse.me\'][data-layout=\'button_count\'][data-send=\'false\'][data-show-faces=\'false\'][data-title=\'\'][data-width=\'260\']')
                                        )
                                    ),
                                    m('.w-widget.w-widget-twitter', [
                                        m(`a.twitter-follow-button[href="httṕ://twitter.com/catarse"][data-button="blue"][data-text-color="#FFFFFF][data-link-color="#FFFFFF"][data-width="224px"]`)
                                    ]),
                                    m('.u-margintop-30',
                                        [
                                            m('.footer-full-signature-text.fontsize-small',
                                                'Change language'
                                            ),
                                            m('[id=\'google_translate_element\']')
                                        ]
                                    )
                                ]
                            )
                        ]
                    )
                ),
                m('.w-container',
                    m('.footer-full-copyleft',
                        [
                            m('img.u-marginbottom-20[alt=\'Logo footer\'][src=\'/assets/logo-footer.png\']'),
                            m('.lineheight-loose',
                                m('a.link-footer-inline[href=\'http://github.com/catarse/catarse\']',
                                    I18n.t('texts.copyleft', I18nScope()) + ` | ${new Date().getFullYear()} | Open source`
                                )
                            )
                        ]
                    )
                )
            ]
        );
    }
};

export default footer;
