import CSL from "citeproc";
import axios from "axios";

export const engine = async (references) => {
    // @todo converter para um cache local que armazena estes xmls e outros de alguma forma que o usuário possa buscar qual xml utilizar
    // seria legal uma interface com o inquirer para realizer um fetch search no repo do csl styles e do csl locales
    const langUrl =
        "https://raw.githubusercontent.com/citation-style-language/locales/master/locales-pt-BR.xml";
    const lang = await axios.get(langUrl).then((res) => {
        return res.data;
    });
    const styleUrl =
        "https://raw.githubusercontent.com/citation-style-language/styles/08e65fc8e10da6ffec9994024aa8720663fc335b/universidade-de-sao-paulo-escola-de-comunicacoes-e-artes-abnt.csl";
    const style = await axios.get(styleUrl).then((res) => {
        return res.data;
    });

    const sys = {
        retrieveLocale: function () {
            return lang;
        },
        retrieveItem: function (id) {
            const selected = references.find((ref) => ref.id === id);
            return selected;
        },
    };

    return new CSL.Engine(sys, style);
};
