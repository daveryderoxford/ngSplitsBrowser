// This file is used to configure the test environment.
// You can add global mocks or setup code here.
// Note: The Angular testing environment is initialized automatically by the @angular/build:unit-test builder.

// import '@angular/localize/init'; // Uncomment if you use Angular i18n

import { vi } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// Mock fetch to serve assets from the file system

const mockFetch = (input: any, init?: any) => {
  let url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : (input as any).url;

  // Handle relative URLs resolved by JSDOM (e.g. http://localhost:3000/assets/...)
  if (url && url.startsWith('http://')) {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === 'localhost') {
        url = urlObj.pathname;
      }
    } catch {
      // ignore invalid URLs
    }
  }

  if (url && url.startsWith('/assets/')) {
    const filePath = join(process.cwd(), 'src', url);
    if (existsSync(filePath)) {
      const content = readFileSync(filePath, 'utf-8');
      return Promise.resolve(new Response(content, { status: 200, statusText: 'OK' }));
    } else {
      console.warn(`[Mock Fetch] Asset not found at: ${filePath}`);
      return Promise.resolve(new Response('Asset not found', { status: 404, statusText: 'Not Found' }));
    }
  }

  return Promise.reject(new Error(`Unhandled fetch request: ${url}`));
};

vi.stubGlobal('fetch', mockFetch);
