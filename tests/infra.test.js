const fs = require('fs');
const path = require('path');

const dockerfile = fs.readFileSync(path.join(__dirname, '../Dockerfile'), 'utf8');
const dockerCompose = fs.readFileSync(path.join(__dirname, '../docker-compose.yml'), 'utf8');
const dockerIgnore = fs.readFileSync(path.join(__dirname, '../.dockerignore'), 'utf8');

describe('Infrastructure Validation', () => {
  it('should have multi-stage Dockerfile with Node 20', () => {
    expect(dockerfile).toContain('FROM node:20-alpine AS base');
    expect(dockerfile).toContain('AS dependencies');
    expect(dockerfile).toContain('AS build');
    expect(dockerfile).toContain('AS production');
    expect(dockerfile).toContain('AS development');
  });

  it('should configure docker-compose with development target and volumes', () => {
    expect(dockerCompose).toContain('target: development');
    expect(dockerCompose).toContain('"3000:3000"');
    expect(dockerCompose).toContain('./history.json:/app/history.json');
    expect(dockerCompose).toContain('.:/app');
    expect(dockerCompose).toContain('/app/node_modules');
  });

  it('should ignore node_modules and dist in .dockerignore', () => {
    expect(dockerIgnore).toMatch(/^node_modules$/m);
    expect(dockerIgnore).toMatch(/^dist$/m);
  });

  it('should verify production stage uses --omit=dev', () => {
    expect(dockerfile).toContain('npm install --omit=dev');
  });
});