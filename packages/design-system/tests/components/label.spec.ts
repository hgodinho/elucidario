/**
 * @jest-environment jsdom
 */

import { configureAxe, toHaveNoViolations } from 'jest-axe';
import React from 'react';
import { createRoot } from 'react-dom/client';

import { components } from '../dist/index.esm.js';

expect.extend(toHaveNoViolations);

const axe = configureAxe({
    rules: {
        // disable landmark rules
        region: { enabled: false },
    },
});

const element = document.createElement('div');
element.setAttribute('id', 'root');
document.body.appendChild(element);
const root = createRoot(document.getElementById('root'));
