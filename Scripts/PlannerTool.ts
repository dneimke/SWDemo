import { ApplicationDataAgent } from "./Data/data-agent";
let ko = require('knockout') as KnockoutStatic;

export class PlannerTool {

    private _plannerContainer: HTMLElement;

    constructor() {
        this._plannerContainer = document.getElementById('planner-tool');
    }

    init() {
        ko.applyBindings(new ToolState(), this._plannerContainer);
    }
}


class ToolState {
    isNew = ko.observable(true);
    task = ko.observable('');
    tasks = ko.observableArray<string>();
    canSave = ko.observable(false);
    hasOfflineData = ko.observable(false);

    private _dialog = new CompletePlanDialog();
    private _agent = new ApplicationDataAgent();

    constructor() {
        this._agent.hasOfflineData().then(result => {
            this.hasOfflineData(result);
        });
    }

    isOnline() {
        return navigator.onLine;
    }

    reset() {
        this.isNew(true);
        this.task('');
        this.tasks.removeAll();
        this.canSave(false);
        this._agent.hasOfflineData().then(result => {
            this.hasOfflineData(result);
        });
    }

    addTask(): void {
        const t = this.task();
        this.tasks.push(t);
        this.task('');

        const canSave = this.tasks().length > 0;
        this.canSave(canSave);
    }

    create(e: Event) {
        this.isNew(false);
    }
    
    async save (e: Event) {

        let tasks = this.tasks();
        let result = await this._dialog.show(tasks);

        if (result.result === true) {
            this._agent.save(result.name, tasks);
            this.reset();
        }

        this._dialog.hide();
    }
}


class DialogState {
    isOffline = ko.observable(false);
    tasks = ko.observableArray();

    changeTasks(tasks: string[]) {
        this.tasks.removeAll();
        tasks.forEach(t => this.tasks.push(t));
    }
}

export interface CompletePlanDialogResult {
    name: string;
    result: boolean;
}



class CompletePlanDialog {

    private _dfd: JQueryDeferred<CompletePlanDialogResult>;

    private _dialogSelector = 'save-dialog';
    private _contentSelector = 'dialog-content';
    private _saveSelector = 'save-button';

    private _saveButton: HTMLButtonElement;
    private _dialogElement: HTMLElement;
    private _dialogContentContainer: HTMLElement;
    private _dialogState: DialogState = new DialogState();

    constructor() {
        let that = this;

        this._dialogElement = document.getElementById(this._dialogSelector);
        this._dialogContentContainer = document.getElementById(this._contentSelector);
        this._saveButton = document.getElementById(this._saveSelector) as HTMLButtonElement;
        ko.applyBindings(this._dialogState, this._dialogContentContainer);

        $(this._dialogElement).on('hidden.bs.modal', function (e) {
            that._dfd.resolve({ name: '', result: false });
        });

        this._saveButton.addEventListener("click", (e) => {
            that._dfd.resolve({ name: new Date().getMilliseconds().toString(), result: true });
        });
    }

    show(tasks: string[]): JQueryPromise<CompletePlanDialogResult> {
        this._dfd = $.Deferred<CompletePlanDialogResult>();
        this._dialogState.changeTasks(tasks);
        $(this._dialogElement).modal('show');
        return this._dfd.promise();
    }

    hide(): void {
        $(this._dialogElement).modal('hide');
    }
}

