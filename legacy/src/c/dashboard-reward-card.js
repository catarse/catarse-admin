import m from 'mithril';
import prop from 'mithril/stream';
import _ from 'underscore';
import h from '../h';
import copyTextInput from './copy-text-input';
import rewardVM from '../vms/reward-vm';
import projectVM from '../vms/project-vm';
import inlineError from './inline-error';
import rewardCardEditDescription from './reward-card-edit-description';

const I18nScope = _.partial(h.i18nScope, 'projects.reward_fields');

const dashboardRewardCard = {
    oninit: function(vnode) {
        const reward = vnode.attrs.reward(),
            imageFileToUpload = prop(null),
            isUploadingRewardImage = prop(false),
            isDeletingRewardImage = prop(false),
            availableCount = () => reward.maximum_contributions() - reward.paid_count() - reward.waiting_payment_count(),
            limitError = prop(false),
            editDescription = h.toggleProp(false, true),
            showLimited = h.toggleProp(false, true),
            descriptionError = prop(false),
            isSaving = prop(false),
            toggleLimit = () => {
                reward.run_out(false);
                reward.limited.toggle();
                reward.maximum_contributions('');
            },
            editables = h.toggleProp(false, true),
            toggleShowLimit = () => {
                showLimited.toggle();
            },
            validate = () => {
                limitError(false);
                vnode.attrs.error(false);
                vnode.attrs.errors('Erro ao salvar informações.');
                if (reward.maximum_contributions() && reward.paid_count() > reward.maximum_contributions()) {
                    limitError(true);
                    vnode.attrs.error(true);
                }

                descriptionError(reward.description() === null || reward.description().length === 0);
                if (descriptionError()) {
                    vnode.attrs.error(true);
                }
            },
            saveReward = () => {
                validate();
                if (vnode.attrs.error()) {
                    return false;
                }
                isSaving(true);
                const data = getRewardDataToSave();
                const isSubscription = projectVM.isSubscription(vnode.attrs.project());
                if (isSubscription) {
                    data.description = reward.description();
                }

                rewardVM.updateReward(vnode.attrs.project().project_id, reward.id(), data).then(() => {
                        vnode.attrs.showSuccess(true);
                        editables.toggle();
                        reward.limited(reward.maximum_contributions() !== null);
                        isSaving(false);
                        h.redraw();
                    })
                    .catch(err => {
                        isSaving(false);
                        h.redraw();
                    });
                return false;
            },
            getRewardDataToSave = () => {

                if (reward.run_out()) {
                    reward.maximum_contributions(null);
                    return {
                        run_out: true
                    };
                } else {
                    return {
                        maximum_contributions: reward.maximum_contributions(),
                        run_out: false
                    };
                }
            },
            onSelectImageFile = () => {
                const rewardImageFile = window.document.getElementById(`reward_image_file_closed_card_${vnode.attrs.index}`);
                if (rewardImageFile.files.length) {

                    imageFileToUpload(rewardImageFile.files[0]);
                    isUploadingRewardImage(true);
                    vnode.attrs.uploadImage(reward, imageFileToUpload, vnode.attrs.project().id, reward.id())
                        .then(r_with_image => {
                            if (r_with_image) {
                                reward.uploaded_image(r_with_image.uploaded_image);
                                imageFileToUpload(null);
                                vnode.attrs.showSuccess(true);
                            }
                            isUploadingRewardImage(false);
                        })
                        .catch(error => {
                            vnode.attrs.showSuccess(false);
                            isUploadingRewardImage(false);
                        });
                }
            },
            tryDeleteImage = () => {

                if (reward.newReward || imageFileToUpload()) {
                    reward.uploaded_image(null);
                    imageFileToUpload(null);
                } else {
                    isDeletingRewardImage(true);
                    vnode.attrs.deleteImage(reward, vnode.attrs.project().id, reward.id())
                        .then(r => {
                            if (r) {
                                imageFileToUpload(null);
                                reward.uploaded_image(null);
                            }
                            isDeletingRewardImage(false);
                        })
                        .catch(error => {
                            // TODO: Show error on deleting the image
                            isDeletingRewardImage(false);
                            m.redraw();
                        });
                }
            },
            runOutRewardAvailability = () => {
                reward.limited(false);
                reward.run_out.toggle();
            };

        vnode.state = {
            editDescription,
            availableCount,
            descriptionError,
            toggleShowLimit,
            toggleLimit,
            saveReward,
            showLimited,
            limitError,
            runOutRewardAvailability,
            onSelectImageFile,
            tryDeleteImage,
            isUploadingRewardImage,
            isDeletingRewardImage,
            editables,
            isSaving
        };
    },
    view: function({
        state,
        attrs
    }) {
        const reward = attrs.reward();
        const project = attrs.project();

        const editables = state.editables;
        const isSubscription = projectVM.isSubscription(project);
        const isUploadingRewardImage = state.isUploadingRewardImage;
        const isDeletingRewardImage = state.isDeletingRewardImage;
        const tryDeleteImage = state.tryDeleteImage;
        const onSelectImageFile = state.onSelectImageFile;
        const availableCount = state.availableCount;
        const inlineError = message => m('.fontsize-smaller.text-error.u-marginbottom-20.fa.fa-exclamation-triangle', m('span', message));
        const shouldShowLoaderToUploadImage = isUploadingRewardImage() || isDeletingRewardImage();
        const showLimited = editables();
        const limitError = (state.limitError && state.limitError());
        const descriptionError = state.descriptionError;
        const isEditingDescription = editables();
        const isSaving = state.isSaving();

        return m('.w-row.cursor-move.card-persisted.card.card-terciary.u-marginbottom-20.medium.sortable', [
            (
                isSaving ?
                    m('.card', [ h.loader() ])
                :
                    m('.card', [

                m('.w-row', [
                    m('.w-col.w-col-11.w-col-small-11.w-col-tiny-11',
                        m('.fontsize-base.fontweight-semibold',
                            window.I18n.t(
                                isSubscription ?
                                'minimum_value_subscription_title' :
                                'minimum_value_title', I18nScope({
                                    minimum_value: reward.minimum_value()
                                }))
                        )
                    ),
                    (rewardVM.canEdit(reward, project.state, attrs.user) ?
                        m('.w-col.w-col-1.w-col-small-1.w-col-tiny-1',
                            m("a.show_reward_form[href='javascript:void(0);']", {
                                    onclick: () => {
                                        reward.edit.toggle();
                                    }
                                },
                                m('.btn.btn-small.btn-terciary.fa.fa-lg.fa-edit.btn-no-border')
                            )
                        ) : '')
                ]),
                m('.u-marginbottom-20', [
                    m('.fontsize-smaller.fontweight-semibold',
                        window.I18n.t(
                            isSubscription ?
                            'paid_subscribers' :
                            'paid_contributors', I18nScope({
                                count: reward.paid_count()
                            })
                        )
                    ),
                    m('.fontsize-smaller.fontcolor-secondary', window.I18n.t('index.contributions_to_confirm', I18nScope({
                        count: reward.waiting_payment_count()
                    })))
                ]),

                // REWARD DESCRIPTION
                (
                    (isSubscription && isEditingDescription) ? m(rewardCardEditDescription, {
                        reward,
                        descriptionError,
                        inlineError
                    }) : null
                ),
                (
                    (isSubscription && !isEditingDescription) ?
                    m('.w-row.u-marginbottom-20', [
                        m('.w-col.w-col-4', [
                            m('button.btn.btn-small.btn-terciary.w-button', {
                                onclick: editables.toggle
                            }, 'Editar descrição'),
                        ])
                    ]) : null
                ),
                // END REWARD DESCRIPTION

                // REWARD IMAGE
                (
                    (shouldShowLoaderToUploadImage) ?
                    (
                        h.loader()
                    ) :
                    (
                        (reward.uploaded_image && reward.uploaded_image()) ?
                        (
                            m("div.u-marginbottom-30.w-row", [
                                m("div.w-col.w-col-7", [
                                    m("div.fontsize-smaller.fontweight-semibold", [
                                        "Imagem",
                                        m("span.fontcolor-secondary", " (opcional)")
                                    ]),
                                    m("div.u-marginbottom-20",
                                        m("div.btn.btn-small.btn-terciary.fa.fa-lg.fa-trash.btn-no-border.btn-inline.u-right[href='#']", {
                                            onclick: () => tryDeleteImage()
                                        })
                                    ),
                                    m(`img[src='${reward.uploaded_image()}'][alt='']`)
                                ]),
                                m("div.w-col.w-col-5")
                            ])
                        ) :
                        (
                            m("div.u-marginbottom-30.w-row", [
                                m("div.w-col.w-col-7", [
                                    m("div.fontsize-smaller.fontweight-semibold", [
                                        "Imagem",
                                        m("span.fontcolor-secondary", " (opcional)")
                                    ]),
                                    m("div.w-form", [
                                        m("form",
                                            m(`input.text-field.w-input[type='file'][placeholder='Choose file'][id='reward_image_file_closed_card_${attrs.index}']`, {
                                                oninput: () => onSelectImageFile()
                                            })
                                        ),
                                        m("div.w-form-done",
                                            m("div", "Thank you! Your submission has been received!")
                                        ),
                                        m("div.w-form-fail",
                                            m("div", "Oops! Something went wrong while submitting the form.")
                                        )
                                    ])
                                ]),
                                m("div.w-col.w-col-5")
                            ])
                        )
                    )
                ),
                // END REWARD IMAGE

                m('.fontsize-small.fontweight-semibold',
                    reward.title()
                ),
                m('.fontsize-small.fontcolor-secondary',
                    m.trust(h.simpleFormat(h.strip(reward.description()))),
                ),
                ((reward.limited() || reward.run_out()) ? (availableCount() <= 0 || reward.run_out()) ?
                    m('.u-margintop-10',
                        m('span.badge.badge-gone.fontsize-smaller',
                            window.I18n.t('reward_gone', I18nScope())
                        )
                    ) :
                    m('.u-margintop-10',
                        m('span.badge.badge-attention.fontsize-smaller', [
                            m('span.fontweight-bold',
                                window.I18n.t('reward_limited', I18nScope())
                            ),
                            window.I18n.t('reward_available', I18nScope({
                                available: availableCount(),
                                maximum: reward.maximum_contributions()
                            }))
                        ])
                    ) : ''),

                reward.deliver_at() && !isSubscription ? m('.fontsize-smallest', [
                    m('b', window.I18n.t('delivery_estimation', I18nScope())),
                    h.momentify(reward.deliver_at(), 'MMM/YYYY')
                ]) : null,
                isSubscription ? null : m('.fontsize-smallest',
                    m('b', `${window.I18n.t('delivery', I18nScope())}: `),
                    window.I18n.t(`shipping_options.${reward.shipping_options()}`, I18nScope())),
                m('.u-margintop-40.w-row', [
                    (showLimited ? '' :
                        m('.w-col.w-col-4', [
                            m('button.btn.btn-small.btn-terciary.w-button', {
                                onclick: editables.toggle
                            }, 'Editar disponibilidade'),

                        ])),
                    m('.w-col.w-col-8')
                ]),
                m(`div${showLimited ? '' : '.w-hidden'}`,
                    m('.card.card-terciary.div-display-none.u-radius', {
                            style: {
                                display: 'block'
                            }
                        },
                        m('.w-form', [
                            [
                                m('div.w-row', [
                                    m('div.w-col.w-col-6',
                                        m('div.w-checkbox', [
                                            m(`input.w-checkbox-input[type='checkbox']`, {
                                                onclick: state.runOutRewardAvailability,
                                                checked: reward.run_out()
                                            }),
                                            m('label.fontsize-smaller.fontweight-semibold.w-form-label',
                                                window.I18n.t('run_out_reward', I18nScope())
                                            )
                                        ])
                                    ),
                                    m('div.w-col.w-col-6')
                                ]),
                                m('.w-row', [
                                    m('.w-col.w-col-6',
                                        m('.w-checkbox', [
                                            m(`input.w-checkbox-input[type='checkbox']`, {
                                                onclick: state.toggleLimit,
                                                checked: reward.limited()
                                            }),
                                            m('label.fontsize-smaller.fontweight-semibold.w-form-label',
                                                window.I18n.t('reward_limited_input', I18nScope())
                                            )
                                        ])
                                    ),
                                    m('.w-col.w-col-6',
                                        m('input.string.tel.optional.w-input.text-field.u-marginbottom-30.positive[placeholder=\'Quantidade disponível\'][type=\'tel\']', {
                                            class: limitError ? 'error' : false,
                                            value: reward.maximum_contributions(),
                                            onchange: m.withAttr('value', reward.maximum_contributions)
                                        })
                                    )
                                ]),
                                m('.w-row', [
                                    m('.w-sub-col.w-col.w-col-4',
                                        m('button.btn.btn-small.w-button', {
                                            onclick: state.saveReward
                                        }, 'Salvar')
                                    ),
                                    m('.w-sub-col.w-col.w-col-4',
                                        m('button.btn.btn-small.btn-terciary.w-button', {
                                            onclick: editables.toggle
                                        }, 'Cancelar')
                                    ),
                                    m('.w-clearfix.w-col.w-col-4')
                                ])
                            ]
                        ])
                    )

                ),
                limitError ? m(inlineError, {
                    message: 'Limite deve ser maior que quantidade de apoios.'
                }) : '', ,
            ])
            ),
            m('.u-margintop-20', [
                m('.fontcolor-secondary.fontsize-smallest.fontweight-semibold',
                    window.I18n.t('reward_link_label', I18nScope())
                ),
                m('.fontcolor-secondary.fontsize-smallest.u-marginbottom-10',
                    window.I18n.t('reward_link_hint', I18nScope())
                ),
                m('.w-form',
                    m('.w-col.w-col-6',
                        m(copyTextInput, {
                            value: `https://www.catarse.me/pt/projects/${project.project_id}/${isSubscription ? 'subscriptions/start' : 'contributions/new'}?reward_id=${reward.id()}`
                        }),
                    )
                ),

            ]),
        ]);
    }
};

export default dashboardRewardCard;
