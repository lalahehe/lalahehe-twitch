# lalahehe-twitch
This repository contains samples implementation for the StreamerEventViewer (SEV) coding assignment. It is written with Express using MongoDB as the database. Socket.IO is used for the websockets tasks.  

### Link to live demo 
[Heroku](https://lalahehe-twitch.herokuapp.com/)

### Link to git repo
[Github](https://github.com/lalahehe/lalahehe-twitch)

### Answers to questions
* How would you deploy the above on AWS? (ideally a rough architecture diagram will help)

The current implementation did not separate the different services from the all-in-one server. The server did all things like serving static contents, performing dynamic web requests, subscribing to Twitch webhooks services, handling Twitch webhooks callbacks and providing the websockets functions. The implemention was not scalable because if we add more servers behind a load balancer, the Twitch webhooks callbacks may route to different server that would not be able to dispatch the topic to the client correctly. Therefore the only way to deploy this implementation is to use one app server only, one example of the architecture for deployment would be look like the diagram below. 

![initial solution](https://user-images.githubusercontent.com/11274283/51818460-e46e3a00-2283-11e9-99ae-92bd5cf89dc8.png)

* Where do you see bottlenecks in your proposed architecture and how would you approach scaling this app starting from 100 reqs/day to 900MM reqs/day over 6 months?

The bottlenecks would be the loading for that only one app server. It must not be able to serve users in a production environment. To scale the application, one way is to add a message queue to the system. The Twitch webhooks callbacks requests would be huge and it should be separated from the app servers, by doing this the loading from the client users could be separated from those from Twitch. The topics from Twitch would now go to the message queue instead of dispatching to different websockets immediately, by doing this we get the control of the speed and how we processed the incoming topics before dispatching to different websockets by the topics dispatch workers. A possible architecture for a scalable deployment would be look like the diagram below. The proposed solution gives us freedom to control the number of app servers, Twitch webhooks callbacks servers, and the topics dispatch workers separately. 

![scalable solution](https://user-images.githubusercontent.com/11274283/51818499-12537e80-2284-11e9-9769-926a5f7b40ac.png)
