module.exports = {
    "parser": "@typescript-eslint/parser",
    "extends": [
        "eslint-config-prettier"
    ],
    "plugins": [
        "@typescript-eslint"
    ],
    env: {
        browser: true
    },
    "rules": {
        "no-shadow": "off",
        "@typescript-eslint/no-shadow": [
            "error"
        ],
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": [
            "error", { "argsIgnorePattern": "^_" }
        ],
        "import/no-unresolved": "off",
        "import/extensions": "off"
    }
};
