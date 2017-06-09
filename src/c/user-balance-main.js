/**
 * window.c.userBalanceMain component
 * A root component to show user balance and transactions
 *
 * Example:
 * To mount this component just create a DOM element like:
 * <div data-mithril="UsersBalance" data-parameters="{'user_id': 10}">
 */
import m from 'mithril';
import postgrest from 'mithril-postgrest';
import _ from 'underscore';
import models from '../models';
import userBalance from './user-balance';
import userBalanceTransactions from './user-balance-transactions';

const userBalanceMain = {
    oninit(vnode) {
        const userIdVM = postgrest.filtersVM({ user_id: 'eq' });

        userIdVM.user_id(vnode.attrs.user_id);

        // Handles with user balance request data
        const balanceManager = (() => {
                const collection = console.warn("m.prop has been removed from mithril 1.0") || m.prop([{ amount: 0, user_id: vnode.attrs.user_id }]),
                    load = () => {
                        models.balance.getRowWithToken(userIdVM.parameters()).then(collection);
                    };

                return {
                    collection,
                    load
                };
            })(),

              // Handles with user balance transactions list data
            balanceTransactionManager = (() => {
                const listVM = postgrest.paginationVM(
                      models.balanceTransaction, 'created_at.desc'),
                    load = () => {
                        listVM.firstPage(userIdVM.parameters());
                    };

                return {
                    load,
                    list: listVM
                };
            })(),

              // Handles with bank account to check
            bankAccountManager = (() => {
                const collection = console.warn("m.prop has been removed from mithril 1.0") || m.prop([]),
                    loader = (() => postgrest.loaderWithToken(
                                models.bankAccount.getRowOptions(
                                    userIdVM.parameters())))(),
                    load = () => {
                        loader.load().then(collection);
                    };

                return {
                    collection,
                    load,
                    loader
                };
            })();

        return {
            bankAccountManager,
            balanceManager,
            balanceTransactionManager
        };
    },
    view(vnode) {
        const opts = _.extend({}, vnode.attrs, vnode.state);
        return m('#balance-area', [
            m(userBalance, opts),
            m('.divider'),
            m(userBalanceTransactions, opts),
            m('.u-marginbottom-40'),
            m('.w-section.section.card-terciary.before-footer')
        ]);
    }
};

export default userBalanceMain;
