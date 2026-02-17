import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to resolve aliases like {base.blue.50}
function resolveAlias(value, baseTokens) {
    if (typeof value !== 'string') return value;

    const aliasMatch = value.match(/^\{(.+)\}$/);
    if (!aliasMatch) return value;

    const tokenPath = aliasMatch[1].split('.');
    let resolved = baseTokens;

    for (const key of tokenPath) {
        if (resolved && resolved[key]) {
            resolved = resolved[key];
        } else {
            console.warn(`Warning: Could not resolve alias ${value}`);
            return value;
        }
    }

    if (resolved && typeof resolved === 'object' && resolved.value !== undefined) {
        return resolveAlias(resolved.value, baseTokens);
    }

    return resolved;
}

// Helper to flatten nested tokens for easier iteration
function flattenTokens(obj, prefix = '', result = {}) {
    for (const [key, val] of Object.entries(obj)) {
        const newKey = prefix ? `${prefix}-${key}` : key;

        if (val && typeof val === 'object' && val.value !== undefined) {
            result[newKey] = val.value;
        } else if (val && typeof val === 'object' && !val.type) {
            flattenTokens(val, newKey, result);
        }
    }
    return result;
}

function removePrefix(name, prefix) {
    if (name.startsWith(prefix + '-')) {
        return name.substring(prefix.length + 1);
    }
    return name;
}

function firstNonEmpty(...candidates) {
    for (const candidate of candidates) {
        if (candidate && Object.keys(candidate).length > 0) {
            return candidate;
        }
    }
    return {};
}

function normalizeFontWeight(value) {
    if (typeof value !== 'string') return value;
    return value.endsWith('px') ? value.slice(0, -2) : value;
}

