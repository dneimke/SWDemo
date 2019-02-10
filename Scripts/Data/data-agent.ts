

export class ApplicationDataAgent {

    _agent: DataAgent;
    _onlineAgent = new OnlineAgent();

    constructor() {
        this._agent = navigator.onLine ? this._onlineAgent : new OfflineAgent();

        window.addEventListener('online', this.updateOnlineStatus.bind(this));
        window.addEventListener('offline', this.updateOnlineStatus.bind(this));
    }

    private updateOnlineStatus(event: Event) {
        console.info(`Switching to ${navigator.onLine}`)
        this._agent = navigator.onLine ? this._onlineAgent : new OfflineAgent();
    }

    save(name: string, tasks: string[]): Promise<boolean> {
        return this._agent.save(name, tasks);
    }

    fetch(name: string): Promise<string[]> {
        return this._agent.fetch(name);
    }

    hasOfflineData(): Promise<boolean> {
        const dfd = $.Deferred<boolean>();

        if (!localStorage.plannerData) {
            dfd.resolve(false);
        } else {
            let data: { [key: string]: string[] } = JSON.parse(localStorage.plannerData);
            dfd.resolve(data !== undefined && Object.keys(data).length > 0);
        }
        
        return dfd.promise();
    }
}


interface DataAgent {
    save(name: string, tasks: string[]): Promise<boolean>;
    fetch(name: string): Promise<string[]>;
}

class OnlineAgent implements DataAgent {

    private tasks: { [index: string]: string[] } = {};

    save(name: string, tasks: string[]): Promise<boolean> {
        const dfd = $.Deferred<boolean>();
        console.info('Online agent saving');

        this.tasks[name] = tasks;
        dfd.resolve(true);
        return dfd.promise();
    }

    fetch(name: string): Promise<string[]> {
        const dfd = $.Deferred<string[]>();
        console.info('Online agent fetching');
        dfd.resolve(this.tasks[name]);
        return dfd.promise();
    }
}


class OfflineAgent implements DataAgent {

    save(name: string, tasks: string[]): Promise<boolean> {
        const dfd = $.Deferred<boolean>();
        console.info('Offline agent saving.');

        let data: {[key: string]: string[]};
        if (localStorage.plannerData) {
            data = JSON.parse(localStorage.plannerData);
        } else {
            data = {};
        }

        data[name] = tasks;
        const json = JSON.stringify(data);
        localStorage.plannerData = json;
        
        dfd.resolve(true);
        return dfd.promise();
    }


    fetch(name: string): Promise<string[]> {
        const dfd = $.Deferred<string[]>();
        console.info('Offline agent fetching');

        if (localStorage.plannerData) {
            let data: { [key: string]: string[] } = JSON.parse(localStorage.plannerData);
            dfd.resolve(data[name]);
        } else {
            dfd.resolve([]);
        }

        return dfd.promise();
    }
}