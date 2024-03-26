## LGU Crawler

A Blazingly fast crawler that scraps all data from the LGU timetable website.

## ✨ What is Special about this project?

- **Blazingly fast 🔥**

  It is capable of retrieving all data in less than a minute, thanks to the `Node Js Cluster` module which allows parallel data fetching by spawning child process(same as OS fork).

- **Zero DB Dependencies 🧠**

  Rather than relying on a database, this crawler stores scraped data in local files. These files subsequently serve as an API endpoint (utilizing Github Raw Content) for the frontend application

- **Zero Compromise on Security 🔐**

  By storing data in local files, there arises a concern regarding privacy, as anyone can access the data by simply opening a GitHub repository. To address this issue we're using the `Node Js crypto` module. The data stored in the file will be encrypted which is later decrypted by the front-end application using `private_key` and `iv`.

- **Intuivtive Code & APIS 🦄**

  This project uses both OOP and functional programming paradigms. for use cases, it exposes event-driven APIS which makes it easier for the the developer to build new applications on top of this project.
