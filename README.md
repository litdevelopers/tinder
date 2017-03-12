# React Tinder
Super Charged Tinder web client - Incremental Storage, recommendation filtering, live chat, web notifications  
**Currently only supports Chrome due to Chrome Extension support** - Read more at https://medium.com/@paulxuca/tinder-tales-or-the-search-for-tinders-new-api-4d3a36e2542#.1ab1cvutd

# Introduction  
A tinder web client built in React & Redux Saga - 
React Tinder offers all the same features as the Tinder mobile application with some bonuses:  
- Web notifications! Get notified when you get a new match or message. 
- Incremental Storage: Have thousands of matches? Don't download them all again. Only load the **new** matches and messages.
- Figure out who has already liked you! So you only like those people and not waste your likes. (This feature only works if **tinder** can provide us with data to indicate as such thanks to @GrandmasterMeio)
- Want to pass instead of like? Go back to your history and change your mind in history.
- Live chat with matches.
- Update your location to travel around the world.

# Images  
![Profile Screen](https://raw.githubusercontent.com/litdevelopers/tinder/master/media/profile.png)
![Recommendations Screen](https://raw.githubusercontent.com/litdevelopers/tinder/master/media/recommendations.png)
![Messaging Screen](https://raw.githubusercontent.com/litdevelopers/tinder/master/media/messages.png)

# Usage
1. Fork or Clone the repository.
2. run ```npm install``` while in the directory of the project.
3. Open chrome and load in a new "unpacked extension" from the extensions screen.
4. Open project folder and load in the ```src``` folder in ```/chrome```.
5. Open ```/app/containers/auth/sagas.js/``` and edit the variable CHROME_EXTENSION_ID to the one found in your chrome extensions screen.  
6. run ```npm start``` in the root directory of the project.
7. Navigate to ```localhost:3000/login``` and the chrome extension will handle the login process.  
8. Find your soulmate.

# Road Map  
This project is still a heavy WIP (Work in Progress) and pull requests are always welcome. Todo:   
1. Polish up UI of the application  
2. Figure out a better way of handling high volume accounts (1000+ matches)  
3. Code refactoring and linting  
4. Implement matches searching and indexing



