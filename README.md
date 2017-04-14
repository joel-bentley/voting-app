# voting-app
A voting app for user generated polls

(React / Node / MongoDB / OAuth)

**Live Demo:** https://joel-bentley-voting-app.herokuapp.com/

---

To use, first add `.env` files in project root and client directories. These files require info from Oauth application setup on your Github account.
Use yarn to install dependencies within root and client directories.

For development, type `npm run dev`

For production, First run `npm run build` within client directory, then run `npm start` from root.

To deploy to Heroku: create and checkout a deploy branch, build client app after setting proper env variables, remove build directory from `.gitignore` so files included in commit, and then push this branch to heroku master.
