// import { useMemo } from "react";

// export const useTranslations = () => {
//     const { label, description } = useMemo(() => {
//         return {
//             // Traduz o label do campo
//             label: (() => {
//                 if (translations && language) {
//                     const label = translations.label.find(
//                         ({ lang }: { lang: string; content: string }) =>
//                             lang === language,
//                     );
//                     if (label) return label.content;
//                 }
//                 return schema.title ? schema.title : name;
//             })(),

//             // Traduz a descrição do campo
//             description: (() => {
//                 if (translations && language) {
//                     const description = translations.description.find(
//                         ({ lang }: { lang: string; content: string }) =>
//                             lang === language,
//                     );
//                     if (description) return description.content;
//                 }
//                 return schema.description;
//             })(),
//         };
//     }, [schema, translations, map, language]);
// };
