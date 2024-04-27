## LGU Crawler

A Blazingly fast crawler that scraps all data from the LGU timetable website.

## ✨ What is Special about this project?

- **Blazingly fast 🔥**

  It is capable of retrieving all data in less than 30 sec, thanks to the `Node Js Cluster` module which allows parallel data fetching by spawning child process(same as OS fork).

- **Zero DB Dependencies 🧠**

  Rather than relying on a database, this crawler stores scraped data in local files. These files subsequently serve as an API endpoint (utilizing Github Raw Content) for the frontend application

- **Zero Compromise on Security 🔐**

  By storing data in local files, there arises a concern regarding privacy, as anyone can access the data by simply opening a GitHub repository. To address this issue we're using the `Node Js crypto` module. The data stored in the file will be encrypted which is later decrypted by the front-end application using `private_key` and `iv`.

- **Intuivtive Code & APIS 🦄**

  This project uses both OOP and functional programming paradigms. for use cases, it exposes event-driven APIS which makes it easier for the the developer to build new applications on top of this project.

## API Usage

Developers can use scrapped data on their websites using [Github raw APIS](https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28). Even though data is public and can be accessed easily using HTTP requests but decryption is required to turn data into human readable.

This is how data encryption works and how you should approach it.

- **Plan Text:** In the db folder every file name is encrypted with a `sha-256` hash except a few. these files are useful for loading initial data like `meta_data.json` which contains all drop-down data.

- **File data decryption:** Every file in the DB contains `crypted` text and some metadata which is helpful to know about which `encoding` and `algorithm` is being used. To decrypt files `key` ([check symmetric key algorithm](https://en.wikipedia.org/wiki/Symmetric-key_algorithm))and [`iv`](https://en.wikipedia.org/wiki/Initialization_vector) is also required. These credentials can be obtained by contacting the maintainer in the issue or discussion section.

- **File names:** All file names are hashed by the `sha-256` algorithm. To generate hash from user input the input must be arranged in the following order ``${semester} ${program} ${section}`.replaceAll("/", "")`` before passing to hash function.

**Diagram:**

```md
GET -> meta_data.json
|
| --> Generate hash from user input ('<semester> <program> <section>'.replaceAll('/', ''))
|
| --> GET base_url/generated_hash.json => timetable
```

## Usage

- **Download Source Code**

  ```bash
  git clone <this_repo>
  ```

  > OR

  [**Download**](https://github.com/Zain-ul-din/lgu-crawler/archive/refs/heads/master.zip)

- **Prepare Environment Variables**

  - create `.env` file in the root of the project.

  ```.env
  NODE_ENV="development" # recommended if running locally

  # Note! default keys will work replace with your own keys if needed.
  OPEN_DB_KEY="ae3ca465683436cbfd33e2ddd4aa0fcf9fbfcfe26d29379e111a01462f87ebeb" # Must be 32 characters
  OPEN_DB_IV="0bf4254a8293e5aedcdfcb8095c08ffa" # Must be 16 characters

  # get session id from LGU timetable website
  PHPSESSID=""
  ```

  - paste following code in .env with your values.

  **Appendix:**

  - [How to Get Session ID?](https://github.com/IIvexII/LGU-TimetableAPI/blob/main/docs/How_to_get_session.md)
  - To generate key and iv run `openssl rand -hex <size 32 | 16>`

- **Run**
  ```bash
    npx yarn
    npx yarn dev
  ```
