import { I18n } from 'i18n'
import path from 'path'
import { getPaths } from '@elucidario/pkg-paths'
import type { GetPathsReturn } from '@elucidario/pkg-types'

const paths = getPaths();

let directory = '';

if (typeof paths !== typeof Error) {
    directory = path.resolve((paths as GetPathsReturn).packages, '../locales');
}

const i18n = new I18n({
    locales: ['en', 'pt-BR'],
    directory: directory,
    defaultLocale: 'en',
});

export default i18n;