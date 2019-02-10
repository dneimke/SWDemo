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
* [ServiceWorker](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker) [ [CanIUse](https://caniuse.com/#search=ServiceWorkers) ] - Used to cache resources for use offline
* [Rxjs](https://github.com/ReactiveX/rxjs) - TODO: Implement Rxjs to expose observables for things such as online/offline state changed and localStorage state
* [Custom events](https://javascript.info/dispatch-events) - TODO: Implement custom dispatch events on the state to pass data to the tool and beyond more effectiently

The key goal is to have tools run in either online or offline mode on iPad.  According to CanIUse, all key HTML5 technologies are supported by Safari 10 and above.

## Application

The application has a single tool that allows the user to create Plans (kinda like Todo lists).  
It has a Home page and a Planner page.  The Planner page hosts the tool.

![Application Menu](/images/application-menu.jpg)

You can start a new plan by clicking the 'Create New Plan' button.

![Save dialog](/images/create-new-plan.png)

And then you enter items.  The items are bound to a list in the user interface as they are added.

![Save dialog](/images/create-plan.png)

When you've finished adding items to the plan you can click 'Save Plan' to save the plan.  At that point a confirmation dialog is displayed.
Currently the dialog just displays another view of the list of items and, it will allow the user to give a unique name to the plan (not currently implemented).

![Save dialog](/images/saving.png)

The application uses an agent that detects whether or not the user is online to determine whether to save locally or, whether to save against an online API.

![Save dialog](/images/data-agent.png)

Whenever there is data stored locally, the user is presented with a message to let them know that they have data that needs to be synchronized online.

![Local data warning message](/images/local-data-warning.png)
