import crypto from 'crypto';
import bcrypt from 'bcryptjs'
export const generateEmailVerificationToken = () => {
    const buffer = crypto.randomBytes(30);
    const token = buffer.toString('hex');
    return token;
}
export const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000);
}

export const generatePasswordHash = (password) =>
    new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) reject(err);
            resolve(hash);
        });
    });

export const comparePasswordHash = (password, hash = '') =>
    new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });


export const generateEmailVerifyUrl = (hash, email) => {
    let url;
    if (process.env.NODE_ENVIRONMENT === 'development') {
        url = process.env.FRONTEND_URL_DEV + "/email/verify?" + "hash=" + String(hash) + "&" + "email=" + String(email);

    } else {
        url = process.env.FRONTEND_URL_PROD + "/email/verify?" + "hash=" + String(hash) + "&" + "email=" + String(email);
    }
    console.log(url);
    return url;
}

export const generateRedirectionUrl = (emailHash) => {
    let url;
    if (process.env.NODE_ENVIRONMENT === 'development') {
        url = process.env.FRONTEND_URL_DEV + "/email/forgot-password/" + String(emailHash);

    } else {
        url = process.env.FRONTEND_URL_PROD + "/email/forgot-password?" + String(emailHash);
    }
    console.log(url);
    return url;
}
