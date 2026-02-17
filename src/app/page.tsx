'use client';

import { useState } from 'react';
import styles from './page.module.scss';
import { ButtonSCSS } from '@/components/ButtonSCSS/ButtonSCSS';

const variants = [
  {
    key: 'primary' as const,
    title: 'Primary',
    description: 'High emphasis actions and main CTA.',
  },
  {
    key: 'secondary' as const,
    title: 'Secondary',
    description: 'Supportive actions with balanced emphasis.',
  },
  {
    key: 'tertiary' as const,
    title: 'Tertiary',
    description: 'Low emphasis actions and links.',
  },
];

const sizes = [
  { key: 'sm' as const, label: 'Small' },
  { key: 'md' as const, label: 'Medium' },
  { key: 'lg' as const, label: 'Large' },
];

const scssVariantSnippets: Record<'primary' | 'secondary' | 'tertiary', string> = {
  primary: `.primary-button {\n  background-color: var(--button-primary-fill);\n  color: var(--button-primary-text);\n  border-color: var(--button-primary-stroke);\n}`,
  secondary: `.secondary-button {\n  background-color: var(--button-secondary-fill);\n  color: var(--button-secondary-text);\n  border-color: var(--button-secondary-stroke);\n}`,
  tertiary: `.tertiary-button {\n  background-color: var(--button-tertiary-fill);\n  color: var(--button-tertiary-text);\n  border-color: var(--button-tertiary-stroke);\n}`,
};

const scssSizeSnippets: Record<'sm' | 'md' | 'lg', string> = {
  sm: `.has-sm {\n  padding: var(--space-xs) var(--space-sm);\n  font-size: var(--button-font-size-sm);\n  line-height: var(--button-line-height-sm);\n  border-radius: var(--button-radius-sm);\n  height: var(--button-height-sm);\n}`,
  md: `.has-md {\n  padding: var(--space-xs) var(--space-md);\n  font-size: var(--button-font-size-md);\n  line-height: var(--button-line-height-md);\n  border-radius: var(--button-radius-md);\n  height: var(--button-height-md);\n}`,
  lg: `.has-lg {\n  padding: var(--space-sm) var(--space-md);\n  font-size: var(--button-font-size-lg);\n  line-height: var(--button-line-height-lg);\n  border-radius: var(--button-radius-lg);\n  height: var(--button-height-lg);\n}`,
};

const scssStateSnippets: Record<'primary' | 'secondary' | 'tertiary', { hover: string; disabled: string }> = {
  primary: {
    hover: `.primary-button.hover,\n.primary-button:hover {\n  background-color: var(--button-primary-fill-hover);\n  border-color: var(--button-primary-stroke-hover);\n}`,
    disabled: `.primary-button.disabled,\n.primary-button:disabled {\n  background-color: var(--button-primary-fill-disabled);\n  border-color: var(--button-primary-stroke-disabled);\n  color: var(--button-primary-text-disabled);\n}`,
  },
  secondary: {
    hover: `.secondary-button.hover,\n.secondary-button:hover {\n  background-color: var(--button-secondary-fill-hover);\n  border-color: var(--button-secondary-stroke-hover);\n}`,
    disabled: `.secondary-button.disabled,\n.secondary-button:disabled {\n  background-color: var(--button-secondary-fill-disabled);\n  border-color: var(--button-secondary-stroke-disabled);\n  color: var(--button-secondary-text-disabled);\n}`,
  },
  tertiary: {
    hover: `.tertiary-button.hover,\n.tertiary-button:hover {\n  background-color: var(--button-tertiary-fill-hover);\n  color: var(--button-tertiary-text-hover);\n  border-color: var(--button-tertiary-stroke-hover);\n}`,
    disabled: `.tertiary-button.disabled,\n.tertiary-button:disabled {\n  background-color: var(--button-tertiary-fill-disabled);\n  color: var(--button-tertiary-text-disabled);\n  border-color: var(--button-tertiary-stroke-disabled);\n}`,
  },
};

const states = [
  { key: 'normal', label: 'Normal' },
  { key: 'hover', label: 'Hover' },
  { key: 'disabled', label: 'Disabled' },
] as const;

type StateKey = typeof states[number]['key'];
type CodeViewKey = 'tsx' | 'style';

type SizeKey = 'sm' | 'md' | 'lg';

