# Grepdle

Yet another [Wordle](https://www.powerlanguage.co.uk/wordle/) clone,
now made to be easily [`grep`](https://en.wikipedia.org/wiki/Grep)'d.
An example is hosted at [https://tjfjr.net/grepdle](https://tjfjr.net/grepdle).

The word list is `grep -E '^[a-z]{5}$' /usr/share/dict/words` (on Arch
Linux, other systems may vary). If you don't like the word list, blame the [GNU
Aspell](https://ftp.gnu.org/gnu/aspell/dict/0index.html) project.

Grepdle contains no tracking, cookies, or non-free JavaScript.
It shares no code with the original Wordle.
