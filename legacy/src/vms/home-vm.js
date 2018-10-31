const homeVM = () => {
    const i18nStart = window.I18n.translations[window.I18n.currentLocale()].projects.home || { banners : [] },
        banners = i18nStart.banners;

    return {
        banners
    };
};

export default homeVM;