import { I18n } from 'i18n'
import path from 'path'
import esm from 'esm'
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const i18n = new I18n({
    locales: ['en', 'pt-BR'],
    directory: path.resolve(__dirname.toString().split(':')[1], '../locales'),
    defaultLocale: 'en',
});

export default i18n;