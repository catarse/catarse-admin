import m from 'mithril';
import userVM from '../vms/user-vm';
import postgrest from 'mithril-postgrest';
import _ from 'underscore';
import models from '../models';
import h from '../h';
import popNotification from './pop-notification';
import UserOwnerBox from './user-owner-box';
import inlineError from './inline-error';
import projectEditSaveBtn from './project-edit-save-btn';
import userSettingsVM from '../vms/user-settings-vm';
import railsErrorsVM from '../vms/rails-errors-vm';

const I18nScope = _.partial(h.i18nScope, 'users.edit.settings_tab');

const userSettings = {
    oninit(vnode) {
        let parsedErrors = userSettingsVM.mapRailsErrors(railsErrorsVM.railsErrors());
        let deleteFormSubmit;
        const user = vnode.attrs.user,
            fields = {
                owner_document: console.warn("m.prop has been removed from mithril 1.0") || m.prop(user.owner_document || ''),
                country_id: console.warn("m.prop has been removed from mithril 1.0") || m.prop(user.address.country_id || 36),
                street: console.warn("m.prop has been removed from mithril 1.0") || m.prop(user.address.street || ''),
                number: console.warn("m.prop has been removed from mithril 1.0") || m.prop(user.address.number || ''),
                city: console.warn("m.prop has been removed from mithril 1.0") || m.prop(user.address.city || ''),
                zipcode: console.warn("m.prop has been removed from mithril 1.0") || m.prop(user.address.zipcode || ''),
                complement: console.warn("m.prop has been removed from mithril 1.0") || m.prop(user.address.complement || ''),
                neighbourhood: console.warn("m.prop has been removed from mithril 1.0") || m.prop(user.address.neighbourhood || ''),
                state: console.warn("m.prop has been removed from mithril 1.0") || m.prop(user.address.state || ''),
                phonenumber: console.warn("m.prop has been removed from mithril 1.0") || m.prop(user.address.phonenumber || ''),
                name: console.warn("m.prop has been removed from mithril 1.0") || m.prop(user.name || ''),
                state_inscription: console.warn("m.prop has been removed from mithril 1.0") || m.prop(''),
                birth_date: console.warn("m.prop has been removed from mithril 1.0") || m.prop((user.birth_date ? h.momentify(user.birth_date) : '')),
                account_type: console.warn("m.prop has been removed from mithril 1.0") || m.prop(user.account_type || '')
            },
            loading = console.warn("m.prop has been removed from mithril 1.0") || m.prop(false),
            user_id = vnode.attrs.userId,
            error = console.warn("m.prop has been removed from mithril 1.0") || m.prop(''),
            countries = console.warn("m.prop has been removed from mithril 1.0") || m.prop(),
            states = console.warn("m.prop has been removed from mithril 1.0") || m.prop(),
            loader = console.warn("m.prop has been removed from mithril 1.0") || m.prop(true),
            showSuccess = h.toggleProp(false, true),
            showError = h.toggleProp(false, true),
            countriesLoader = postgrest.loader(models.country.getPageOptions()),
            statesLoader = postgrest.loader(models.state.getPageOptions()),
            phoneMask = _.partial(h.mask, '(99) 9999-99999'),
            documentMask = _.partial(h.mask, '999.999.999-99'),
            documentCompanyMask = _.partial(h.mask, '99.999.999/9999-99'),
            zipcodeMask = _.partial(h.mask, '99999-999'),
            birthDayMask = _.partial(h.mask, '99/99/9999'),
            creditCards = console.warn("m.prop has been removed from mithril 1.0") || m.prop(),
            toDeleteCard = console.warn("m.prop has been removed from mithril 1.0") || m.prop(-1),
            deleteCard = id => () => {
                toDeleteCard(id);
                // We must redraw here to update the action output of the hidden form on the DOM.
                console.warn("m.redraw ignores arguments in mithril 1.0") || m.redraw(true);
                deleteFormSubmit();
                return false;
            },
            setCardDeletionForm = (el, isInit) => {
                if (!isInit) {
                    deleteFormSubmit = () => el.submit();
                }
            },
            updateUserData = () => {
                const userData = {
                    country_id: fields.country_id(),
                    address_street: fields.street(),
                    address_number: fields.number(),
                    address_city: fields.city(),
                    address_zip_code: fields.zipcode(),
                    address_complement: fields.complement(),
                    address_state: fields.state(),
                    address_neighbourhood: fields.neighbourhood(),
                    phone_number: fields.phonenumber(),
                    cpf: fields.owner_document(),
                    name: fields.name(),
                    account_type: fields.account_type(),
                    birth_date: fields.birth_date()
                };

                if (vnode.attrs.publishingUserSettings) {
                    userData.publishing_user_settings = true;
                }

                return m.request({
                    method: 'PUT',
                    url: `/users/${user_id}.json`,
                    data: {
                        user: userData
                    },
                    config: h.setCsrfToken
                }).then(() => {
                    if (parsedErrors) {
                        parsedErrors.resetFieldErrors();
                    }
                    loading(false);
                    if (!showSuccess()) {
                        showSuccess.toggle();
                    }
                    railsErrorsVM.validatePublish();
                }).catch((err) => {
                    if (parsedErrors) {
                        parsedErrors.resetFieldErrors();
                    }
                    parsedErrors = userSettingsVM.mapRailsErrors(err.errors_json);
                    error('Erro ao atualizar informações.');
                    loading(false);
                    if (showSuccess()) {
                        showSuccess.toggle();
                    }
                    if (!showError()) {
                        showError.toggle();
                    }
                });
            },
            onSubmit = () => {
                loading(true);
                m.redraw();
                updateUserData();
                return false;
            },
            applyZipcodeMask = _.compose(fields.zipcode, zipcodeMask),
            applyBirthDateMask = _.compose(fields.birth_date, birthDayMask),
            applyPhoneMask = _.compose(fields.phonenumber, phoneMask),
            applyDocumentMask = (value) => {
                if (fields.account_type() != 'pf') {
                    fields.owner_document(documentCompanyMask(value));
                } else {
                    fields.owner_document(documentMask(value));
                }
            },
            handleError = () => {
                error(true);
                loader(false);
                m.redraw();
            };

        userVM.getUserCreditCards(vnode.attrs.userId).then(creditCards).catch(handleError);
        countriesLoader.load().then(data => countries(_.sortBy(data, 'name_en')));
        statesLoader.load().then(states);

        if (parsedErrors.hasError('country_id')) {
            parsedErrors.inlineError('country_id', false);
        }

        return {
            handleError,
            applyDocumentMask,
            applyZipcodeMask,
            applyPhoneMask,
            countries,
            states,
            fields,
            loader,
            showSuccess,
            showError,
            user,
            onSubmit,
            error,
            creditCards,
            deleteCard,
            toDeleteCard,
            setCardDeletionForm,
            applyBirthDateMask,
            loading,
            parsedErrors
        };
    },
    view(vnode) {
        let user = vnode.state.user,
            fields = vnode.state.fields,
            hasContributedOrPublished = (user.total_contributed_projects >= 1 || user.total_published_projects >= 1),
            disableFields = (user.is_admin_role ? false : (hasContributedOrPublished && !_.isEmpty(user.name) && !_.isEmpty(user.owner_document)));

        return m('[id=\'settings-tab\']', [
            (vnode.state.showSuccess() ? m(popNotification, {
                message: I18n.t('update_success_msg', I18nScope()),
                toggleOpt: vnode.state.showSuccess
            }) : ''),
            (vnode.state.showError() ? m(popNotification, {
                message: m.trust(vnode.state.error()),
                toggleOpt: vnode.state.showError,
                error: true
            }) : ''),
            m('form.w-form', {
                onsubmit: vnode.state.onSubmit
            }, [
                m('div', [
                    m('.w-container',
                        m('.w-col.w-col-10.w-col-push-1',
                            // ( _.isEmpty(fields.name()) && _.isEmpty(fields.owner_document()) ? '' : m(UserOwnerBox, {user: user}) ),
                            m('.w-form.card.card-terciary', [
                                m('.fontsize-base.fontweight-semibold',
                                  I18n.t('legal_title', I18nScope())
                                ),
                                m('.fontsize-small.u-marginbottom-20', [
                                    m.trust(I18n.t('legal_subtitle', I18nScope()))
                                ]),
                                m('.divider.u-marginbottom-20'),
                                m('.w-row', [
                                    m('.w-col.w-col-6.w-sub-col',
                                        m('.input.select.required.user_bank_account_bank_id', [
                                            m(`select.select.required.w-input.text-field.bank-select.positive${(disableFields ? '.text-field-disabled' : '')}[id='user_bank_account_attributes_bank_id']`, {
                                                name: 'user[bank_account_attributes][bank_id]',
                                                onchange: m.withAttr('value', fields.account_type),
                                                disabled: disableFields
                                            }, [
                                                m('option[value=\'pf\']', {
                                                    selected: fields.account_type() === 'pf'
                                                }, I18n.t('account_types.pf', I18nScope())),
                                                m('option[value=\'pj\']', {
                                                    selected: fields.account_type() === 'pj'
                                                }, I18n.t('account_types.pj', I18nScope())),
                                                m('option[value=\'mei\']', {
                                                    selected: fields.account_type() === 'mei'
                                                }, I18n.t('account_types.mei', I18nScope())),
                                            ])
                                        ])
                                    ),
                                ]),
                                m('.w-row', [
                                    m('.w-col.w-col-6.w-sub-col', [
                                        m('label.text.required.field-label.field-label.fontweight-semibold.force-text-dark[for=\'user_bank_account_attributes_owner_name\']',
                                          I18n.t(
                                              (fields.account_type() == 'pf' ? 'pf_label_name' : 'pj_label_name'),
                                              I18nScope()
                                          )
                                        ),
                                        m(`input.string.required.w-input.text-field.positive${(disableFields ? '.text-field-disabled' : '')}[id='user_bank_account_attributes_owner_name'][type='text']`, {
                                            value: fields.name(),
                                            name: 'user[name]',
                                            class: vnode.state.parsedErrors.hasError('name') ? 'error' : false,
                                            onchange: m.withAttr('value', fields.name),
                                            disabled: disableFields
                                        }),
                                        vnode.state.parsedErrors.inlineError('name')
                                    ]),
                                    m('.w-col.w-col-6', [
                                        m('.w-row', [
                                            m('.w-col.w-col-6.w-col-small-6.w-col-tiny-6.w-sub-col-middle', [
                                                m('label.text.required.field-label.field-label.fontweight-semibold.force-text-dark[for=\'user_bank_account_attributes_owner_document\']',
                                                  I18n.t((fields.account_type() == 'pf' ? 'pf_label_document' : 'pj_label_document'), I18nScope())
                                                ),
                                                m(`input.string.tel.required.w-input.text-field.positive${(disableFields ? '.text-field-disabled' : '')}[data-validate-cpf-cnpj='true'][id='user_bank_account_attributes_owner_document'][type='tel'][validation_text='true']`, {
                                                    value: fields.owner_document(),
                                                    class: vnode.state.parsedErrors.hasError('owner_document') ? 'error' : false,
                                                    disabled: disableFields,
                                                    name: 'user[cpf]',
                                                    onchange: m.withAttr('value', vnode.state.applyDocumentMask),
                                                    onkeyup: m.withAttr('value', vnode.state.applyDocumentMask)
                                                }),
                                                vnode.state.parsedErrors.inlineError('owner_document')
                                            ]),
                                            m('.w-col.w-col-6.w-col-small-6.w-col-tiny-6', (fields.account_type() == 'pf' ? [
                                                m('label.text.required.field-label.field-label.fontweight-semibold.force-text-dark[for=\'user_bank_account_attributes_owner_document\']',
                                                  I18n.t('label_birth_date', I18nScope())
                                                ),
                                                m(`input.string.tel.required.w-input.text-field.positive${((disableFields && !_.isEmpty(user.birth_date)) ? '.text-field-disabled' : '')}[data-validate-cpf-cnpj='true'][id='user_bank_account_attributes_owner_document'][type='tel'][validation_text='true']`, {
                                                    value: fields.birth_date(),
                                                    name: 'user[birth_date]',
                                                    class: vnode.state.parsedErrors.hasError('birth_date') ? 'error' : false,
                                                    disabled: (disableFields && !_.isEmpty(user.birth_date)),
                                                    onchange: m.withAttr('value', vnode.state.applyBirthDateMask),
                                                    onkeyup: m.withAttr('value', vnode.state.applyBirthDateMask)
                                                }),
                                                vnode.state.parsedErrors.inlineError('birth_date')
                                            ] : [
                                                m('label.text.required.field-label.field-label.fontweight-semibold.force-text-dark[for=\'user_bank_account_attributes_owner_document\']',
                                                  I18n.t('label_state_inscription', I18nScope())
                                                ),
                                                m('input.string.tel.required.w-input.text-field.positive[data-validate-cpf-cnpj=\'true\'][id=\'user_bank_account_attributes_owner_document\'][type=\'tel\'][validation_text=\'true\']', {
                                                    value: fields.state_inscription(),
                                                    class: vnode.state.parsedErrors.hasError('state_inscription') ? 'error' : false,
                                                    name: 'user[state_inscription]',
                                                    onchange: m.withAttr('value', fields.state_inscription)
                                                }),
                                                vnode.state.parsedErrors.inlineError('state_inscription')
                                            ]))
                                        ])
                                    ])

                                ]),
                            ]),
                            m('.w-form.card.card-terciary.u-marginbottom-20', [
                                m('.fontsize-base.fontweight-semibold',
                                  I18n.t('address_title', I18nScope())
                                ),
                                m('.fontsize-small.u-marginbottom-20.u-marginbottom-20', [
                                    I18n.t('address_subtitle', I18nScope())
                                ]),
                                m('.w-row', [
                                    m('.input.select.optional.user_country.w-col.w-col-6.w-sub-col', [
                                        m('label.field-label',
                                          I18n.t('label_country', I18nScope())
                                        ),
                                        m('select.select.optional.w-input.text-field.w-select.positive[id=\'user_country_id\'][name=\'user[country_id]\']', {
                                            onchange: m.withAttr('value', fields.country_id),
                                            class: vnode.state.parsedErrors.hasError('country_id') ? 'error' : false
                                        }, [
                                            m('option[value=\'\']'),
                                            (!_.isEmpty(vnode.state.countries()) ?
                                                _.map(vnode.state.countries(), country => m(`option${country.id == fields.country_id() ? '[selected="selected"]' : ''}`, {
                                                    value: country.id
                                                },
                                                    country.name_en
                                                )) :
                                                '')
                                        ]),
                                        vnode.state.parsedErrors.inlineError('country_id')
                                    ]),
                                    m('.w-col.w-col-6')
                                ]),
                                m('.w-row', [
                                    m('.input.string.optional.user_address_street.w-col.w-col-6.w-sub-col', [
                                        m('label.field-label',
                                          I18n.t('label_address_street', I18nScope())
                                        ),
                                        m('input.string.optional.w-input.text-field.w-input.text-field.positive[data-required-in-brazil=\'true\'][id=\'user_address_street\'][name=\'user[address_street]\'][type=\'text\']', {
                                            value: fields.street(),
                                            class: vnode.state.parsedErrors.hasError('street') ? 'error' : false,
                                            onchange: m.withAttr('value', fields.street)
                                        }),
                                        vnode.state.parsedErrors.inlineError('street')
                                    ]),
                                    m('.w-col.w-col-6',
                                        m('.w-row', [
                                            m('.input.tel.optional.user_address_number.w-col.w-col-6.w-col-small-6.w-col-tiny-6.w-sub-col-middle', [
                                                m('label.field-label',
                                                  I18n.t('label_address_number', I18nScope())
                                                ),
                                                m('input.string.tel.optional.w-input.text-field.w-input.text-field.positive[id=\'user_address_number\'][name=\'user[address_number]\'][type=\'tel\']', {
                                                    value: fields.number(),
                                                    class: vnode.state.parsedErrors.hasError('number') ? 'error' : false,
                                                    onchange: m.withAttr('value', fields.number)
                                                }),
                                                vnode.state.parsedErrors.inlineError('number')
                                            ]),
                                            m('.input.string.optional.user_address_complement.w-col.w-col-6.w-col-small-6.w-col-tiny-6', [
                                                m('label.field-label',
                                                  I18n.t('label_address_complement', I18nScope())
                                                ),
                                                m('input.string.optional.w-input.text-field.w-input.text-field.positive[id=\'user_address_complement\'][name=\'user[address_complement]\'][type=\'text\']', {
                                                    value: fields.complement(),
                                                    class: vnode.state.parsedErrors.hasError('complement') ? 'error' : false,
                                                    onchange: m.withAttr('value', fields.complement)
                                                }),
                                                vnode.state.parsedErrors.inlineError('complement')
                                            ])
                                        ])
                                    )
                                ]),
                                m('.w-row', [
                                    m('.input.string.optional.user_address_neighbourhood.w-col.w-col-6.w-sub-col', [
                                        m('label.field-label',
                                          I18n.t('label_address_neighbourhood', I18nScope())
                                        ),
                                        m('input.string.optional.w-input.text-field.w-input.text-field.positive[id=\'user_address_neighbourhood\'][name=\'user[address_neighbourhood]\'][type=\'text\']', {
                                            value: fields.neighbourhood(),
                                            class: vnode.state.parsedErrors.hasError('neighbourhood') ? 'error' : false,
                                            onchange: m.withAttr('value', fields.neighbourhood)
                                        }),
                                        vnode.state.parsedErrors.inlineError('neighbourhood')
                                    ]),
                                    m('.input.string.optional.user_address_city.w-col.w-col-6', [
                                        m('label.field-label',
                                          I18n.t('label_address_city', I18nScope())
                                        ),
                                        m('input.string.optional.w-input.text-field.w-input.text-field.positive[data-required-in-brazil=\'true\'][id=\'user_address_city\'][name=\'user[address_city]\'][type=\'text\']', {
                                            value: fields.city(),
                                            class: vnode.state.parsedErrors.hasError('city') ? 'error' : false,
                                            onchange: m.withAttr('value', fields.city)
                                        }),
                                        vnode.state.parsedErrors.inlineError('city')
                                    ])
                                ]),
                                m('.w-row', [
                                    m('.input.select.optional.user_address_state.w-col.w-col-6.w-sub-col', [
                                        m('label.field-label',
                                          I18n.t('label_address_state', I18nScope())
                                        ),
                                        m('select.select.optional.w-input.text-field.w-select.text-field.positive[data-required-in-brazil=\'true\'][id=\'user_address_state\'][name=\'user[address_state]\']', {
                                            class: vnode.state.parsedErrors.hasError('state') ? 'error' : false,
                                            onchange: m.withAttr('value', fields.state)
                                        }, [
                                            m('option[value=\'\']'),
                                            (!_.isEmpty(vnode.state.states()) ?
                                                _.map(vnode.state.states(), state => m(`option[value='${state.acronym}']${state.acronym == fields.state() ? '[selected="selected"]' : ''}`, {
                                                    value: state.acronym
                                                },
                                                    state.name
                                                ))

                                                :
                                                ''),
                                            m('option[value=\'outro / other\']',
                                              I18n.t('label_other_option', I18nScope())
                                            )
                                        ]),
                                        vnode.state.parsedErrors.inlineError('state')
                                    ]),
                                    m('.w-col.w-col-6',
                                        m('.w-row', [
                                            m('.input.tel.optional.user_address_zip_code.w-col.w-col-6.w-col-small-6.w-col-tiny-6.w-sub-col-middle', [
                                                m('label.field-label',
                                                  I18n.t('label_address_zipcode', I18nScope())
                                                ),
                                                m('input.string.tel.optional.w-input.text-field.w-input.text-field.positive[data-fixed-mask=\'99999-999\'][data-required-in-brazil=\'true\'][id=\'user_address_zip_code\'][name=\'user[address_zip_code]\'][type=\'tel\']', {
                                                    value: fields.zipcode(),
                                                    class: vnode.state.parsedErrors.hasError('zipcode') ? 'error' : false,
                                                    onchange: m.withAttr('value', fields.zipcode)
                                                }),
                                                vnode.state.parsedErrors.inlineError('zipcode')
                                            ]),
                                            m('.input.tel.optional.user_phone_number.w-col.w-col-6.w-col-small-6.w-col-tiny-6', [
                                                m('label.field-label',
                                                  I18n.t('label_address_phone', I18nScope())
                                                ),
                                                m('input.string.tel.optional.w-input.text-field.w-input.text-field.positive[data-fixed-mask=\'(99) 9999-99999\'][data-required-in-brazil=\'true\'][id=\'user_phone_number\'][name=\'user[phone_number]\'][type=\'tel\']', {
                                                    value: fields.phonenumber(),
                                                    onchange: m.withAttr('value', fields.phonenumber),
                                                    class: vnode.state.parsedErrors.hasError('phonenumber') ? 'error' : false,
                                                    onkeyup: m.withAttr('value', value => vnode.state.applyPhoneMask(value))
                                                }),
                                                vnode.state.parsedErrors.inlineError('phonenumber')
                                            ])
                                        ])
                                    )
                                ]),
                            ]),
                            (vnode.attrs.hideCreditCards ? '' : m('.w-form.card.card-terciary.u-marginbottom-20', [
                                m('.fontsize-base.fontweight-semibold',
                                  I18n.t('credit_cards.title', I18nScope())
                                ),
                                m('.fontsize-small.u-marginbottom-20',
                                  m.trust(
                                      I18n.t('credit_cards.subtitle', I18nScope())
                                  )
                                ),
                                m('.divider.u-marginbottom-20'),
                                m('.w-row.w-hidden-tiny.card', [
                                    m('.w-col.w-col-5.w-col-small-5',
                                        m('.fontsize-small.fontweight-semibold',
                                          I18n.t('credit_cards.card_label', I18nScope())
                                        )
                                    ),
                                    m('.w-col.w-col-5.w-col-small-5',
                                        m('.fontweight-semibold.fontsize-small',
                                          I18n.t('credit_cards.provider_label', I18nScope())
                                        )
                                    ),
                                    m('.w-col.w-col-2.w-col-small-2')
                                ]),

                                (_.map(vnode.state.creditCards(), card => m('.w-row.card', [
                                    m('.w-col.w-col-5.w-col-small-5',
                                        m('.fontsize-small.fontweight-semibold', [
                                            'XXXX XXXX XXXX',
                                            m.trust('&nbsp;'),
                                            card.last_digits
                                        ])
                                    ),
                                    m('.w-col.w-col-5.w-col-small-5',
                                        m('.fontsize-small.fontweight-semibold.u-marginbottom-10',
                                            card.card_brand.toUpperCase()
                                        )
                                    ),
                                    m('.w-col.w-col-2.w-col-small-2',
                                        m('a.btn.btn-terciary.btn-small[rel=\'nofollow\']', {
                                            onclick: vnode.state.deleteCard(card.id)
                                        },
                                          I18n.t('credit_cards.remove_label', I18nScope())
                                        )
                                    )
                                ]))),
                                m('form.w-hidden', {
                                    action: `/pt/users/${user.id}/credit_cards/${vnode.state.toDeleteCard()}`,
                                    method: 'POST',
                                    config: vnode.state.setCardDeletionForm
                                }, [
                                    m('input[name=\'utf8\'][type=\'hidden\'][value=\'✓\']'),
                                    m('input[name=\'_method\'][type=\'hidden\'][value=\'delete\']'),
                                    m(`input[name='authenticity_token'][type='hidden'][value='${h.authenticityToken()}']`),
                                ])
                            ])),
                        )
                    ),


                    m(projectEditSaveBtn, {
                        loading: vnode.state.loading,
                        onSubmit: vnode.state.onSubmit
                    })

                ])
            ])
        ]);
    }
};

export default userSettings;
