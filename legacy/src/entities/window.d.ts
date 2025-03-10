export type TranslateScopeFunction = (scope : string) => string
export type TranslateParamsScopeFunction = (scope : string, scopeObject : I18ScopeType) => string
export type ThisWindow = Window & typeof globalThis & {
    I18n: {
        locale: string
        currentLocale(): string
        t: TranslateScopeFunction | TranslateParamsScopeFunction,
        translations: {
            [locales:string]: {
                projects: {
                    index: {
                        explore_categories: {
                            [category_id:number] : {
                                icon: string
                                title: string
                                link: string
                                cta: string
                            }
                        }
                    }
                }
            }
        }
    }

    onpushstate(): void
}

export type I18ScopeType = {
    [key:string]: any
    scope: string
}

export declare var window : ThisWindow