# WeaKrypt

## Description

Experiment with encrypted messages from a web browser.

## What this does

Encrypt/decrypt with a password, using PBKDF2

## Technical notes

The Initialization Vector is provided with the message and can be public, because, as stated by the [documentation](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt) :

> The initialization vector. Must be 16 bytes, unpredictable, and preferably cryptographically random. However, it need not be secret (for example, it may be transmitted unencrypted along with the ciphertext). 

The Salt is also provided with the message and can be public, because, as stated by the [documentation](https://datatracker.ietf.org/doc/html/rfc2898) :

> The salt can be viewed as an index into a large set of keys derived from the password, and need not be kept secret.

## Usage

This requires a secure context to work (HTTPS).

Provide a password and a clear message, and this tool will encrypt the message and put it in your clipboard.

Provide a password and a encrypted message, and this tool will decrypt the message and put it in your clipboard.

## Privacy

The page contains no trackers or analytics, and uses no cookies. No information is extracted from your usage of the page.

In particular, as you can see in the code, I do nothing with passwords. All cryptography is done locally in your browser. The only reason this page needs to be used live is because the browser functions require a secure context (HTTPS).

Code is easy to introspect because it is not minified or obscured (though badly written probably). The scripts are simple and use no external dependencies.

## Disclaimer

This is done for fun and without actual knowledge of cryptography or security. Use at your own risk.

## License

The code in this project is licensed under the MIT license as described in the `LICENSE` file.

The assets of this project are licensed under [Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/) attributed to Pil Smmilut, except if otherwise specified.
