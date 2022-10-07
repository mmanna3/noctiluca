import {convertirASnakeCase} from './firebase';

test('Espacios y mayúsculas en el medio', () => {
  const resultado = convertirASnakeCase("Las campanas no doblan por nadie");  
  expect(resultado).toBe("las_campanas_no_doblan_por_nadie")
});

test('Elimina comas, puntos y signos de interrogación y admiración', () => {
  const resultado = convertirASnakeCase("¡Hola!, ¿cómo estás?.");  
  expect(resultado).toBe("hola_cómo_estás")
});
