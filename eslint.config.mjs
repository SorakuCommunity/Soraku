import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // ── Downgrade ke warning (tidak break build) ──────────────
      "react/no-unescaped-entities": "warn",          // Fix: escape " dalam JSX → &quot;
      "@typescript-eslint/no-unused-vars": "warn",    // Fix: hapus unused import
      "@next/next/no-img-element": "warn",            // Fix: ganti <img> → <Image />
      "react-hooks/exhaustive-deps": "warn",          // Fix: tambah deps di useEffect
    },
  },
];

export default eslintConfig;
