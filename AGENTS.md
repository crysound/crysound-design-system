# Working on CRYSOUND Design System

- Read README.md, docs/architecture.md and docs/design-review.md before changing foundations.
- Treat packages/tokens/src/tokens.css as the token source; run npm run tokens:sync after edits and commit generated JSON.
- Keep shared components in packages/ui. Keep hardware protocols, authentication, API requests and customer business rules in consuming applications.
- Use semantic CSS variables, native HTML semantics and typed React props. Use Radix for the existing Dialog behavior rather than recreating focus handling.
- Preserve error, loading, disabled, empty and keyboard behavior. Add meaningful interaction tests when changing these contracts.
- Root-level theme attributes must propagate to portals. Validate customer overrides in light and dark modes.
- Mark proposed design values explicitly. Do not claim full Figma parity from a representative sample or metadata alone.
- Do not copy commercial Figma assets, PRO components or brand logos without verified rights and an intentional scope.
- Run npm run check before delivery. Keep the lockfile updated when changing dependencies.
