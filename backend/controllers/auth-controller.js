const auth = require('../auth')
const User = require('../models/user-model')
const PasswordSent = require('../models/password-sent')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.emailUser,
        pass: process.env.emailPassword
    }
});

getLoggedIn = async (req, res) => {
    try {
        let userId = auth.verifyUser(req);
        if (!userId) {
            return res.status(400).json({
                loggedIn: false,
                user: null,
                errorMessage: "?"
            })
        }

        const loggedInUser = await User.findOne({ _id: userId });

        return res.status(200).json({
            loggedIn: true,
            user: {
                firstName: loggedInUser.firstName,
                lastName: loggedInUser.lastName,
                email: loggedInUser.email
            }
        })
    } catch (err) {
        res.json(false);
    }
}

loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }

        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return res
                .status(401)
                .json({
                    errorMessage: "Wrong email or password provided."
                })
        }

        const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
        if (!passwordCorrect) {
            return res
                .status(401)
                .json({
                    errorMessage: "Wrong email or password provided."
                })
        }

        const token = auth.signToken(existingUser._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: true
        }).status(200).json({
            success: true,
            user: {
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,
                email: existingUser.email
            }
        })

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

logoutUser = async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: true,
        sameSite: "none"
    }).send();
}

registerUser = async (req, res) => {
    try {
        const { firstName, lastName, username, email, password, passwordVerify } = req.body;
        if (!firstName || !lastName || !username || !email || !password || !passwordVerify) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }
        if (password !== passwordVerify) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter the same password twice."
                })
        }
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this email address already exists."
                })
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);
        const newMapArr = []

        const newUser = new User({
            firstName, lastName, username, email, passwordHash, newMapArr
        });
        const savedUser = await newUser.save();

        // LOGIN THE USER
        const token = auth.signToken(savedUser._id);

        await res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email
            }
        })

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

passwordemail = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        const now = Date.now();
        const expiration = now + (24 * 60 * 60 * 1000);
        const uniqueString = uuidv4();
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            await PasswordSent.findOneAndRemove({ email: email })
            const newPasswordEmail = new PasswordSent({ uniqueHash: uniqueString, expirationDate: expiration, email: email });
            await newPasswordEmail.save();
            const encodedEmail = encodeURIComponent(email)
            const textReset = "This link expires after 24 hours: " + process.env.REACT_APP_API_URL + "resetpassword" + "?email=" + encodedEmail + "&key=" + uniqueString;
            const mailOptions = {
                from: '"Your World" <yourworld.donotreply@gmail.com>',
                to: `${email}`,
                subject: 'Password Reset',
                text: textReset
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                    // do something useful
                }
            });
        }
        return res.status(200).send();
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
}

passwordreset = async (req, res) => {
    try {
        const { password, email, uniqueID } = req.body;
        if (!email || !password || !uniqueID) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }
        const existingUser = await User.findOne({ email: email });
        const passwordUser = await PasswordSent.findOne({ email: email })
        if (!existingUser || !passwordUser) {
            return res
                .status(400)
                .json({
                    errorMessage: "User with that email does not exist"
                });
        } else if (passwordUser.expirationDate < Date.now()) {
            await PasswordSent.findOneAndRemove({ _id: passwordUser._id });
            return res
                .status(400)
                .json({
                    errorMessage: "This link no longer works"
                });
        } else if (uniqueID != passwordUser.uniqueHash) {
            return res
                .status(400)
                .json({
                    errorMessage: "Unique ID does not belong to this user"
                });
        } else {
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            const passwordHash = await bcrypt.hash(password, salt);
            existingUser.passwordHash = passwordHash;
            await existingUser.save();
            await PasswordSent.findOneAndRemove({ _id: passwordUser._id });
            return res.status(200).json({ success: true })
        }

    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
}

module.exports = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    passwordemail,
    passwordreset
}