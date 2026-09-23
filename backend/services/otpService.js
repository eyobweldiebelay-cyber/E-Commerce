const crypto = require("crypto");


// Generate 6 digit OTP
const generateOTP = () => {

    return crypto
        .randomInt(100000, 1000000)
        .toString();
};


// OTP expiration
const getOTPExpiration = () => {

    const expiration = new Date();

    expiration.setMinutes(
        expiration.getMinutes() + 5
    );

    return expiration;
};


module.exports = {
    generateOTP,
    getOTPExpiration
};