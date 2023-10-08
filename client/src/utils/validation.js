export const validateCardNumber = (value) => {
    const cardNumber = value.replace(/\s/g, "");
    if (
        /^(2|5)\d{15}$/.test(cardNumber) ||
        /^4\d{15}$/.test(cardNumber) ||
        /^3\d{14}$/.test(cardNumber)
    ) {
        return Promise.resolve();
    }
    return Promise.reject("Invalid card number");
};

export const validateExpiryDate = (value) => {
    // Check if the expiry date is in MMYYYY format
    if (/^(0[1-9]|1[0-2])(20\d{2})$/.test(value)) {
        return Promise.resolve();
    }
    return Promise.reject("Invalid expiry date (MMYYYY)");
};

export function getPasswordValidationRule(customRules = []) {
    const passwordRules = [
        {
            min: 8,
            message: "Password must contain at least 8 characters!",
        },
        {
            pattern:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            message:
                "Password must contain at least a number, an uppercase, a lowercase, and a special character!",
        },
    ];
    return [...customRules, ...passwordRules];
}