export default function Home() {
  const [selectedSize, setSelectedSize] = useState<SizeKey>('sm');
  const [stateByCard, setStateByCard] = useState<Record<string, StateKey>>(() => {
    const initial: Record<string, StateKey> = {};
    for (const size of sizes) {
      for (const variant of variants) {
        initial[`${size.key}-${variant.key}`] = 'normal';
      }
    }
    return initial;
  });
  const [codeViewByCard, setCodeViewByCard] = useState<Record<string, CodeViewKey>>(() => {
    const initial: Record<string, CodeViewKey> = {};
    for (const size of sizes) {
      for (const variant of variants) {
        initial[`${size.key}-${variant.key}`] = 'tsx';
      }
    }
    return initial;
  });

  const currentSizeLabel = sizes.find((size) => size.key === selectedSize)?.label ?? 'Small';

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <div className={styles.sidebarTitle}>Components</div>
            <nav className={styles.sidebarNav}>
              <button className={styles.sidebarButton}>
                Button
                <span className={styles.sidebarBadge}>1</span>
              </button>
            </nav>
            <div className={styles.sidebarHint}>More components will appear here.</div>
          </div>
        </aside>

        <div className={styles.content}>
          <header className={styles.header}>
            <div className={styles.eyebrow}>Design Tokens System</div>
            <h1 className={styles.title}>Button Component</h1>
            <p className={styles.subtitle}>
              Each size shows its UI and code in a premium, copy-ready layout.
            </p>
          </header>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.sectionLabel}>Size</p>
                <h2 className={styles.sectionTitle}>{currentSizeLabel}</h2>
              </div>
              <div className={styles.sectionMeta}>
                <span>Primary, secondary, and tertiary variants</span>
                <div className={styles.selectGroup}>
                  <label className={styles.smallLabel}>Size</label>
                  <div className={styles.selectWrap}>
                    <select
                      className={styles.select}
                      value={selectedSize}
                      onChange={(event) => setSelectedSize(event.target.value as SizeKey)}
                    >
                      {sizes.map((size) => (
                        <option key={size.key} value={size.key}>
                          {size.label}
                        </option>
                      ))}
                    </select>
                    <span className={styles.selectIcon} aria-hidden="true">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M3 4.5L6 7.5L9 4.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.cardsGrid}>
              {variants.map((variant) => (
                <div key={`${selectedSize}-${variant.key}`} className={styles.card}>
                  {(() => {
                    const cardKey = `${selectedSize}-${variant.key}`;
                    const selectedState = stateByCard[cardKey] ?? 'normal';
                    const selectedCodeView = codeViewByCard[cardKey] ?? 'tsx';
                    const isHover = selectedState === 'hover';
                    const isDisabled = selectedState === 'disabled';
                    const scssStateLine = isHover ? '\n  showAsHover' : isDisabled ? '\n  disabled' : '';
                    const scssTsxSnippet = `<ButtonSCSS\n  variant="${variant.key}"\n  size="${selectedSize}"${scssStateLine}\n>\n  Label\n</ButtonSCSS>`;

                    return (
                      <>
                        <div className={styles.cardHeader}>
                          <div>
                            <div className={styles.cardTitle}>{variant.title}</div>
                            <div className={styles.cardDesc}>{variant.description}</div>
                          </div>
                          <div className={styles.cardControls}>
                            <span className={styles.pill}>{variant.key}</span>
                            <label className={styles.smallLabel}>State</label>
                            <div className={styles.selectWrap}>
                              <select
                                className={styles.select}
                                value={selectedState}
                                onChange={(event) =>
                                  setStateByCard((prev) => ({
                                    ...prev,
                                    [cardKey]: event.target.value as StateKey,
                                  }))
                                }
                              >
                                {states.map((state) => (
                                  <option key={state.key} value={state.key}>
                                    {state.label}
                                  </option>
                                ))}
                              </select>
                              <span className={styles.selectIcon} aria-hidden="true">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                  <path
                                    d="M3 4.5L6 7.5L9 4.5"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className={styles.preview}>
                          <div className={styles.previewLabel}>Preview</div>
                          <div className={styles.previewArea}>
                            <ButtonSCSS
                              variant={variant.key}
                              size={selectedSize}
                              showAsHover={isHover}
                              disabled={isDisabled}
                            >
                              Label
                            </ButtonSCSS>
                          </div>
                        </div>

                        <div className={styles.code}>
                          <div className={styles.codeHeader}>
                            <div className={styles.codeLabel}>Code</div>
                            <div className={styles.codeToggle}>
                              <button
                                onClick={() =>
                                  setCodeViewByCard((prev) => ({
                                    ...prev,
                                    [cardKey]: 'tsx',
                                  }))
                                }
                                className={`${styles.codeToggleButton} ${selectedCodeView === 'tsx' ? styles.codeToggleActive : ''}`}
                              >
                                TSX
                              </button>
                              <button
                                onClick={() =>
                                  setCodeViewByCard((prev) => ({
                                    ...prev,
                                    [cardKey]: 'style',
                                  }))
                                }
                                className={`${styles.codeToggleButton} ${selectedCodeView === 'style' ? styles.codeToggleActive : ''}`}
                              >
                                SCSS
                              </button>
                            </div>
                          </div>
                          <pre className={styles.codeBlock}>
                            <code>
                              {selectedCodeView === 'tsx'
                                ? scssTsxSnippet
                                : `${scssVariantSnippets[variant.key]}\n\n${scssSizeSnippets[selectedSize]}\n\n${selectedState === 'hover'
                                  ? scssStateSnippets[variant.key].hover
                                  : selectedState === 'disabled'
                                    ? scssStateSnippets[variant.key].disabled
                                    : ''}`.trim()}
                            </code>
                          </pre>
                        </div>
                      </>
                    );
                  })()}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
