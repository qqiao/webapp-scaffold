module.exports = {
    "parser": "@typescript-eslint/parser",
    "extends": [
        "eslint-config-prettier"
    ],
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        "no-shadow": "off",
        "@typescript-eslint/no-shadow": [
            "error"
        ],
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": [
            "error"
        ],
        "import/no-unresolved": "off",
        "import/extensions": "off"
    }
};
