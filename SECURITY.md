# SECURITY.md — Framer Motion Security Guidelines

> Client-side security policies, text sanitization, and SVG path safety for Framer Motion Handbook.

---

## 🔒 1. Client-Side Security Scope

Framer Motion components operate strictly in the client browser runtime. Security practices focus on preventing client-side Cross-Site Scripting (XSS) and DOM injection vectors:

### 1. Text & Typographic Sanitization
- **Rule**: In text animation components (`SplitTextReveal`, `TypewriterEffect`, `ScrambleText`), user-provided dynamic text MUST NEVER be rendered using `dangerouslySetInnerHTML`.
- Dynamic strings must always be parsed into standard React text nodes or primitive string slices:
  ```tsx
  // ✅ Safe: React automatically escapes string values
  <span>{char}</span>

  // ❌ Unsafe: Vulnerable to XSS injection
  <span dangerouslySetInnerHTML={{ __html: char }} />
  ```

### 2. SVG Path Injection Prevention
- When accepting dynamic SVG paths in morphing or path-drawing components, enforce strict regex validation ensuring the path string only contains valid SVG path commands (`M`, `L`, `C`, `Z`, `H`, `V`, `S`, `Q`, `T`, `A` and numeric coordinates):
  ```typescript
  const SAFE_SVG_PATH_REGEX = /^[MmLlHhVvCcSsQqTtAaZz0-9\s,.-]+$/;
  export function isValidSvgPath(d: string): boolean {
    return SAFE_SVG_PATH_REGEX.test(d);
  }
  ```

### 3. Zero External Telemetry & Analytics
- The Framer Motion Handbook contains **zero telemetry**, tracking pixels, or external network requests.
- All code is 100% self-contained and safe for deployment in air-gapped or HIPAA/SOC2-compliant environments.
