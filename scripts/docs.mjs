import { readFileSync, writeFileSync } from 'node:fs';
const spec = JSON.parse(readFileSync(new URL('../openapi.json', import.meta.url), 'utf8'));
// The checked-in OpenAPI is authoritative. Derive request examples from its declared operations.
const requests = Object.entries(spec.paths).flatMap(([path, operations]) =>
  Object.keys(operations)
    .filter((method) => ['get', 'post', 'put', 'delete'].includes(method))
    .map((method) => ({
      name: `${method.toUpperCase()} ${path}`,
      request: {
        method: method.toUpperCase(),
        url: `{{baseUrl}}${path.replace('{id}', '{{userId}}')}`,
        ...(operations[method].requestBody
          ? {
              header: [{ key: 'Content-Type', value: 'application/json' }],
              body: {
                mode: 'raw',
                raw: JSON.stringify(
                  method === 'post'
                    ? { email: 'profile@example.test', firstName: 'Example', lastName: 'Profile' }
                    : { firstName: 'Updated' },
                  null,
                  2,
                ),
              },
            }
          : {}),
      },
    })),
);
writeFileSync(
  new URL('../postman-collection.json', import.meta.url),
  JSON.stringify(
    {
      info: {
        name: spec.info.title,
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
      },
      variable: [
        { key: 'baseUrl', value: 'http://localhost:3000' },
        { key: 'userId', value: '' },
      ],
      item: requests,
    },
    null,
    2,
  ) + '\n',
);
console.info('Derived Postman collection from openapi.json.');
