const ld = "https://linked.art/api/1.0/schema/object.json";

const schema = await fetch(ld).then((response) => response.json());

console.log({ schema });
