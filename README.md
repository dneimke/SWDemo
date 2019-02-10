# SWDemo
Playing around with offline web

Goal is to have an 'online first' approach but, within the website, have certain pages (tools) which work offline.

* Each tool should be totally functional offline
* Users should know when they have data that needs to be sync'd online
* The saving experience for each tool's state should let the user know that it is being stored offline

The application uses the following to achieve its results:

* [Knockout](https://knockoutjs.com) - Used to reduce manual handling of updating the user interface when state changes
* [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) [ [CanIUse](https://caniuse.com/#search=localStorage) ] - Used to store data locally when the user is offline
* [Online and offline events](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/Online_and_offline_events) [ [CanIUse](https://caniuse.com/#search=online) ] - Used to detect when the user's online state changes
* [ServiceWorker](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker) [ [CanIUse](https://caniuse.com/#search=ServiceWorkers) ]

The key goal is to have tools run in either online or offline mode on iPad.  According to CanIUse, all key HTML5 technologies are supported by Safari 10 and above.

## Application

The application has a Home page and a Planner page.  The Planner page hosts the tool.

![Application Menu](/blob/master/images/application-menu.jpg "Application Menu")