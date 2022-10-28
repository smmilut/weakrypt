# WeaKrypt

## Description

Experiment with encrypted messages from a web browser.

## What this does

Encrypt/decrypt with a password, using PBKDF2

## Technical notes

The Initialization Vector is provided with the message and can be public, because, as stated by the documentation :

> The initialization vector. Must be 16 bytes, unpredictable, and preferably cryptographically random. However, it need not be secret (for example, it may be transmitted unencrypted along with the ciphertext). 

The Salt is also provided with the message and can be public, because, as stated by the [documentation](https://datatracker.ietf.org/doc/html/rfc2898) :

> The salt can be viewed as an index into a large set of keys derived from the password, and need not be kept secret.

## Usage

This requires a secure context to work (HTTPS).

## Disclaimer

This is done for fun and without actual knowledge of cryptography or security. Use at your own risk.

## License

The code in this project is licensed under the MIT license as described in the `LICENSE` file.

The assets of this project are licensed under [Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/) attributed to Pil Smmilut, except if otherwise specified.