async function buildTokens() {
    const tokensPath = path.join(__dirname, '../tokens.json');
    const cssOutputDir = path.join(__dirname, '../src/styles');

    if (!fs.existsSync(cssOutputDir)) {
        fs.mkdirSync(cssOutputDir, { recursive: true });
    }

    const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));

    // Output files
    const tokensCSSPath = path.join(cssOutputDir, 'tokens.css');

    let tokensCSS = '/**\n * Design Tokens - Auto-generated from tokens.json\n * DO NOT EDIT MANUALLY - Run \'npm run tokens:build\' to regenerate\n * Source: Figma Token Studio\n */\n\n:root {\n';

    // 1. Foundation Base Tokens
    const foundationValue = tokens['Foundation/Value'] || {};
    const foundationBase = foundationValue['base'] || {};
    const flatBaseColors = flattenTokens(foundationBase);

    tokensCSS += '\n  /* ===== Foundation: Base Colors ===== */\n';
    for (const [name, value] of Object.entries(flatBaseColors)) {
        tokensCSS += `  --base-${name}: ${value};\n`;
    }

    // 2. Foundation Numeric/Dimension Tokens (Spacing, Sizes, Radius)
    const numericTokens = foundationValue['Numeric'] || {};

    // Process foundation spacing tokens
    const spacingTokens = firstNonEmpty(
        numericTokens['space'],
        foundationBase['space'],
        tokens['space/Mode 1'],
    );
    const flatSpacing = flattenTokens(spacingTokens);
    tokensCSS += '\n  /* ===== Foundation: Spacing ===== */\n';
    for (const [name, tokenValue] of Object.entries(flatSpacing)) {
        const cleanName = removePrefix(name, 'space');
        tokensCSS += `  --space-${cleanName}: ${tokenValue};\n`;
    }

    // Process foundation size tokens
    const sizeTokens = firstNonEmpty(
        numericTokens['size'],
        foundationBase['size'],
        tokens['size/Mode 1'],
    );
    const flatSizes = flattenTokens(sizeTokens);
    tokensCSS += '\n  /* ===== Foundation: Sizes ===== */\n';
    for (const [name, tokenValue] of Object.entries(flatSizes)) {
        const cleanName = removePrefix(name, 'size');
        tokensCSS += `  --size-${cleanName}: ${tokenValue};\n`;
    }

    // Process foundation radius tokens
    const radiusTokens = firstNonEmpty(
        numericTokens['radius'],
        foundationBase['radius'],
        tokens['Radius/Mode 1'],
    );
    const flatRadius = flattenTokens(radiusTokens);
    tokensCSS += '\n  /* ===== Foundation: Border Radius ===== */\n';
    for (const [name, tokenValue] of Object.entries(flatRadius)) {
        const cleanName = removePrefix(name, 'radius');
        tokensCSS += `  --radius-${cleanName}: ${tokenValue};\n`;
    }

    // 3. Semantic Tokens
    const semanticValue = tokens['Semantic/Value'] || {};

    // Fill Colors
    const fillTokens = semanticValue['fill'] || {};
    const flatFills = flattenTokens(fillTokens);
    tokensCSS += '\n  /* ===== Semantic: Fill Colors (backgrounds) ===== */\n';
    for (const [name, value] of Object.entries(flatFills)) {
        const resolved = resolveAlias(value, foundationValue);
        tokensCSS += `  --fill-${name}: ${resolved};\n`;
    }

    // Stroke Colors
    const strokeTokens = semanticValue['stroke'] || {};
    const flatStrokes = flattenTokens(strokeTokens);
    tokensCSS += '\n  /* ===== Semantic: Stroke Colors (borders) ===== */\n';
    for (const [name, value] of Object.entries(flatStrokes)) {
        const resolved = resolveAlias(value, foundationValue);
        tokensCSS += `  --stroke-${name}: ${resolved};\n`;
    }

    // Text Colors
    const textTokens = semanticValue['text'] || {};
    const flatText = flattenTokens(textTokens);
    tokensCSS += '\n  /* ===== Semantic: Text Colors ===== */\n';
    for (const [name, value] of Object.entries(flatText)) {
        const resolved = resolveAlias(value, foundationValue);
        tokensCSS += `  --text-${name}: ${resolved};\n`;
    }

    // 4. Component Tokens (Specifically buttons)
    const componentValue = firstNonEmpty(
        tokens['Components/Mode 1'],
        tokens['Component/Value'],
        tokens['Components/Value'],
        tokens['Component/Mode 1'],
    );
    const buttonTokens = componentValue['button'] || {};
    const flatButtons = flattenTokens(buttonTokens);

    tokensCSS += '\n  /* ===== Component Tokens ===== */\n';
    let componentTokenCount = 0;
    for (const [name, aliasValue] of Object.entries(flatButtons)) {
        const varName = `--button-${name}`;
        const resolved = resolveAlias(aliasValue, { ...foundationValue, ...semanticValue });
        tokensCSS += `  ${varName}: ${resolved};\n`;
        componentTokenCount++;
    }

    tokensCSS += '}\n';

    // Write files
    fs.writeFileSync(tokensCSSPath, tokensCSS);

    console.log(`✅ Tokens built successfully!`);
    console.log(`   Input:  ${tokensPath}`);
    console.log(`   Output: ${tokensCSSPath}`);
    console.log(`\n   Generated tokens:`);
    console.log(`   - ${Object.keys(flatBaseColors).length} foundation base colors`);
    console.log(`   - ${Object.keys(flatFills).length} semantic fill colors`);
    console.log(`   - ${Object.keys(flatStrokes).length} semantic stroke colors`);
    console.log(`   - ${Object.keys(flatText).length} semantic text colors`);
    console.log(`   - ${Object.keys(flatSpacing).length} foundation spacing tokens`);
    console.log(`   - ${Object.keys(flatSizes).length} foundation size tokens`);
    console.log(`   - ${Object.keys(flatRadius).length} foundation radius tokens`);
    console.log(`   - ${componentTokenCount} component tokens`);
    console.log('\n   🎉 All files auto-generated! No manual CSS changes needed.');
}

buildTokens().catch(console.error);
