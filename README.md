# pubgen cli

🚀 **CLI App: PUBGEN**

Welcome to PUBGEN, this's Command-Line Interface (CLI) application designed to generate
template an ebook, that i wanna to read but the ebook that i download on internet is always
broken font, css style, the text out of margin i mean i don't know how to fix that kinda
things, and maybe maybe the ebook apps reader has broken or my phone broken, cause that i
write a cli app with basic command that can perform to create an regular epub not fancy
at all. And actually this project's excercise to implement what i learn how to code
in internet, i wanna be an engineer hope that's is come true 🔥

### Table of Contents

- [Getting Started]()
- [Features 💻]()
- [Command ⌨️](️)

### Getting Started

To get started install pubgen cli app, follow these steps:

```bash
git clone https://github.com/adnanmugu/pubgen.git
```

<!-- ```bash
npm install pubgen-cli
``` -->

Navigate your directory to the project directory

```bash
cd pubgen-cli
```

Install dependencies

```bash
npm install
```

Run the CLI app:

```bash
pub [command]
```

## Features:

- **Interactive command-line interface** offers a user-friendly interactive command-line interface, allowing users to navigate and execute tasks seamlessly.

Command:

- `init` initilize the project directory and request metadata from users
  - `-y` `--yes`
- `book` generates ebook assets, edit metadata and other
  - `-d` `--metadata`
  - `-u` `--update`
  - `-t` `--trim`
  - `-s` `--sass`
