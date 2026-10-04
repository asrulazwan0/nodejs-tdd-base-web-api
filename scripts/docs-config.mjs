import { readFile } from 'node:fs/promises';

export const project = JSON.parse(
  await readFile(new URL('../package.json', import.meta.url), 'utf8'),
);
export const repository = 'https://github.com/asrulazwan0/nodejs-tdd-base-web-api';
export const basePath = process.env.DOCS_BASE_PATH ?? '/nodejs-tdd-base-web-api/';
if (!/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(basePath)) {
  throw new Error(
    'DOCS_BASE_PATH must be / or slash-delimited path segments, with a trailing slash.',
  );
}
export const output = new URL('../.site/', import.meta.url);
export const pages = [
  {
    slug: '',
    label: 'Overview',
    source: 'docs/site/index.md',
    description:
      'A test-first TypeScript API foundation with Jest, MySQL, and a complete profile CRUD example.',
  },
  {
    slug: 'quickstart',
    label: 'Quickstart',
    source: 'README.md',
    description:
      'Run the starter with Node.js and MySQL, or with Docker Compose, on Linux or Windows.',
  },
  {
    slug: 'tdd',
    label: 'Test-first development',
    source: 'docs/tdd.md',
    description: 'Choose test boundaries and practice a runnable red, green, refactor exercise.',
  },
  {
    slug: 'architecture',
    label: 'Architecture',
    source: 'docs/architecture.md',
    description:
      'Understand controllers, services, repositories, explicit dependencies, and adding a feature.',
  },
  {
    slug: 'api',
    label: 'API reference',
    source: 'openapi.json',
    description:
      'Endpoints, pagination, UUID parameters, requests, responses, and schemas generated from OpenAPI.',
  },
  {
    slug: 'operations',
    label: 'Operations',
    source: 'docs/operations.md',
    description:
      'Configuration, MySQL provisioning, migrations, health checks, and deployment recovery.',
  },
  {
    slug: 'contributing',
    label: 'Contributing',
    source: 'CONTRIBUTING.md',
    description: 'Development checks, review expectations, and supported workflows.',
  },
  {
    slug: 'releases',
    label: 'Changelog',
    source: 'CHANGELOG.md',
    description: 'Release changes, fixes, and compatibility notes.',
  },
  {
    slug: 'security',
    label: 'Security',
    source: 'SECURITY.md',
    description:
      'Private vulnerability reporting, supported versions, and deployment responsibilities.',
  },
  {
    slug: 'verification',
    label: 'Verification evidence',
    source: 'docs/verification-evidence.md',
    description: 'Release evidence for tests, coverage, native startup, and Docker workflows.',
  },
];
export const pageUrl = (page) => `${basePath}${page.slug ? `${page.slug}/` : ''}`;
