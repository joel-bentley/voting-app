# voting-app
Built for Voting App challenge on Free Code Camp. This project builds off my custom boilerplate project, fcc-starter.

**Live Demo:** https://joel-bentley-voting-app.herokuapp.com/

---

User story requirements for this project: (<https://www.freecodecamp.com/challenges/build-a-voting-app>)

1. As an authenticated user, I can keep my polls and come back later to access them.

2. As an authenticated user, I can share my polls with my friends.

3. As an authenticated user, I can see the aggregate results of my polls.

4. As an authenticated user, I can delete polls that I decide I don't want anymore.

5. As an authenticated user, I can create a poll with any number of possible items.

6. As an unauthenticated or authenticated user, I can see and vote on everyone's polls.

7. As an unauthenticated or authenticated user, I can see the results of polls in chart form. (This could be implemented using Chart.js or Google Charts.)

8. As an authenticated user, if I don't like the options on a poll, I can create a new option.

---

To use, first add .env files in root and /client. These files require info from Oauth application setup on your Github account.
Use yarn to install dependencies within root and /client directories.

For development, type 'npm run dev'

For production, First run 'npm run build' within /client, then run 'npm start' from root.

To deploy to Heroku: create and checkout a deploy branch, build client app after setting proper env variables, remove build directory from .gitignore so files included in commit, and then push this branch to heroku master.
