import { ApplicationDataAgent } from "./Data/data-agent";
let ko = require('knockout') as KnockoutStatic;



export class PlanningTool {

    private _planningToolContainer: HTMLElement;

    constructor() {
        this._planningToolContainer = document.getElementById('planning-tool');
    }

    init() {
        ko.applyBindings(new PlanningToolState(), this._planningToolContainer);
    }
}



// Separate class to maintain the state of the main Planning Tool UI.
// Down the track, the Planning Tool could host multiple bound UI 'components' which each hold their own state
class PlanningToolState {

    // State
    isNew = ko.observable(true);
    task = ko.observable('');
    tasks = ko.observableArray<string>();
    canSave = ko.observable(false);
    hasOfflineData = ko.observable(false);

    isOnline = () => navigator.onLine;

    constructor(private _agent = new ApplicationDataAgent(), private _dialog = new CompletePlanDialog()) {
        _agent.hasOfflineData().then(result => {
            this.hasOfflineData(result);
        });
    }

    // initializes the create plan user interface
    create(e: Event) {
        this.isNew(false);
    }
    
    // adds a new task to the current plan
    addTask(): void {
        const t = this.task();
        this.tasks.push(t);
        this.task('');

        const canSave = this.tasks().length > 0;
        this.canSave(canSave);
    }

    // launches a dialog and allows the user to save and complete the current plan
    async save (e: Event) {

        let tasks = this.tasks();
        let result = await this._dialog.show(tasks);

        if (result.result === true) {
            this._agent.save(result.name, tasks);
            this.reset();
        }
    }

    private reset() {
        this.isNew(true);
        this.task('');
        this.tasks.removeAll();
        this.canSave(false);
        this._agent.hasOfflineData().then(result => {
            this.hasOfflineData(result);
        });
    }
}


class CompletePlanDialog {

    // State
    isOffline = ko.observable(false);
    tasks = ko.observableArray();
    name = ko.observable('');

    private _dfd: JQueryDeferred<CompletePlanDialogResult>;
    private _dialogElement: HTMLElement;

    constructor() {
        this._dialogElement = document.getElementById('save-dialog');
        $(this._dialogElement).on('hidden.bs.modal', this.onHidden.bind(this));

        let dialogContentContainer = document.getElementById('dialog-content');
        ko.applyBindings(this, dialogContentContainer);
    }

    // Callable from external code to display the dialog
    show(tasks: string[]): JQueryPromise<CompletePlanDialogResult> {
        this._dfd = $.Deferred<CompletePlanDialogResult>();

        this.onChangeTasks(tasks); // HACK so that the bound UL displays correctly on re-binding
        this.name(new Date().getMilliseconds().toString()); // TEMP: remove when bound to UI input element

        $(this._dialogElement).modal('show');
        return this._dfd.promise();
    }

    // bound to Save button
    save(e: Event) {
        this._dfd.resolve({ name: this.name(), result: true });
        $(this._dialogElement).modal('hide');
    }

    private onHidden() {
        this._dfd.resolve({ name: '', result: false });
    }

    private onChangeTasks(tasks: string[]) {
        this.tasks.removeAll();
        tasks.forEach(t => this.tasks.push(t));
    }
}


export interface CompletePlanDialogResult {
    name: string;
    result: boolean;
}
